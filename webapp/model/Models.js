//@ts nocheck
sap.ui.define([
    'sap/ui/model/json/JSONModel', 
    "sap/ui/Device"
],
    /**
     * 
     * @param {typaof sap.ui.model.json/JSONModel} JSONModel 
     * @param {typaof sap.ui.Device} Device 
     * 
     */

    function (JSONModel, Device) {
        'use strict';

        return {
            createRecipient: function () {
                var oData = {
                    recipient: {
                        name: "world"
                    }
                }

                return new JSONModel(oData);
            }, 

            createDeviceModel: function() {
                var oModel = new JSONModel(Device);
                oModel.setDefaultBindingMode("OneWay");
                return oModel;
            }
        }
    });