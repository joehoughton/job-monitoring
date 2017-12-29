DECLARE @selectMenuName varchar(40) = 'job-monitoring-status-types';

MERGE INTO [ods].[SelectMenus]  AS Target 
USING (VALUES 
(@selectMenuName, 'Job Monitoring Status Types', 'List of different types for a job monitoring status', 0)
) AS Source (selectMenuName, name, [description], allowHierarchy) ON Target.selectMenuName = Source.selectMenuName
WHEN MATCHED THEN UPDATE SET Name=Source.Name
WHEN NOT MATCHED THEN 
  INSERT (selectMenuName, name, [description], allowHierarchy) 
  VALUES (Source.selectMenuName, Source.name, Source.[description], Source.allowHierarchy);

DECLARE @startId int = (SELECT MAX(id) FROM ods.selectMenuValues) + 10;

insert into ods.selectMenuValues (selectMenuName, id, name, shortname, parentValueId)
values 
(@selectMenuName, @startId + 0, 'Picked up on time', 'picked-up-on-time', null),
(@selectMenuName, @startId + 1, 'Picked up late', 'picked-up-late', null),
(@selectMenuName, @startId + 2, 'No answer from Supplier', 'no-answer-from-supplier', null),
(@selectMenuName, @startId + 3, 'Cancelled', 'cancelled', null),
(@selectMenuName, @startId + 4, 'Stood Down', 'stood-down', null),
(@selectMenuName, @startId + 5, 'Not checked (put reason in notes)',	'not-checked', null),
(@selectMenuName, @startId + 6, 'Car Late (Supplier Error)',	'car-late-supplier-error',	null),
(@selectMenuName, @startId + 7, 'Car Late (Agent Error)','car-late-agent-error', null),
(@selectMenuName, @startId + 8, 'Not Booked (Agent Error)','not-booked-agent-error', null),
(@selectMenuName, @startId + 9, 'Not Booked (Supplier Error)', 'not-booked-supplier-error',	null),
(@selectMenuName, @startId + 10, 'Wrong Journey Details (Agent Error)', 'wrong-journey-details-agent-error',	null),
(@selectMenuName, @startId + 11, 'Wrong Journey Details (Supplier Error)', 'wrong-journey-details-supplier-error', null);