Id recordId = '0015j00001TOdnoAAD';
String objectName = recordId.getSObjectType().getDescribe().getName();
System.debug(objectName);
Schema.DescribeSObjectResult dsr = Schema.getGlobalDescribe().get(objectName).getDescribe();
System.debug(dsr);

String tmp = Schema.getGlobalDescribe().get(objectName).getDescribe().fields.getMap().get('Name').getDescribe().getLabel();
System.debug(tmp);

//String label = Schema.getGlobalDescribe().get(objectName).fields.getMap().get('Name').getDescribe().getLabel();

//String label = Schema.getGlobalDescribe().get(objectName).fields.getMap().get('Name').getDescribe().getLabel();
System.debug(label);

String obj = 'Account';
SELECT Id FROM :=obj
