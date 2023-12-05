public with sharing class FieldLabelController {
    @AuraEnabled(cacheable=true)
    public static Map<String, String> getFieldLabels(String objectApiName, List<String> fieldApiNames) {
        Map<String, String> fieldLabels = new Map<String, String>();
        Map<String, Schema.SObjectField> fieldMap = Schema.getGlobalDescribe().get(objectApiName).getDescribe().fields.getMap();

        for (String fieldApiName : fieldApiNames) {
            if (fieldMap.containsKey(fieldApiName)) {
                fieldLabels.put(fieldApiName, fieldMap.get(fieldApiName).getDescribe().getLabel());
            }
        }

        System.debug('fieldLabels : ' + fieldLabels);

        return fieldLabels;
    }

    @AuraEnabled(cacheable=true)
    public static Map<String, String> getRecordName(Id recordId) {
        String objectName = recordId.getSObjectType().getDescribe().getName();
        SObject record = Database.query('SELECT Name FROM ' + objectName + ' WHERE Id = :recordId');
        System.debug('record : ' + record);
        // Dynamically get "Name" Field Label from recordId
        String fieldLabel = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get('Name').getDescribe().getLabel();
        return new Map<String, String>{fieldLabel => (String)record.get('Name')};
    }
}