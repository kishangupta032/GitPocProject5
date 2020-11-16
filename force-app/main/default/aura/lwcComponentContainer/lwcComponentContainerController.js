({
    doInit : function(component, event, helper) {
        console.log('doInit');
        /* var config = {
            //for multi lookup
            objectName: 'Account',
            fieldName: 'Name',
            isMultiSelect: true,
            isSearchable: true,
            iconName: 'standard:account',
            value: '0012x0000043isDAAQ',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        } */

        /* var config = {
            //for single Lookup
            objectName: 'Account',
            fieldName: 'Name',
            isMultiSelect: false,
            isSearchable: true,
            iconName: 'standard:account',
            value: '0012x0000043isDAAQ',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        } */

        /* var config = {
            //for multi picklist
            objectName: 'Account',
            fieldName: 'Type',
            isMultiSelect: true,
            isSearchable: false,
            iconName: 'standard:account',
            value: 'Prospect,Other',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        } */

        /* var config = {
            //for single picklist
            objectName: 'Account',
            fieldName: 'Type',
            isMultiSelect: false,
            isSearchable: false,
            iconName: 'standard:account',
            value: '',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        } */

        /* var config = {
            objectName: 'Account',
            fieldName: 'Name',
            isMultiSelect: true,
            isSearchable: true,
            iconName: 'standard:account',
            value: '0012x0000043isDAAQ,0012x0000043isLAAQ',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        } */

        var config = {
            //for single picklist
            objectName: 'Account',
            fieldName: 'Name',
            isMultiSelect: true,
            isSearchable: true,
            iconName: 'standard:account',
            value: '',
            placeholder: 'enter......',
            additionalData: 'Type, Industry'
        }
        component.set('v.configComboBox', config );
    }
})