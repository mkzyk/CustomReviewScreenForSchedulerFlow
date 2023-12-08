# Custom Review Screen For Salesforce Scheduler Flow
<div>
    <a href="https://githubsfdeploy.herokuapp.com?owner=mkzyk&repo=CustomReviewScreenForSchedulerFlow">
        <img alt="Deploy to Salesforce"
        src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
    </a>
</div>

## Requirements
- You don't want to develop all the pages and you would like to utilize standard Salesforce Scheduler functionality.  
- The end-users input some value before making an appointment and save the value to the Service Appointment custom field.  
- The Review Screen must be pre-populated with the value of a custom field from a Service Appointment.  

## Configuration
1. Open your Scheduler flow.
2. Open `Review Screen` Element.
3. Place `Custom Review Screen For Scheduler Flow` and delete standard component `Review Inbound or Outbound Service Appointment`.
4. Set these input field.  

| Input Fields               | Description                                                                                                                                                                           | Required |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Is Modified Appointment?   | Set `{!$GlobalConstant.False}` for new appointment. Set True for modified appointment.                                                                                                  | True     |
| Service Appointment Record | Set `{!ServiceAppointment}` record variable from your flow                                                                                                                              | True     |
| Service Resources Variable | Set `{!serviceResources}` text variable from your flow                                                                                                                                  | True     |
| Work Type Group Id         | Set `{!workTypeGroupId}` text variable from your flow                                                                                                                                   | True     |
| Excluded Fields            | Set Field API Name separated comma without space. Specified fields are not displayed on Review Screen.  i.e. `Comments,AdditionalInformation,IsAnonymousBooking,EngagementChannelTypeId` |          |
| Show Map                   | Whether displaying a map below address field. Default is false.   Set `{!$GlobalConstant.False}` or `{!$GlobalConstant.False}`.                                                             |          |
| Show Service Resources     | Whether displaying Service Resource Info.   Set `{!$GlobalConstant.False}` or `{!$GlobalConstant.False}`.                                                                                   |          |

<img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/cc6701e2-85f5-4525-be08-41192156a3d2">  


5. Set Output field from LWC. Open Advanced section and turn on `Manually assign variables`, assgin it to text variable. (you may need to create a new text variable)  
Any API name can be used.  
<img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/8c702ae4-5293-44cc-9776-1300f4c9af4f">  

6. Open `Save Appointment` element. Replace `Service Appointment Fields` with the variable you assigned at Step 5.  
<img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/de1de0d4-38c2-4c09-b5c6-0288b6d67c5c">  

7. Save your flow and debug it, once you are satisfied with your result, make it Activate. DONE.

