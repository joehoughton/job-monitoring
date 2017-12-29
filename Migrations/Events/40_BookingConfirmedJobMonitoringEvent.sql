-- Async Task Runner Booking Confirmed Event
INSERT INTO [config].[asyncTaskRunners] (systemName, [description], isLocked)
VALUES
('booking-confirmed-job-monitoring', 'Creates job monitoring tasks on confirmation of booking', 0);

INSERT INTO [config].[asyncTaskRunnerFrameworkTypes] (frameworkTypeSystemName, asyncTaskRunnerSystemName)
VALUES
('booking', 'booking-confirmed-job-monitoring');