using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using JH.Data.Commands;
using JH.Data.Queries;
using JH.Data.Models;
using JH.Modules;
using JH.Services; 
using Nancy;
using Nancy.Extensions;
using Nancy.ModelBinding;
using ILogger = Framework.Logging.ILogger;

namespace JH.Modules
{
    public class BookingModule : NancyModule
    {
        private readonly IJobCommands _jobCommands;
        private readonly IJobMonitoringService _jobMonitoringService;
        private readonly ILogger _logger;

        public BookingModule(IJobCommands jobCommands, IJobMonitoringService jobMonitoringService, ILogger logger)
        {
            _jobCommands = jobCommands;
            _jobMonitoringService = jobMonitoringService;
            _logger = logger;

            Get["/api/bookings/{bookingId:guid}/jobMonitoring/{jobId:guid}"] = _ => GetBookingJobMonitoringDetails(_.bookingId, _.jobId);
            Post["/api/bookings/{bookingId:guid}/createBookingJobMonitoringTasks"] = _ => CreateBookingJobMonitoringTasks(_.bookingId);
        }

        private dynamic CreateBookingJobMonitoringTasks(Guid bookingId)
        {
            _logger.Information("post /api/bookings/{0}/createBookingJobMonitoringTasks/{1}/ called", bookingId);

            try
            {
                _jobCommands.CreateBookingJobMonitoringTasks(bookingId);

                return HttpStatusCode.OK;
            }
            catch (Exception exception)
            {
                _logger.Error(exception, "CreateBookingJobMonitoringTasks threw an exception");

                return HttpStatusCode.InternalServerError;
            }
        }

        private dynamic GetBookingJobMonitoringDetails(Guid bookingId, Guid jobId)
        {
            _logger.Information("get /api/bookings/{0}/jobMonitoring/{1} called", bookingId, jobId);

            try
            {
                return _jobMonitoringService.AssembleJobForMonitoring(bookingId, jobId);
            }
            catch (JobMonitoringService.AssembleJobForMonitoringException exception)
            {
                _logger.Error(exception, "GetBookingJobMonitoringDetails threw an exception");
                return HttpStatusCode.NotFound;
            }
            catch (Exception exception)
            {
                _logger.Error(exception, "GetBookingJobMonitoringDetails threw an exception");
                return HttpStatusCode.InternalServerError;
            }
        }
    }
}