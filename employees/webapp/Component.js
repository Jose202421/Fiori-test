sap.ui.define([
        "sap/ui/core/UIComponent",
        "sap/ui/Device",
        "joserojas/employees/model/models"
    ],
    function (UIComponent, Device, models) {
        "use strict";
        // Todo las librerias externas a SAPUI5, se deben cargar en el Component , ya que cuando la aplicación corre en el LaunchPad no se mira el index.html, por lo que no se cargara la libreria nueva
       //jQuery.sap.includeScript("https://cdnjs.cloudflare.com/ajax/libs/signature_pad/1.5.3/signature_pad.js");
       
        return UIComponent.extend("joserojas.employees.Component", {
            metadata: {
                manifest: "json"
            },

            /**
             * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
             * @public
             * @override
             */
            init: function () {
                // call the base component's init function
                UIComponent.prototype.init.apply(this, arguments);

                // enable routing
                this.getRouter().initialize();

                // set the device model
                this.setModel(models.createDeviceModel(), "device");
            }, 

            SapId: "sapui5_practice@hotmail.com"
        });
    }
);