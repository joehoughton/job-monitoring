using System;
using System.Linq;
using JH.Data.Models;
using JH.Data.Queries;
using Newtonsoft.Json;

namespace JH.Services
{
    public class JobMonitoringService : IJobMonitoringService
    {
        private readonly IJobQueries _jobQueries;
        private readonly IBookingQueries _bookingQueries;
        private readonly IChargeFactQueries _chargeFactQueries;

        public JobMonitoringService(IJobQueries jobQueries, IBookingQueries bookingQueries, IChargeFactQueries chargeFactQueries)
        {
            _jobQueries = jobQueries;
            _bookingQueries = bookingQueries;
            _chargeFactQueries = chargeFactQueries;
        }

        public JobMonitoringResponse AssembleJobForMonitoring(Guid bookingId, Guid jobId)
        {
            var monitoredJob = new JobMonitoringResponse();

            var bookingJobDetails = _jobQueries.GetBookingJobWithMonitoringDetails(bookingId, jobId);
            if (bookingJobDetails == null)
                throw new AssembleJobForMonitoringException(string.Format("Job {0} does not exist on booking {1}", jobId, bookingId));

            monitoredJob.MonitoringDetails = bookingJobDetails;
            monitoredJob.MonitoringDetails.ClientPassword = RetrievePasswordFromChargeFact("account.travelpolicy.passwordprotection", monitoredJob.MonitoringDetails.ClientId);

            var bookingLocation = _bookingQueries.GetBookingLocationFromAndTo(bookingId);
            if (bookingLocation.LocationFrom == null)
                throw new AssembleJobForMonitoringException(string.Format("Booking {0} does not have a pickup address", bookingId));

            monitoredJob.BookingLocation = bookingLocation;

            foreach (var task in _jobQueries.GetBookingJobMonitoringTasks(jobId).ToList())
            {
                monitoredJob.MonitoringTasks.Add(task);
            }

            return monitoredJob;
        }

        public string RetrievePasswordFromChargeFact(string name, Guid accountId)
        {
            try
            {
                string result = null;
                var chargeFact = _chargeFactQueries.GetByName(name, accountId).SingleOrDefault();

                if (chargeFact != null) {
                    var password = JsonConvert.DeserializeObject<dynamic>(chargeFact.Value).password;
                    result = password ?? null;
                }

                return result;
            }
            catch (AssembleJobForMonitoringException ex)
            {
                throw new AssembleJobForMonitoringException(
                    string.Format("Failed to retrieve charge fact with account id: {0} and name: {1}. " +
                                  "Exception message: {2}", accountId, name, ex.Message));
            }
        }

        public class AssembleJobForMonitoringException : Exception
        {
            private readonly string _message;

            public AssembleJobForMonitoringException(string message)
            {
                _message = message;
            }

            public override string Message
            {
                get { return _message; }
            }
        }
    }
}