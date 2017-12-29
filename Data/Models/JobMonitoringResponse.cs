using System.Collections.Generic;

namespace JH.Data.Models
{
    public class JobMonitoringResponse
    {
        public JobMonitoringResponse()
        {
            MonitoringTasks = new List<JobMonitoringTaskModel>();
        }

        public JobMonitoringDetailsModel MonitoringDetails { get; set; }
        public BookingLocation BookingLocation { get; set; }
        public IList<JobMonitoringTaskModel> MonitoringTasks { get; set; }
    }
}