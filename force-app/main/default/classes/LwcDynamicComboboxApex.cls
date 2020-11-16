public with sharing class LwcDynamicComboboxApex {
    public LwcDynamicComboboxApex() {
        System.debug('constructor');
    }

    @AuraEnabled(cacheable=true)
    // public static void getRecords( String comboboxConfig ) {
    public static List<RecordsData> getRecords( String objectName, String fieldName, String value, String searchString, Boolean isSearchable, Boolean isMultiSelect ) {
        System.debug('-------------');
        //String objectName, String fieldName, String recordId
        try {
            List<RecordsData> recordsDataList = new List<RecordsData>();
            String query = 'SELECT Id, ' + fieldName + ' FROM '+objectName;
            System.debug('value = ' + value );
            System.debug((Boolean) String.isNotBlank(value));
            if(String.isNotBlank(value)) {
                // String query = 'SELECT Id, ' + fieldName + ' FROM '+objectName;
                if(isSearchable) {
                    List<String> values = new List<String>();
                    if( isMultiSelect ) {
                        
                        values = value.split(',');
                        query += ' WHERE Id In :values order by Id ASC';
                    } else {
                        query += ' WHERE Id = :value order by Id ASC';
                    }
                    System.debug(query);
                    List<SObject> queryResult = new List<SObject>();
                    queryResult = Database.query(query);
                    for(SObject s : queryResult) {
                        if(isMultiSelect) {
                            if(values.contains(String.valueOf(s.get('id')))) {
                                recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), true) );
                            } else {
                                recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), false) );
                            }
                        } else {
                            if(value.equals(String.valueOf(s.get('id')))) {
                                recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), true) );
                            } else {
                                recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), false) );
                            }
                        }
                        // recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), true) );
                    }
                } else {
                    Type objType = Type.forName(objectName);
                    if(objType == null) {
                        throw new MyCustomException('Invalid Object');
                    }
                    DescribeSObjectResult objResult = ((SObject) objType.newInstance()).getSObjectType().getDescribe();
                    Schema.SObjectField sobjField = objResult.fields.getMap().get(fieldName);
                    DescribeFieldResult pickListField = sobjField.getDescribe();
                    if( pickListField.isAccessible() ) {
                        List<Schema.PicklistEntry> ple = pickListField.getPicklistValues();
                        for( Schema.PicklistEntry pickListVal : ple){
                            System.debug(pickListVal.getLabel() +' '+pickListVal.getValue());
                            if(isMultiSelect) {
                                List<String> values = new List<String>();
                                values = value.split(',');
                                if(values.contains(String.valueOf(pickListVal.getValue()))) {
                                    recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(), true) );
                                } else {
                                    recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(), false) );
                                }
                            } else {
                                if(value.equals(String.valueOf(pickListVal.getValue()))) {
                                    recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(), true) );
                                } else {
                                    recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(), false) );
                                }
                            }
                            // recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(),) );
                        }
                    } else {
                        System.debug('Not Accessible');
                        throw new MyCustomException('Not Accessible');
                    }
                    
                }
                
            } else {
                if( isSearchable ) {
                    if(String.isNotBlank(searchString)) {
                        query += ' WHERE '+fieldName+
                                ' LIKE ' + '\'' + String.escapeSingleQuotes(searchString.trim()) + '%\' order by Id ASC limit 10';
                        System.debug(query);
                        for(SObject s : Database.query(query)) {
                            recordsDataList.add( new RecordsData((String)s.get(fieldName), (String)s.get('id'), false) );
                        }
                    } /* else {
                        // recordsDataList.add( new RecordsData('no data found', '', false) );
                    } */
                   
                } else {
                    System.debug('isSearchable ------------------------ false ');

                    Type objType = Type.forName(objectName);
                    if(objType == null) {
                        throw new MyCustomException('Invalid Object');
                    }
                    DescribeSObjectResult objResult = ((SObject) objType.newInstance()).getSObjectType().getDescribe();
                    Schema.SObjectField sobjField = objResult.fields.getMap().get(fieldName);
                    DescribeFieldResult pickListField = sobjField.getDescribe();
                    if( pickListField.isAccessible() ) {
                        List<Schema.PicklistEntry> ple = pickListField.getPicklistValues();
                        for( Schema.PicklistEntry pickListVal : ple){
                            System.debug(pickListVal.getLabel() +' '+pickListVal.getValue());
                            recordsDataList.add( new RecordsData((String)pickListVal.getLabel(), (String)pickListVal.getValue(), false) );
                        }
                    } else {
                        System.debug('Not Accessible');
                        throw new MyCustomException('Not Accessible');
                    }
                }
            }
            
            // Type objType = Type.forName(objectName);
            // /* if(objType == null) {
            //     throw new MyCustomException('Invalid Object');
            // } */
            // DescribeSObjectResult objResult = ((SObject) objType.newInstance()).getSObjectType().getDescribe();
            // Schema.SObjectField sobjField = objResult.fields.getMap().get(filterField);
            // /*if( sobjField == null ) {
            //     throw new MyCustomException('Invalid Field');
            // }*/
            // System.debug(values.size() > 0);            
            // System.debug( values.isEmpty());
            // DescribeFieldResult pickListField = sobjField.getDescribe();
            // if( pickListField.isAccessible() ) {
            //     String query = 'SELECT Id, ' + filterField + ' FROM '+objectName;
            //     if(String.isNotBlank(searchString)) {
            //         query += ' WHERE '+filterField+
            //                 ' LIKE ' + '\'' + String.escapeSingleQuotes(searchString.trim()) + '%\' order by Id ASC limit 10';
            //     } else {
            //         if(String.isNotBlank(value)) {
            //             query += ' WHERE Id = \''+ value + '\' order by Id ASC';
            //         } else {
            //             query += ' WHERE Id In :values order by Id ASC';
            //         }
            //     }
            //     /* if(String.isNotBlank(value)) {
            //         query += ' WHERE Id = \''+ value + '\' order by Id ASC';
            //     } else if( values.isEmpty() ) {
            //         // query += ' WHERE Id In :values order by Id ASC';
            //         query += ' WHERE '+filterField+
            //                 ' LIKE ' + '\'' + String.escapeSingleQuotes(searchString.trim()) + '%\' order by Id ASC limit 10';
            //     } else {
            //         // query += ' WHERE '+filterField+
            //         //         ' LIKE ' + '\'' + String.escapeSingleQuotes(searchString.trim()) + '%\' order by Id ASC limit 10';
            //         query += ' WHERE Id In :values order by Id ASC';
            //     } */
            //     System.debug(query);
            //     for(SObject s : Database.query(query)) {
            //         recordsDataList.add( new RecordsData((String)s.get(filterField), (String)s.get('id')) );
            //     }
            // } else {
            //     System.debug('Not Accessible');
            //     throw new MyCustomException('Not Accessible');
            // }
            System.debug('recordsDataList = '+ recordsDataList );
            return recordsDataList;
	    } catch (Exception err) {
            System.debug(err.getMessage() + ' line = '+ err.getLineNumber() );
            throw new AuraHandledException(err.getMessage());
	    }
    }

    public class RecordsData {
        @AuraEnabled public String recordName;
        @AuraEnabled public String recordId;
        @AuraEnabled public Boolean isSelected;
        public RecordsData(String recordName, String recordId, Boolean isSelected) {
            this.recordName = recordName;
            this.recordId = recordId;
            this.isSelected = isSelected;
        }
    }
}