# Custom Review Screen For Salesforce Scheduler Flow
Push the button below to install this package.  
<div>
    <a href="https://githubsfdeploy.herokuapp.com?owner=mkzyk&repo=CustomReviewScreenForSchedulerFlow">
        <img alt="Deploy to Salesforce"
        src="https://raw.githubusercontent.com/afawcett/githubsfdeploy/master/deploy.png">
    </a>
</div>
    
## Images
<img width="70%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/0b92f5a0-56be-437c-b2c1-9ab3d53d48e9">



## You may have these requirements...
- You don't want to develop all the pages and you would like to utilize standard Salesforce Scheduler functionality.  
- The end-users input some value before making an appointment and save the value to the Service Appointment custom field.  
- The Review Screen must be pre-populated with the value of a custom field from Service Appointment.
- There are some fields you want to remove on Review Screen that are not allowed in standard component.

## Configuration
1. Open your Scheduler flow.
2. Open `Review Screen` Element.
3. Place `Custom Review Screen For Scheduler Flow` and delete standard component `Review Inbound or Outbound Service Appointment`.
4. Set these input field.  

| Input Fields               | Description                                                                                                                                                                           | Required |
|----------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|
| Is Modified Appointment?   | Set `{!$GlobalConstant.False}` for new appointment. Set True for modified appointment.                                                                                                  | True     |
| Service Appointment Record | Set `{!ServiceAppointment}` record variable from your flow                                                                                                                              | True     |
| Service Resources Variable | **COMPLICATED PART:** if `{disableMultiResource}` == False (Multi-Resource Scheduling is enabled), Set `{!serviceResources}` text variable from your flow. If  `{disableMultiResource}` == True ((Multi-Resource Scheduling is disabled)), Set `{!ServiceResourceId}.`                                                                                                                                | True     |
| Work Type Group Id         | Set `{!workTypeGroupId}` text variable from your flow                                                                                                                                   | True     |
| Lead                       | Set `{!Lead}` record variable from your flow, if this booking is Guest Inbound Appointment                                                                                                                                   |      |
| Excluded Fields            | Set Field API Name separated comma without space. Specified fields are not displayed on Review Screen.  i.e. `Comments,AdditionalInformation,IsAnonymousBooking,EngagementChannelTypeId` |          |
| Show Map                   | Whether displaying a map below address field. Default is false.   Set `{!$GlobalConstant.False}` or `{!$GlobalConstant.False}`.                                                             |          |
| Show Service Resources     | Whether displaying Service Resource Info.   Set `{!$GlobalConstant.False}` or `{!$GlobalConstant.False}`.                                                                                   |          |


5. Set Output field from LWC. Open Advanced section and turn on `Manually assign variables`, assgin it to text variable. (you may need to create a new text variable)  
Any API name can be used.
    
    <img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/8c702ae4-5293-44cc-9776-1300f4c9af4f">  

6. Open `Save Appointment` element. Replace `Service Appointment Fields` with the variable you assigned at Step 5.
   
    <img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/de1de0d4-38c2-4c09-b5c6-0288b6d67c5c">  

7. Save your flow and debug it, once you are satisfied with your result, make it Activate.

**NOTES:** When you want to use this component on Guest Appointment, please create additional screen component to input Lead info.
     
<img width="50%" alt="image" src="https://github.com/mkzyk/CustomReviewScreenForSchedulerFlow/assets/20549208/b6adf7b7-8d5d-4b89-9b4c-283d3faa33e5">  
    
This component only displays `{!Lead}` record value from Flow input. Please understand that in this way, you can add another custom fields on Lead as well.  


