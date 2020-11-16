import { LightningElement, api, wire, track } from 'lwc';
import getRecords from '@salesforce/apex/LwcDynamicComboboxApex.getRecords';

export default class LwcDynamicCombobox extends LightningElement {
    @api comboboxConfig;
    @track recordsList = [];
    objectName;
    fieldName;
    value;
    searchString;
    isSearchable;
    isMultiSelect;
    @track selectedRecords = [];
    @track selectedRecordValue;
    @track selectedRecordJSON;
    comboboxDivClasses = "slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click";

    /* connectedCallback() {
        console.log('connectedCallback');
        console.log(JSON.parse(JSON.stringify(this.comboboxConfig)));
    } */

    connectedCallback() {
        try {
            var self = this;
            console.log('connectedCallback');
            if (this.comboboxConfig) {
                console.log(JSON.parse(JSON.stringify(this.comboboxConfig)));
            }
            console.log('comboboxConfig = ' + this.comboboxConfig.objectName);
            this.objectName = this.comboboxConfig.objectName;
            this.fieldName = this.comboboxConfig.fieldName;
            this.value = this.comboboxConfig.value;
            if (this.comboboxConfig.searchString) {
                this.searchString = this.comboboxConfig.searchString;
            } else {
                this.searchString = '';
            }
            this.isSearchable = this.comboboxConfig.isSearchable;
            this.isMultiSelect = this.comboboxConfig.isMultiSelect;

            // self.callApexForSearch(this.objectName, this.fieldName, this.value, this.searchString, this.isSearchable, this.isMultiSelect);

            getRecords({
                /* objectName: objectName,
                fieldName: fieldName,
                value: value,
                searchString: searchString,
                isSearchable: isSearchable,
                isMultiSelect: isMultiSelect */
                objectName: this.comboboxConfig.objectName,
                fieldName: this.comboboxConfig.fieldName,
                value: this.comboboxConfig.value,
                searchString: this.comboboxConfig.searchString,
                isSearchable: this.comboboxConfig.isSearchable,
                isMultiSelect: this.comboboxConfig.isMultiSelect
            }).then(result => {
                console.log(result);
                if (result && result.length > 0) {
                    console.log('result not null');
                    this.recordsList = JSON.parse(JSON.stringify(result));
                    this.error = undefined;
                    /* const selectEvent = new CustomEvent('mycustomevent', {
                        detail: name
                    });
                    this.dispatchEvent(selectEvent); */
                    if (this.isSearchable) {
                        //lookup
                        if (this.isMultiSelect) {
                            //multiselect lookup
                            console.log('multi lookup');
                            // if(this.recordsList && this.recordsList.length > 0) {
                            this.recordsList.forEach(record => {
                                this.selectedRecords.push(record);
                            });

                            const selectEvent = new CustomEvent('loadandonselect', {
                                detail: {
                                    selectedJSON: this.selectedRecords,
                                    selectedValue: this.value,
                                    isSearchable: true,
                                    isMultiSelect: true
                                }
                            });
                            this.dispatchEvent(selectEvent);

                            /* if (this.value != null) {
                                console.log(this.value);
                                const indexFromRecordList = this.recordsList.findIndex(record => record.recordId === this.value);
                                console.log('indexFromRecordList = ' + indexFromRecordList + ' bool = ' + (Boolean)(indexFromRecordList !== -1));
                                if (indexFromRecordList !== -1) {
                                    this.selectedRecords.push(this.recordsList[indexFromRecordList]);
                                    console.log(JSON.parse(JSON.stringify(this.selectedRecords)));
                                }
                            } */
                        } else {
                            //single select lookup
                            console.log('single lookup');
                            if (this.value != null) {
                                console.log(this.value);
                                if (this.recordsList && this.recordsList.length > 0) {
                                    this.selectedRecordJSON = this.recordsList[0];
                                    this.selectedRecordValue = this.recordsList[0].recordName;
                                } else {
                                    this.selectedRecordValue = 'Please Select';
                                }
                                const selectEvent = new CustomEvent('loadandonselect', {
                                    detail: {
                                        selectedJSON: this.selectedRecordJSON,
                                        selectedValue: this.selectedRecordValue,
                                        isSearchable: true,
                                        isMultiSelect: false
                                    }
                                });
                                this.dispatchEvent(selectEvent);

                                if (this.selectedRecordJSON != null) {
                                    console.log(JSON.parse(JSON.stringify(this.selectedRecordJSON)));
                                }
                                /* const indexFromRecordList = this.recordsList.findIndex(record => record.recordId === this.value);
                                console.log('indexFromRecordList = ' + indexFromRecordList + ' bool = ' + (Boolean)(indexFromRecordList !== -1));
                                if (indexFromRecordList !== -1) {
                                    // this.selectedRecords.push(this.recordsList[indexFromRecordList]);
                                    this.selectedRecord = this.recordsList[indexFromRecordList];
                                    console.log(JSON.parse(JSON.stringify(this.selectedRecord)));
                                } else {
                                    console.log('please check recordId in configuration');
                                } */
                                /* console.log(this.recordsList);
                                console.log(JSON.parse(JSON.stringify(this.recordsList)));
                                console.log(this.recordsList.length + 'bool = '+ (Boolean)(this.recordsList[0] != null ) );
                                if( this.recordsList.length === 1 ) {
                                    this.selectedRecord = this.recordsList[0];
                                } else {
                                    console.log('please check recordId in configuration');
                                }
                                if( this.selectedRecord != null ) {
                                    console.log(JSON.parse(JSON.stringify(this.selectedRecord)));
                                } */
                            }
                        }
                    } else {
                        //picklist
                        if (this.isMultiSelect) {
                            console.log('multi picklist picklist');
                            var count = 0;
                            this.recordsList.forEach(record => {
                                if (record.isSelected) {
                                    count++;
                                    this.selectedRecords.push(record);
                                }
                            });
                            if (count > 0) {
                                this.selectedRecordValue = count + ' Options selected';
                            } else {
                                this.selectedRecordValue = 'no Options Selected';
                            }
                            const selectEvent = new CustomEvent('loadandonselect', {
                                detail: {
                                    selectedJSON: this.selectedRecords,
                                    selectedValue: this.selectedRecordValue,
                                    isSearchable: false,
                                    isMultiSelect: true
                                }
                            });
                            this.dispatchEvent(selectEvent);

                        } else {
                            console.log('single select picklist');
                            this.recordsList.forEach(record => {
                                if (record.isSelected) {
                                    this.selectedRecordValue = record.recordName;
                                    this.selectedRecordJSON = record;
                                }
                            });
                            const selectEvent = new CustomEvent('loadandonselect', {
                                detail: {
                                    selectedJSON: this.selectedRecordJSON,
                                    selectedValue: this.selectedRecordValue,
                                    isSearchable: false,
                                    isMultiSelect: false
                                }
                            });
                            this.dispatchEvent(selectEvent);
                            if (!this.selectedRecordValue) {
                                this.selectedRecordValue = 'no Option Selected';
                            }
                        }
                    }
                } else {
                    console.log('result empty');
                    if (this.isSearchable) {
                        if (this.isMultiSelect) {
                            console.log('multi lookup');
                            var blankRecord = {
                                recordId: '',
                                recordName: 'no data found',
                                isSelected: false
                            }
                            this.recordsList.push(blankRecord);
                        } else {
                            console.log('single lookup');
                            this.selectedRecordValue = 'Please select Option';
                        }
                    } else {
                        if (this.isMultiSelect) {
                            console.log('multi Picklist');
                            this.selectedRecordValue = 'no Options Selected'
                        } else {
                            console.log('single lookup');
                            this.selectedRecordValue = 'Please Select Option';
                        }
                    }
                }
                console.log(JSON.parse(JSON.stringify(result)));

            }).catch(error => {
                console.log(error);
                this.error = error;
                this.recordsList = undefined;
            });
            this.comboboxDivClasses += "slds-is-open";


            /* getRecords({ 
                objectName: this.comboboxConfig.objectName, 
                fieldName: this.comboboxConfig.fieldName, 
                value: this.comboboxConfig.value, 
                searchString: this.comboboxConfig.searchString, 
                isSearchable: this.comboboxConfig.isSearchable, 
                isMultiSelect: this.comboboxConfig.isMultiSelect 
            }).then(result => {
                console.log(result);
                this.recordsList = result;
                this.error = undefined;
            }).catch(error => {
                console.log(error);
                this.error = error;
                this.recordsList = undefined;
            }); */
        } catch (e) {
            console.log(e);
        }
        /* if( !comboboxConfig.isSearchable ) {

        } */
    }

    // renderedCallback() {
    //     console.log('renderedCallback--------');
    //     if(this.isSearchable) {
    //         //lookup
    //         if(this.isMultiSelect) {
    //             //multiselect lookup
    //             console.log('multi lookup');
    //             if (this.value != null) {
    //                 console.log(this.value);
    //                 const indexFromRecordList = this.recordsList.findIndex(record => record.recordId === this.value);
    //                 console.log('indexFromRecordList = ' + indexFromRecordList + ' bool = ' + (Boolean)(indexFromRecordList !== -1));
    //                 if (indexFromRecordList !== -1) {
    //                     this.selectedRecords.push(this.recordsList[indexFromRecordList]);
    //                     console.log(JSON.parse(JSON.stringify(this.selectedRecords)));
    //                 }
    //             }
    //         } else {
    //             //single select lookup
    //             console.log('single lookup');
    //             if (this.value != null) {
    //                 console.log(this.value);
    //                 /* const indexFromRecordList = this.recordsList.findIndex(record => record.recordId === this.value);
    //                 console.log('indexFromRecordList = ' + indexFromRecordList + ' bool = ' + (Boolean)(indexFromRecordList !== -1));
    //                 if (indexFromRecordList !== -1) {
    //                     // this.selectedRecords.push(this.recordsList[indexFromRecordList]);
    //                     this.selectedRecord = this.recordsList[indexFromRecordList];
    //                     console.log(JSON.parse(JSON.stringify(this.selectedRecord)));
    //                 } else {
    //                     console.log('please check recordId in configuration');
    //                 } */
    //                 console.log(this.recordsList);
    //                 console.log(JSON.parse(JSON.stringify(this.recordsList)));
    //                 console.log(this.recordsList.length + 'bool = '+ (Boolean)(this.recordsList[0] != null ) );
    //                 if( this.recordsList.length === 1 ) {
    //                     this.selectedRecord = this.recordsList[0];
    //                 } else {
    //                     console.log('please check recordId in configuration');
    //                 }
    //                 if( this.selectedRecord != null ) {
    //                     console.log(JSON.parse(JSON.stringify(this.selectedRecord)));
    //                 }
    //             }
    //         }
    //     } else {
    //         //picklist
    //         if(this.isMultiSelect) {
    //             console.log('multi picklist picklist');
    //         } else {
    //             console.log('single select picklist');
    //         }
    //     }
    // }

    // renderedCallback() {
    //     console.log('renderedCallback');
    //     var inp = this.template.querySelectorAll("li");
    //     inp.forEach(function (element) {
    //         element.addEventListener('click', this.handleClick);
    //         /* if(element.name=="input1")
    //             this.name=element.value;

    //         else if(element.name=="input2")
    //             this.age=element.value; */
    //     }, this);
    // }

    comboxInput(event) {
        console.log('comboxInput');
        var self = this;
        try {
            if (this.isSearchable) {
                if (this.isMultiSelect) {
                    console.log('multiselect');
                } else {
                    console.log('singleselect');
                    this.selectedRecordValue = event.target.value;
                }
            } else {
                if (this.isMultiPicklist) {
                    console.log('multiPicklist');
                } else {
                    console.log('singlePicklist');
                }
            }
            this.searchString = event.target.value;
            console.log('event.target.value = ' + event.target.value);
            // console.log('event.getSourse().value = '+ event.getSourse().value );
            // event.getSourse().value = event.target.value;
            if (this.searchString.length > 2) {
                this.objectName = this.comboboxConfig.objectName;
                this.fieldName = this.comboboxConfig.fieldName;
                // this.value = this.comboboxConfig.value;
                // if (this.comboboxConfig.searchString) {
                //     this.searchString = this.comboboxConfig.searchString;
                // } else {
                //     this.searchString = '';
                // }
                this.isSearchable = this.comboboxConfig.isSearchable;
                this.isMultiSelect = this.comboboxConfig.isMultiSelect;

                // self.callApexForSearch(this.objectName, this.fieldName, '', this.searchString, this.isSearchable, this.isMultiSelect);
                getRecords({
                    // objectName: objectName,
                    // fieldName: fieldName,
                    // value: value,
                    // searchString: searchString,
                    // isSearchable: isSearchable,
                    // isMultiSelect: isMultiSelect
                    objectName: this.objectName,
                    fieldName: this.fieldName,
                    value: '',
                    searchString: this.searchString,
                    isSearchable: this.isSearchable,
                    isMultiSelect: this.isMultiSelect
                }).then(result => {
                    console.log(result);
                    this.comboboxDivClasses += "slds-is-open";
                    if (result && result.length > 0) {

                        this.recordsList = JSON.parse(JSON.stringify(result));
                        this.error = undefined;
                        if (this.isSearchable) {
                            if (this.isMultiSelect) {
                                this.selectedRecords.forEach(selected => {
                                    this.recordsList.forEach(record => {
                                        if (selected.recordId === record.recordId) {
                                            record.isSelected = true;
                                        }
                                    });
                                });
                            }
                        }
                    } else {
                        console.log('empty result');
                        this.recordsList = [];
                        var blankRecord = {
                            recordId: '',
                            recordName: 'no data found',
                            isSelected: false
                        }
                        this.recordsList.push(blankRecord);
                    }
                }).catch(error => {
                    console.log(error);
                    this.error = error;
                    this.recordsList = undefined;
                });
                this.comboboxDivClasses += "slds-is-open";
            }
        } catch (e) {
            console.log(e);
        }
    }

    handleClick(event) {
        // Your code here
        console.log('handleClick');
        console.log('----------->' + event.target.dataset.item);
    }

    callApexForSearch(objectName, fieldName, value, searchString, isSearchable, isMultiSelect) {
        console.log('callApexForSearch = ');
        try {
            getRecords({
                objectName: objectName,
                fieldName: fieldName,
                value: value,
                searchString: searchString,
                isSearchable: isSearchable,
                isMultiSelect: isMultiSelect
            }).then(result => {
                console.log(result);
                this.recordsList = result;
                this.error = undefined;
            }).catch(error => {
                console.log(error);
                this.error = error;
                this.recordsList = undefined;
            });
            this.comboboxDivClasses += "slds-is-open";
        } catch (e) {
            console.log(e);
        }
    }

    selectRecordItem(event) {
        console.log('selectRecordItem');
        try {
            console.log('===');
            console.log(event.target.dataset.id);
            var recordIdByEvent = event.target.dataset.id;
            this.recordsList = JSON.parse(JSON.stringify(this.recordsList));
            if (this.isSearchable) {
                if (this.isMultiSelect) {

                    var record;
                    /* if (recordIdByEvent != null) {
                        record = this.recordsList.filter(record => record.recordId === recordIdByEvent);
                        console.log('---------->');
                        console.log(record);
                        console.log(JSON.parse(JSON.stringify(record)));
                    }
                    if (record != null) {
                        const index = this.selectedRecords.findIndex(record => record.recordId === recordIdByEvent);
                        if (index === -1) {
                            this.selectedRecords.push(record[0]);
                        }
                        if (this.selectedRecords.conta)
                            this.selectedRecords.push(record[0]);
                    } */
                    if (recordIdByEvent) {
                        console.log(recordIdByEvent);
                        const indexFromRecordList = this.recordsList.findIndex(record => record.recordId === recordIdByEvent);
                        console.log('indexFromRecordList = ' + indexFromRecordList + ' bool = ' + (Boolean)(indexFromRecordList !== -1));
                        if (indexFromRecordList !== -1) {
                            const indexFromSelectedRecords = this.selectedRecords.findIndex(record => record.recordId === recordIdByEvent);
                            console.log('indexFromSelectedRecords = ' + indexFromSelectedRecords + ' bool indexFromSelectedRecords !== -1 = ' + (Boolean)(indexFromSelectedRecords !== -1));

                            if (indexFromSelectedRecords !== -1) {
                                //show toast because already selected
                                console.log('already selected');
                                this.selectedRecords.splice(indexFromSelectedRecords, 1);
                                // this.recordsList[indexFromRecordList].isSelected = false;
                            } else {
                                // this.recordsList[indexFromRecordList].isSelected = true;
                                console.log(this.recordsList[indexFromRecordList]);
                                this.selectedRecords.push(this.recordsList[indexFromRecordList]);
                                console.log(JSON.parse(JSON.stringify(this.selectedRecords)));
                            }
                            this.recordsList[indexFromRecordList].isSelected = !this.recordsList[indexFromRecordList].isSelected;
                        }
                        const selectEvent = new CustomEvent('loadandonselect', {
                            detail: {
                                selectedJSON: this.selectedRecords,
                                selectedValue: '',
                                isSearchable: true,
                                isMultiSelect: true
                            }
                        });
                        this.dispatchEvent(selectEvent);
                    }
                } else {
                    this.recordsList.forEach(record => {
                        if (recordIdByEvent === record.recordId) {
                            record.isSelected = true;
                            this.selectedRecordJSON = record;
                            this.selectedRecordValue = record.recordName;
                            // this.selectedRecordJSON.isSelected = true;
                        } else {
                            record.isSelected = false;
                        }
                    })
                    const selectEvent = new CustomEvent('loadandonselect', {
                        detail: {
                            selectedJSON: this.selectedRecordJSON,
                            selectedValue: this.selectedRecordValue,
                            isSearchable: true,
                            isMultiSelect: true
                        }
                    });
                    this.dispatchEvent(selectEvent);

                    var inputTextElem = this.template.querySelector("[data-id='comboboxInput-singlelookup']");
                    console.log(inputTextElem);
                    inputTextElem.setAttribute("readonly", '');
                }
            } else {
                if (this.isMultiSelect) {
                    console.log('multi picklist');
                    /* this.recordsList.forEach(record => {
                        if(record.recordId === recordIdByEvent) {
                            record.isSelect = !record.isSelected;
                        }
                    }); */
                    console.log(JSON.parse(JSON.stringify(this.recordsList)));
                    console.log(JSON.parse(JSON.stringify(this.selectedRecords)));
                    console.log(JSON.parse(JSON.stringify(this.selectedRecordValue)));
                    /* const index = this.recordsList.findIndex( record => {
                        console.log('.'+record.recordId + '.');
                        console.log( '.' + recordIdByEvent + '.' );
                        console.log( typeof record.recordId );
                        console.log( typeof recordIdByEvent );
                        console.log((Boolean) (record.recordId === recordIdByEvent));
                        record.recordId === recordIdByEvent
                    }); */
                    const index = this.recordsList.findIndex(record => record.recordId === recordIdByEvent);
                    console.log('index = ' + index);
                    if (index != -1) {
                        this.recordsList[index].isSelected = !this.recordsList[index].isSelected;

                    }
                    var count = 0;
                    this.selectedRecords = [];
                    this.recordsList.forEach(record => {
                        if (record.isSelected) {
                            count++;
                            this.selectedRecords.push(record);
                        }
                    });
                    this.selectedRecordValue = count + ' Options selected';
                    console.log(JSON.parse(JSON.stringify(this.recordsList)));

                    console.log(JSON.parse(JSON.stringify(this.selectedRecords)));
                    console.log(JSON.parse(JSON.stringify(this.selectedRecordValue)));

                    const selectEvent = new CustomEvent('loadandonselect', {
                        detail: {
                            selectedJSON: this.selectedRecords,
                            selectedValue: this.selectedRecordValue,
                            isSearchable: true,
                            isMultiSelect: true
                        }
                    });
                    this.dispatchEvent(selectEvent);
                } else {
                    console.log('single picklist');
                    this.recordsList.forEach(record => {
                        if (record.recordId === recordIdByEvent) {
                            record.isSelected = true;
                            this.selectedRecordValue = record.recordName;
                            this.selectedRecordJSON = record;
                        } else {
                            record.isSelected = false;
                        }
                    });
                    const selectEvent = new CustomEvent('loadandonselect', {
                        detail: {
                            selectedJSON: this.selectedRecordJSON,
                            selectedValue: this.selectedRecordValue,
                            isSearchable: true,
                            isMultiSelect: true
                        }
                    });
                    this.dispatchEvent(selectEvent);
                }
            }
        } catch (e) {
            console.log(e);
        }
    }

    removePill(event) {
        console.log('removePill');
        try {
            var self = this;
            console.log(this.selectedRecordJSON);
            console.log(JSON.parse(JSON.stringify(this.selectedRecordJSON)));
            console.log('recordIdByEvent');
            console.log(event.target.dataset.id);

            var recordIdByEvent = event.target.dataset.id;
            // if (recordIdByEvent != null) {
            if (this.isMultiSelect) {
                const index = this.selectedRecords.findIndex(record => record.recordId === recordIdByEvent);
                if (index !== -1) {
                    this.selectedRecords.splice(index, 1);
                }
                this.recordsList = JSON.parse(JSON.stringify(this.recordsList));
                this.recordsList.forEach(record => {
                    if (record.recordId === recordIdByEvent) {
                        record.isSelected = false;
                    }
                })
            } else {
                console.log('Single select');
                var inputTextElem = this.template.querySelector("[data-id='comboboxInput-singlelookup']");
                console.log(inputTextElem);
                inputTextElem.removeAttribute("readonly");
                this.selectedRecordJSON = JSON.parse(JSON.stringify(this.selectedRecordJSON));
                this.recordsList = JSON.parse(JSON.stringify(this.recordsList));
                // inputTextElem.setAttribute("value", );
                this.selectedRecordValue = '';
                // var selectedRecordId = this.selectedRecordJSON.recordId;
                // console.log(JSON.parse(JSON.stringify(this.selectedRecordJSON)));
                this.selectedRecordJSON.isSelected = false;
                console.log(JSON.parse(JSON.stringify(this.selectedRecordJSON)));
                // this.recordsList[0].isSelected = false;
                console.log(JSON.parse(JSON.stringify(this.recordsList)));
                this.recordsList.forEach(record => {
                    record.isSelected = false;
                    /* if( record.recordId === recordIdByEvent ) {
                        record.isSelected = false;
                    } */
                })
                console.log(JSON.parse(JSON.stringify(this.recordsList)));

                /* this.recordsList.forEach(record => {
                    if(record.recordId === selectedRecordId) {
                        record.isSelected = false;
                    }
                }) */
            }

            // }
        } catch (e) {
            console.log(e);
        }
    }

}