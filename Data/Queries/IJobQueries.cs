using System;
using JH.Data.Models;

namespace JH.Data.Queries
{
    public interface IJobQueries
    {
        JobMonitoringDetailsModel GetBookingJobWithMonitoringDetails(Guid bookingId, Guid jobId);
        IEnumerable<EntityAttributeValue> GetBookingJobMonitoringTaskAttributes(Guid jobId);
    }
}