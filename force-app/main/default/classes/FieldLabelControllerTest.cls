@isTest
private class FieldLabelControllerTest {

    @TestSetup
    static void makeUserData(){
        // Create a unique UserName
        String uniqueUserName = 'standarduser' + DateTime.now().getTime() + '@testorg.com';
        // This code runs as the system user
        Profile p = [SELECT Id FROM Profile WHERE Name='Standard User'];
        User u = new User(Alias = 'standt', Email='standarduser@testorg.com',
        EmailEncodingKey='UTF-8', LastName='Testing', LanguageLocaleKey='en_US',
        LocaleSidKey='en_US', ProfileId = p.Id,
        TimeZoneSidKey='America/Los_Angeles',
        UserName=uniqueUserName);
        insert u;

        // Create Test Data
        Account testAccount = new Account(Name='Test Account');
        insert testAccount;
    } 

    @isTest
    static void testGetFieldLabels() {
        User u = [SELECT Id FROM User WHERE Email='standarduser@testorg.com'];
    
        System.runAs(u) {
            // Excecute Test
            Map<String, String> result = FieldLabelController.getFieldLabels('Account', new List<String>{'Name'});
            
            // Validate Result
            System.assertEquals('Account Name', result.get('Name'), 'Test Failed');
        }
    }

    @isTest static void testGetRecordName() {
        User u = [SELECT Id FROM User WHERE Email='standarduser@testorg.com'];
        Account testAccount = [SELECT Id FROM Account WHERE Name='Test Account'];

        System.runAs(u) {
            // Excecute Test
            Map<String, String> result = FieldLabelController.getRecordName(testAccount.Id);

            // Validate Result
            System.assertEquals('Test Account', result.get('Account Name'), 'Test Failed');
        }
    }
}