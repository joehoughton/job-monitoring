-- Job Monitoring Task Phase Plans
MERGE INTO [config].[phasePlans]  AS Target
USING (VALUES
('task-job-monitoring-first-contact-states', 'task-job-monitoring-first-contact', 'Job Monitoring First Contact Task Phase Model', 1),
('task-job-monitoring-second-contact-states', 'task-job-monitoring-second-contact', 'Job Monitoring Second Contact Task Phase Model', 1),
('task-job-monitoring-final-contact-states', 'task-job-monitoring-final-contact', 'Job Monitoring Final Contact Task Phase Model', 1)
) AS Source (systemName, frameworkTypeSystemName, name, isPrimaryState) ON Target.systemName = Source.systemName
WHEN MATCHED THEN UPDATE SET frameworkTypeSystemName=Source.frameworkTypeSystemName, name=Source.name, isPrimaryState=Source.isPrimaryState
WHEN NOT MATCHED THEN 
INSERT (systemName, frameworkTypeSystemName, name, isPrimaryState)
VALUES (Source.systemName, Source.frameworkTypeSystemName, Source.name, Source.isPrimaryState);

-- Job Monitoring Task Phases 
MERGE INTO [config].[phases]  AS Target 
USING (VALUES
('task-job-monitoring-first-contact-incomplete', 'task-job-monitoring-first-contact-states', 'Incomplete', 'Incomplete', 'indent', 1, 0, null, 0, null, null),
('task-job-monitoring-first-contact-complete', 'task-job-monitoring-first-contact-states', 'Complete', 'Complete', 'indent', 0, 0, null, 0, null, null),
('task-job-monitoring-second-contact-incomplete', 'task-job-monitoring-second-contact-states', 'Incomplete', 'Incomplete', 'indent', 1, 0, null, 0, null, null),
('task-job-monitoring-second-contact-complete', 'task-job-monitoring-second-contact-states', 'Complete', 'Complete', 'indent', 0, 0, null, 0, null, null),
('task-job-monitoring-final-contact-incomplete', 'task-job-monitoring-final-contact-states', 'Incomplete', 'Incomplete', 'indent', 1, 0, null, 0, null, null),
('task-job-monitoring-final-contact-complete', 'task-job-monitoring-final-contact-states', 'Complete', 'Complete', 'indent', 0, 0, null, 0, null, null)
) AS Source (systemName, phasePlanSystemName, name, shortName, iconClass, isStart, isOpen, expectedDurationSeconds, isReportable, meaningCode, displayOrder) ON Target.systemName = Source.systemName
WHEN MATCHED THEN UPDATE SET phasePlanSystemName=Source.phasePlanSystemName, name=Source.name, shortName=Source.shortName, iconClass=Source.iconClass, isStart=Source.isStart, isOpen=Source.isOpen, expectedDurationSeconds=Source.expectedDurationSeconds, isReportable=Source.isReportable, meaningCode=Source.meaningCode, displayOrder=Source.displayOrder
WHEN NOT MATCHED THEN
    INSERT (systemName, phasePlanSystemName, name, shortName, iconClass, isStart, isOpen, expectedDurationSeconds, isReportable, meaningCode, displayOrder)
    VALUES (Source.systemName, Source.phasePlanSystemName, Source.name, Source.shortName, Source.iconClass, Source.isStart, Source.isOpen, Source.expectedDurationSeconds, Source.isReportable, Source.meaningCode, Source.displayOrder);

-- Job Monitoring Task Phase Transitions
INSERT INTO [config].[phaseTransitions] 
(systemName, fromPhaseSystemName, toPhaseSystemName, name, transitionWaitTimeSeconds, isOptimumPath, isUserDriven, reasonSelectMenuName)
VALUES
('task-job-monitoring-first-contact-incomplete-to-complete', 'task-job-monitoring-first-contact-incomplete', 'task-job-monitoring-first-contact-complete', 'Incomplete to Complete', 0, 1, 1, null),
('task-job-monitoring-first-contact-complete-to-incomplete', 'task-job-monitoring-first-contact-complete', 'task-job-monitoring-first-contact-incomplete', 'Complete to Incomplete', 0, 1, 1, null),
('task-job-monitoring-second-contact-incomplete-to-complete', 'task-job-monitoring-second-contact-incomplete', 'task-job-monitoring-second-contact-complete', 'Incomplete to Complete', 0, 1, 1, null),
('task-job-monitoring-second-contact-complete-to-incomplete', 'task-job-monitoring-second-contact-complete', 'task-job-monitoring-second-contact-incomplete', 'Complete to Incomplete', 0, 1, 1, null),
('task-job-monitoring-final-contact-incomplete-to-complete', 'task-job-monitoring-final-contact-incomplete', 'task-job-monitoring-final-contact-complete', 'Incomplete to Complete', 0, 1, 1, null),
('task-job-monitoring-final-contact-complete-to-incomplete', 'task-job-monitoring-final-contact-complete', 'task-job-monitoring-final-contact-incomplete', 'Complete to Incomplete', 0, 1, 1, null)