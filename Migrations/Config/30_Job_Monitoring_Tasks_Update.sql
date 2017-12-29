-- Make incomplete tasks visible in the worklist
UPDATE [config].[phases]
SET isOpen = 1
WHERE systemName IN ('task-job-monitoring-first-contact-incomplete',
                     'task-job-monitoring-second-contact-incomplete',
                     'task-job-monitoring-final-contact-incomplete');