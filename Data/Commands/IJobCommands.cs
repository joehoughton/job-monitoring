using System;

namespace JH.Data.Commands
{
    public interface IJobCommands
    {
        void CreateBookingJobMonitoringTasks(Guid bookingId);
    }
}