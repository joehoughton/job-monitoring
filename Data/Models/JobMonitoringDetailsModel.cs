using System;

namespace JH.Data.Models
{
    public class JobMonitoringDetailsModel
    {
        public Guid VehicleFulfillmentId { get; set; }
        public Guid SupplierId { get; set; }
        public string SupplierName { get; set; }
        public string SupplierTelephoneNumber { get; set; }
        public string SupplierAccountNumber { get; set; }
        public Guid ClientId { get; set; }
        public string ClientName { get; set; }
        public string ClientPassword { get; set; }
        public DateTime PickUpDateTime { get; set; }
        public string LeadPassengerName { get; set; }
        public bool PickupAsap { get; set; }
    }
}