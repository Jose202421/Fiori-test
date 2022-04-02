sap.ui.define([
    "sap/ui/test/Opa5",
    "sap/ui/test/actions/Press"

],

    /**
     * @param{typeof sap.ui.test.Opa5} Opa5
     * @param{typeof sap.ui.test.action.Press} Press
     */
    function (Opa5, Press) {
        'use strict';

        Opa5.createPageObjects({
            onTheAppPage:{
                actions:{
                    iSayHelloDialogButton: function () {
                        return this.waitFor({
                        id: "helloDialogbutton",
                        viewName: "joserojas.invoices.view.HelloPanel",
                        actions: new Press(),
                             errorMessage: "Did not find the 'Say Hello dialog Button' on the HelloPanel view"
                        });
                    }
                }, 

                assertions: {
                    iSeeTheHelloDialog: function(){
                        return this.waitFor({
                            controlType: "sap.m.Dialog", 
                            success : function(){
                                Opa5.assert.ok(true, "Dialog was open")
                            }, 
                            errorMessage: "Did not find the Dialog control"
                        });
                    }
                }
            }
        });
    });