sap.ui.define([
    'sap/ui/core/UIComponent',
    'joserojas/invoices/model/Models',
    'sap/ui/model/resource/ResourceModel',
    './controller/HelloDialog', 
    "sap/ui/Device"


],
    /**
     * @param( typeof sap.ui.core.UIComponent) UIComponent
     * @param( typeof sap.ui.model.resource.ResourceModel) ResourceModel
     * @param( typeof sap.ui.Device) Device
     */

    function (UIComponent, Models, ResourceModel, HelloDialog, Device) {
        'use strict';

        return UIComponent.extend("joserojas.invoices.Component", {
            metadata: {
                manifest: "json"
                //"rootView": {
                //    "viewName": "joserojas.invoices.view.App",
                //    "type": "XML",
                //    "async": true,
                //    "id": "App"
                //    }
            },

            init: function () {
                UIComponent.prototype.init.apply(this, arguments);

                // set model on view
                this.setModel(Models.createRecipient());

                // set i18n on view
                //var i18nModel = new ResourceModel({ bundleName: "joserojas.invoices.i18n.i18n" });
                //this.setModel(i18nModel, "i18n");


                //set Device Model
                this.setModel(Models.createDeviceModel(), "device")

                this._helloDialog = new HelloDialog(this.getRootControl())

                // get router
                this.getRouter().initialize();
            }, 

            exit: function(){
                this._helloDialog.destroy();
                delete this._helloDialog;
            },

            openHelloDialog: function(){
                this._helloDialog.open();
            }, 

            getContentDensityClass: function(){
                if (!Device.support.touch){
                    this.sContentDensityClass = "sapUiSizeCompact";
                } else{
                    this.sContentDensityClass = "sapUiSizeCozi";
                }
                return this.sContentDensityClass;
            }

        });
    });