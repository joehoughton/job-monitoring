using System;
using System.Linq;
using JH.Data.Models;
using JH.Data.Queries;
using Newtonsoft.Json;

namespace JH.Services
{
    public interface IJobMonitoringService
    {
        JobMonitoringResponse AssembleJobForMonitoring(Guid bookingId, Guid jobId);
    }
}