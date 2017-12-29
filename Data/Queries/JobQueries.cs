using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using JH.Data.Entities;
using JH.Data.Models;
using JH.Data.Constants;
using PetaPoco;
using Framework.Data;
using Framework.Modules;
using Framework.Commands;
using System.Text;

namespace JH.Data.Queries
{
    public class JobQueries : IJobQueries
    {
        private readonly IFrameworkDatabase _db;
        private readonly IRelatedFrameworkQueries _relatedFrameworkQueries;
        private readonly IFrameworkCommands _frameworkCommands;

        public JobQueries(IFrameworkDatabase db, IRelatedFrameworkQueries relatedFrameworkQueries, IFrameworkCommands frameworkCommands)
        {
            _db = db;
            _relatedFrameworkQueries = relatedFrameworkQueries;
            _frameworkCommands = frameworkCommands;
        }

        public JobMonitoringDetailsModel GetBookingJobWithMonitoringDetails(Guid bookingId, Guid jobId)
        {
            var query = "SELECT DISTINCT VehicleFulfillmentId, SupplierId, " +
                            "supplier.Name as SupplierName, supplier.TelephoneNumber as SupplierTelephoneNumber, supplier.AccountNumber as SupplierAccountNumber, " +
                            "client.Name as ClientName, client.Id as ClientId, " +
                            "booking.PickupDateTime, booking.LeadPassengerName, booking.PickupAsap " +
                            "FROM jh.BookingVehicleRequest bvr " +
                            "INNER JOIN jh.VehicleRequestFulfillmentGroup vrfg on vrfg.BookingVehicleRequestId = bvr.Id " +
                            "INNER JOIN jh.VehicleFulfillment vr on vr.VehicleRequestFulfillmentGroupId = vrfg.Id " +
                            "INNER JOIN jh.mvJobs job on job.VehicleFulfillmentId = vr.Id " +
                            "INNER JOIN jh.Account supplier on supplier.Id = job.SupplierId " +
                            "INNER JOIN jh.Booking booking on bvr.BookingId = booking.Id " +
                            "INNER JOIN jh.BookingStop bks on bvr.BookingId = bks.BookingId " +
                            "INNER JOIN core.frameworks frameworkBooking on bvr.BookingId = frameworkBooking.id " +
                            "INNER JOIN jh.Account client on booking.ClientAccountId = client.Id " +
                            "WHERE bvr.BookingId = @0 " +
                            "AND job.id = @1";

            var job = _db.SingleOrDefault<JobMonitoringDetailsModel>(query, bookingId, jobId);

            return job;
        }
        public IEnumerable<EntityAttributeValue> GetBookingJobMonitoringTaskAttributes(Guid jobId)
        {
            var sql =
                Sql.Builder.Select("frameworkAttribute.*")
                    .From("core.frameworks frameworkJob")
                    .InnerJoin("core.frameworkRelationships sr").On("sr.ancestorId = frameworkJob.id")
                    .InnerJoin("core.tasks task").On("task.id = sr.descendantId")
                    .InnerJoin("core.frameworks frameworkTask").On("task.id = frameworkTask.id")
                    .InnerJoin("core.frameworkAttributes frameworkAttribute").On("frameworktask.id = frameworkAttribute.id")
                    .InnerJoin("jh.mvJobs job").On("job.id = frameworkJob.id")
                    .Where("job.id = (@0)", jobId);

            var taskAttributes = _db.Query<EntityAttributeValue>(sql);

            return taskAttributes;
        }        
    }
}