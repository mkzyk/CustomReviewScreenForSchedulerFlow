import { LightningElement, api, track } from 'lwc';
import getFieldLabels from '@salesforce/apex/FieldLabelController.getFieldLabels';
import getRecordName from '@salesforce/apex/FieldLabelController.getRecordName';
import TIME_ZONE from '@salesforce/i18n/timeZone';
import LANG from '@salesforce/i18n/lang';
import customLabels from './labels';

// use Regex to check UTC Date format
const DATE_PATTERN_REGEX = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
// use Regex to check ID type data
const ID_TYPE_REGEX = /^(?=.*[a-zA-Z])[a-zA-Z0-9]{15}$|^(?=.*[a-zA-Z])[a-zA-Z0-9]{18}$/;

export default class CustomReviewScreenForSchedulerFlow extends LightningElement {
    @api serviceAppointmentRecord;
    @api excludedFields;
    @api workTypeGroupId;
    @api serviceResources;
    @api showMap;
    @api showServiceResources;
    @api isSlotChanged;
    @api leadRecord;

    @track items = [];
    @track scheduledTimes = [];
    @track serviceResourceItems = [];
    @track leadItems = [];

    fieldApiNamesSA = [];
    fieldApiNamesLead = [];
    excludedFieldsArr = [];

    LABELS = customLabels;

    get street() {
        return this.serviceAppointmentRecord['Street'];
    }
    get city() {
        return this.serviceAppointmentRecord['City'];
    }
    get state() {
        return this.serviceAppointmentRecord['State'];
    }
    get postalCode() {
        return this.serviceAppointmentRecord['PostalCode'];
    }
    get country() {
        return this.serviceAppointmentRecord['Country'];
    }
    get isShowingMap() {
        return typeof this.showMap === 'undefined' ? false : this.showMap;
    }

    async connectedCallback() {
        console.log('Input Service Appointment : ' + JSON.stringify(this.serviceAppointmentRecord));
        let promises = [];
        
        if(typeof(this.excludedFields) !== 'undefined') {
            this.excludedFieldsArr = this.excludedFields.split(',');
            console.log('Input Excluded Fields : ' + this.excludedFieldsArr);
        }

        // Exclude Address fields for displaying
        this.excludedFieldsArr.push('Street', 'City', 'State', 'PostalCode', 'Country');

        // Get WorkTypeGroupId record value, and label name
        if(typeof(this.workTypeGroupId) !== 'undefined') {
            if(!this.excludedFieldsArr.includes('workTypeGroupId')) {
                // add workTypeGroupId to display items
                promises.push(this.getRecordLabelAndValueByRecordId('workTypeGroupId', this.workTypeGroupId, this.items));
            }
        }

        for(let key in this.serviceAppointmentRecord) {
            // Exclude the fields specified from a flow
            if(!this.excludedFieldsArr.includes(key)) {
                let value = this.serviceAppointmentRecord[key];
                // If value is ID type data, get a label and value by RecordId
                if (this.IsValueIdType(value)) {
                    promises.push(this.getRecordLabelAndValueByRecordId(key, value, this.items));
                } else {
                    // If value is DateTime, convert it to fomatted date time
                    if (DATE_PATTERN_REGEX.test(value) & !isNaN(Date.parse(value))) {
                        value = this.formatUTCDateTime(value);
                    }
                    this.items.push({apiName: key, value: value, name: ''});
                    this.fieldApiNamesSA.push(key);
                }
            }
        }

        // Set Service Resource Display items
        if(typeof(this.showServiceResources) !== 'undefined') {
            if(this.showServiceResources) {
                if(this.IsValueIdType(this.serviceResources)) {
                    promises.push(this.getRecordLabelAndValueByRecordId('PrimaryServiceResource', this.serviceResources, this.serviceResourceItems));
                } else {
                    this.setServiceResourceData();
                }
            }
        } else {
            this.showServiceResources = false;
        }

        // Get Lead record field api names
        if(typeof(this.leadRecord) !== 'undefined') {
            for(let key in this.leadRecord) {
                this.leadItems.push({apiName: key, value: value, name: ''});
                this.fieldApiNamesLead.push(key);
            }
        }

        try {
            // Need to render all Ids values are set in displaying items
            await Promise.all(promises);
            // Get Service Appointment Fields Label
            this.getAllFieldsLabel('ServiceAppointment', this.fieldApiNamesSA, this.items);
            if(this.fieldApiNamesLead.length !== 0) {
                this.getAllFieldsLabel('Lead', this.fieldApiNamesLead, this.leadItems);
            }
        } catch(e) {
            console.error(e);
        }

    }

    // Get Record label and value by recordId
    async getRecordLabelAndValueByRecordId(key, recordId, displayItems) {
        try {
            const result = await getRecordName({recordId: recordId});
            console.log('result - Apex getRecordName : ' + JSON.stringify(result));
            let fieldName = Object.keys(result)[0];
            let value = Object.values(result)[0];
            displayItems.push({apiName: key, value: value, name: fieldName});
        } catch(e) {
            console.error(e);
        }
    }

    // Get field labels for specified object
    async getAllFieldsLabel(objectApiName, fieldApiNames, displayItems) {
        try {
            const result = await getFieldLabels({ objectApiName: objectApiName, fieldApiNames: fieldApiNames });
            console.log('result Apex getFieldLabels - ' + JSON.stringify(result));
            for (let item of displayItems) {
                if(item.name === '') {
                    item.name = result[item.apiName];
                }
            }
            console.log('displaying items - ' + JSON.stringify(displayItems));
            if(objectApiName === 'ServiceAppointment') {
                this.separateScheduledFields();
            }
        } catch(e) {
            console.error(e);
        }
    }

    // Check if a value is ID Type
    IsValueIdType(value) {
        return ID_TYPE_REGEX.test(value);
    }

    // Format UTC datetime to specified datetime value
    formatUTCDateTime(value) {
        let utcDate = new Date(value);
        let formatter = new Intl.DateTimeFormat(LANG, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false,
            timeZone: TIME_ZONE
        });
        let formattedValue = formatter.format(utcDate);
        console.log('formatted Date : ' + formattedValue);
        return formattedValue;
    }

    // Separate SchedStartTime and SchedEndTime from Display Items
    separateScheduledFields() {
        let schedStartTimeItem = this.items.find(item => item.apiName === 'SchedStartTime');
        let schedEndTimeItem = this.items.find(item => item.apiName === 'SchedEndTime');
        
        if (schedStartTimeItem && schedEndTimeItem) {
            this.scheduledTimes.push({apiName: 'SchedStartTime', value: schedStartTimeItem.value, name: schedStartTimeItem.name});
            this.scheduledTimes.push({apiName: 'SchedEndTime', value: schedEndTimeItem.value, name: schedEndTimeItem.name});
        
            this.items = this.items.filter(item => item.apiName !== 'SchedStartTime' && item.apiName !== 'SchedEndTime');
        }
    }

    // Set Service Resource Displaying Item
    setServiceResourceData() {
        let requiredResources = [];
        let optionalResources = [];
        let serviceResourcesObj = JSON.parse(this.serviceResources);

        for(let item of serviceResourcesObj) {

            if(item['AttendanceType'] === 'Primary') {
                this.serviceResourceItems.push({name: this.LABELS.reviewScreenServiceResourceColumnPrimary, value: item['Name']});
            } else if(item['AttendanceType'] === 'Required') {
                requiredResources.push(item['Name']);
            } else if(item['AttendanceType'] === 'Optional') {
                optionalResources.push(item['Name']);
            }
        }

        let requiredResourceNames = requiredResources.join(', ');
        let optionalResourceNames = optionalResources.join(', ');

        if(requiredResourceNames.length !== 0) {
            this.serviceResourceItems.push({name: this.LABELS.reviewScreenServiceResourceColumnRequired, value: requiredResourceNames});
        }
        if(optionalResourceNames.length !== 0) {
            this.serviceResourceItems.push({name: this.LABELS.reviewScreenServiceResourceColumnOptional, value: optionalResourceNames});
        }
        console.log('serviceResourceItems : ' + JSON.stringify(this.serviceResourceItems));
    }


    // Output to Flow
    @api
    get outputServiceAppointmentField() {
        let outputObj = JSON.parse(JSON.stringify(this.serviceAppointmentRecord));

        // Add WorkTypeGroupId
        outputObj.WorkTypeGroupId = this.workTypeGroupId;
        
        // Add isSlotChanged
        outputObj.IsSlotChanged = typeof this.isSlotChanged === 'undefined' ? false : this.isSlotChanged;

        // Add ServiceResourceId
        // When Multi Recourse is not enabled
        if(this.IsValueIdType(this.serviceResources)) {
            outputObj.ServiceResourceId = this.serviceResources;
        } else {
            // When Multi Recourse is enabled
            let serviceResourceId = JSON.parse(this.serviceResources).filter(obj => obj.AttendanceType === 'Primary').map(obj => obj.Id);
            outputObj.ServiceResourceId = serviceResourceId[0];
        }

        delete outputObj.EngagementChannelTypeId;
        console.log('output JSON : ' + JSON.stringify(outputObj));
        return JSON.stringify(outputObj);
    }

    @api
    get outputLeadRecord() {

    }
}