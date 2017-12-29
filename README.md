## Job Monitoring

![Alt text](Images/job-monitoring-1.JPG?raw=true "job-monitoring-1.JPG")
![Alt text](Images/job-monitoring-2.JPG?raw=true "job-monitoring-2.JPG")
![Alt text](Images/job-monitoring-3.JPG?raw=true "job-monitoring-3.JPG")
![Alt text](Images/job-monitoring-4.JPG?raw=true "job-monitoring-4.JPG")
![Alt text](Images/job-monitoring-5.JPG?raw=true "job-monitoring-5.JPG")
![Alt text](Images/job-monitoring-6.JPG?raw=true "job-monitoring-6.JPG")
![Alt text](Images/job-monitoring-7.JPG?raw=true "job-monitoring-7.JPG")
![Alt text](Images/job-monitoring-8.JPG?raw=true "job-monitoring-8.JPG")

**Given** that I am authorised  
**When** I have placed a booking  
**Then** I can see three tasks created to monitor each job on the booking  

**Given** that I have opened the monitoring page  
**Then** I can see all of the jobs associated with this booking  
**And** I can expand each one individually to see the following information:  
-	Tel, Account, Password, When, Lead Passenger, From, To  
-	First Contact (datetime of 24hrs before pick up datetime)  
-	Second Contact (datetime of 1hr before pick up)  
-	Final Contact (datetime of pick up datetime)  

**Given** that a job requires monitoring  
**When** a contact time is due (10 minutes before for pre-booked, 20 minutes after booked time for ASAP booking)  
**Then** the font colour of the task will be displayed in amber  
**And** the completed flag icon will be displayed  
**And** the note icon will be displayed  

**Given** that the first or second contact task icons have been displayed  
**When** I click the flag icon  
**Then** the related task is set to completed  
**And** the completed date of the task is set to the current datetime and displayed on screen  
**And** the user who completed the task is set to the current user and displayed on screen  
**And** the font colour of the task is changed to green  

**Given** that the first or second task note icons have been displayed  
**When** I click the note icon  
**Then** I am able to record and save a note against this task  
**And** the note is added onto the underlying task as a comment  

**Given** that I have selected the completed flag on the final contact task  
**When** I have chosen an option from the select menu  
**Then** I am able to save this selection  
**And** the related task is set to completed  
**And** the completed date of the task is set to the current date and time and displayed on screen  
**And** the user who completed the task is set to the current user and displayed on screen  
**And** the font colour of the task is changed to green  

**Given** that I am authorised  
**When** I open the monitoring panel by pressing the flag icon from first or second monitoring task  
**Then** I am able to view and edit the comments field  
**And** I am not able to see the final contact status select menu  
**And** the final status is not mandatory  

**Given** that I am authorised  
**When** I open the monitoring panel by pressing the flag icon from final contact  
**Then** I am able to view and edit the comments field  
**And** I am able to see the final contact status select menu  
**And** the monitoring final status is mandatory  

**Given** that the final contact flag and note icon have been displayed  
**When** I click the flag icon  
**Then** I am required to choose an option from a select menu  
**And** this information is stored against the booking for monitoring purposes  

**Given** that I am authorised  
**When** I open the monitoring panel by pressing the notes icon from any of the contact types  
**Then** I am able to view and edit the comments field  
**And** I am not able to see the final contact status select menu  
**And** the monitoring final status is not mandatory  

**Given** that I am authorised  
**When** I open the monitoring panel by pressing the notes icon or the comment icon  
**Then** I am able to cancel from the panel without saving any changes by using the cancel icon  