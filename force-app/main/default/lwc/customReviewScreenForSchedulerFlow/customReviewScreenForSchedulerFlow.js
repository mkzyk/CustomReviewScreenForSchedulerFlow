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
    @api serviceResourceIds;
    @api showMap;

    @track items = [];
    @track workTypeGroupLabel;
    fieldApiNames = [];
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

    connectedCallback() {
        console.log('Input Service Appointment : ' + JSON.stringify(this.serviceAppointmentRecord));
        
        if(typeof(this.excludedFields) !== 'undefined') {
            this.excludedFieldsArr = this.excludedFields.split(',');
            console.log('Input Excluded Fields : ' + this.excludedFieldsArr);
        }

        // Exclude Address fields for displaying
        this.excludedFieldsArr.push('Street', 'City', 'State', 'PostalCode', 'Country');

        // Unnecessary Field for Output
        this.excludedFieldsArr.push('EngagementChannelTypeId');

        for(let key in this.serviceAppointmentRecord) {
            // Exclude the fields specified from a flow
            if(!this.excludedFieldsArr.includes(key)) {
                let value = this.serviceAppointmentRecord[key];
                // If value is ID type data, get a value by RecordId
                if (this.checkValueIsIdType(value)) {
                    this.getRecordNameByRecordId(key, value);
                } else {
                    // If value is DateTime, convert it to fomatted date time
                    if (DATE_PATTERN_REGEX.test(value) & !isNaN(Date.parse(value))) {
                        value = this.formatUTCDateTime(value);
                    }
                    this.items.push({apiName: key, value: value, name: ''});
                    this.fieldApiNames.push(key);
                }
            }
        }
        // Get Service Appointment Field Label
        this.updateFieldLabels('ServiceAppointment');
    }

    // Get the field labels
    async updateFieldLabels(objectApiName) {
        try {
            const result = await getFieldLabels({ objectApiName: objectApiName, fieldApiNames: this.fieldApiNames });
            console.log('result - ' + JSON.stringify(result));
            for (let item of this.items) {
                if(item.name === '') {
                    item.name = result[item.apiName];
                }
            }
            console.log('this item - ' + JSON.stringify(this.items));
        } catch(e) {
            console.error(e);
        }
    }

    // Get Record Name by recordId
    async getRecordNameByRecordId(key, recordId) {
        try {
            const result = await getRecordName({recordId: recordId});
            console.log('result - with recordName : ' + JSON.stringify(result));
            let fieldName = Object.keys(result)[0];
            let value = Object.values(result)[0];
            this.items.push({apiName: key, value: value, name: fieldName});
        } catch(e) {
            console.error(e);
        }
    }

    checkValueIsIdType(value) {
        return ID_TYPE_REGEX.test(value);
    }

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

    @api
    get outputJson() {
        return JSON.stringify(this.serviceAppointmentRecord);
    }
}