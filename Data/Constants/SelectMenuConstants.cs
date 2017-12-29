namespace JH.Data.Constants
{
    public static class SelectMenuConstants 
    {
		/// <summary>
		/// Select menu status types
		/// </summary>
		public enum JobMonitoringStatusTypes {
			PickedUpOnTime = 6767671,
			PickedUpLate = 6767672,
			NoAnswerFromSupplier = 6767673,
			Cancelled = 6767674,
			StoodDown = 6767675,
			NotCheckedPutReasonInNotes = 6767676,
			CarLateSupplierError = 6767677,
			CarLateAgentError = 676768,
			NotBookedAgentError = 6767679,
			NotBookedSupplierError = 6767610,
			WrongJourneyDetailsAgentError = 6767611,
			WrongJourneyDetailsSupplierError = 6767612
		}
	}
}
