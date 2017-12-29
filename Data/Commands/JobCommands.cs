using System;
using System.Collections.Generic;
using System.Linq;
using JH.Data.Queries;
using Framework;

namespace JH.Data.Commands
{
    public class JobCommands : IJobCommands
    {
        private readonly IFrameworkCommands _frameworkCommands;
        private readonly IJobQueries _jobQueries;
        private readonly ITaskDetailsCommands _taskDetailsCommands;
        private readonly IBookingQueries _bookingQueries;
        private readonly IBookingQuoteQueries _bookingQuoteQueries;

        public JobCommands(IFrameworkCommands frameworkCommands, IJobQueries jobQueries, ITaskDetailsCommands taskDetailsCommands, IBookingQueries bookingQueries, IBookingQuoteQueries bookingQuoteQueries)
        {
            _frameworkCommands = frameworkCommands;
            _jobQueries = jobQueries;
            _taskDetailsCommands = taskDetailsCommands;
            _bookingQueries = bookingQueries;
            _bookingQuoteQueries = bookingQuoteQueries;
        }

        public void CreateBookingJobMonitoringTasks(Guid bookingId)
        {
            var bookingFramework = _frameworkCommands.Load<FrameworkBase>(bookingId);
            var latestBookingQuoteId = _bookingQueries.GetLatestBookingQuoteForBooking(bookingId);
            var latestBookingQuote = _bookingQuoteQueries.GetById(latestBookingQuoteId, BookingQueryOption.None);

            var jobIds = _jobQueries.GetJobIds(bookingId);
            var monitoringTypes = new[] { "First", "Second", "Final" };

            foreach (var jobId in jobIds)
            {
                if (!latestBookingQuote.IsTracked) // only create tasks if tracking is enabled
                    continue;

                var jobMonitoringTasksExist = _jobQueries.GetBookingJobMonitoringTaskAttributes(jobId).Where(x => x.Attribute.Contains("job-monitoring-")).ToList().Any();

                if (jobMonitoringTasksExist) // tasks already exists for the given job id, don't create more on booking amend
                    continue;

                var jobFramework = _frameworkCommands.Load<FrameworkBase>(jobId);

                foreach (var monitoringType in monitoringTypes)
                {
                    CreateJobMonitoringTask(jobFramework, bookingFramework, monitoringType);
                }
            }
        }

        private TaskDetailsViewModel CreateJobMonitoringTask(FrameworkBase jobFramework, FrameworkBase bookingFramework, string monitoringType)
        {     
            var task = new TaskDetails
            {
                Title = string.Format("{0} Contact", monitoringType),
                ParentFrameworkId = jobFramework.Id,
                DueDateTime = DateTime.Now,
                PrimaryOwner = new Guid("B3BGA499-H051-4F56-G52K-2B2372250Z57"), // Team Leads
                Description = string.Format("Job reference {0}, on booking reference {1} requires monitoring for {2} Contact.", jobFramework.Reference, bookingFramework.Reference, monitoringType),
                Attributes = new Dictionary<string, string> {{ string.Format("job-monitoring-{0}-contact", monitoringType.ToLower()), jobFramework.Id.ToString() }},
                FrameworkTypeSystemName = string.Format("task-job-monitoring-{0}-contact", monitoringType.ToLower())
            };

            var taskDetails = (TaskDetailsViewModel)_taskDetailsCommands.Save(task);

            return taskDetails;
        }
    }
}