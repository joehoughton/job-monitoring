-- Create framework types for job monitoring tasks
INSERT INTO [config].[frameworkTypes] (systemName, systemNamePath, parentSystemName, frameworkTypeSchemaSystemName, name, description, iconClass, isActive, includeInReports, isAbstract, tileColour) 
VALUES
('task-job-monitoring-first-contact', '/task/job-monitoring-first-contact/', 'task', 'job-monitoring-first-contact', 'First Contact', 'A task to make the first contact when a booking is placed', 'fa-list', 1, 1, 0, '#3A734A'),
('task-job-monitoring-second-contact', '/task/job-monitoring-second-contact/', 'task', 'job-monitoring-second-contact', 'Second Contact', 'A task to make the second contact when a booking is placed', 'fa-list', 1, 1, 0, '#3A734A'),
('task-job-monitoring-final-contact', '/task/job-monitoring-final-contact/', 'task', 'job-monitoring-final-contact', 'Final Contact', 'A task to make the final contact when a booking is placed', 'fa-list', 1, 1, 0, '#3A734A')