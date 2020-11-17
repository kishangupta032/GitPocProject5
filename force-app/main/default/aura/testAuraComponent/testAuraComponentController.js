({
	updateValue : function(component, event, helper) {
        console.log('updateValue');
        var val = component.find("myInput").getElement().value;
        component.set("v.greeting", val);
    }
})