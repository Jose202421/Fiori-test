sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/core/routing/History", 
    "sap/ui/core/UIComponent"
], 

    /**
     * 
     * @param {typeof sap.ui.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.core.routing/History} History 
     * @param {typeof sap.ui.core.UIComponent} UIComponent 
     */
    function(Controller, History, UIComponent) {
    'use strict';

        return Controller.extend("joserojas.routing.controller.BaseController", {

            getRouter: function(){
                return UIComponent.getRouterFor(this);
            }, 

            onNavBack: function(){
                var oHistory, sPreviousHash;

                oHistory = History.getInstance();
                sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== undefined){
                    window.history.go(-1);
                }else{
                    this.getRouter().navTo("appHome", {}, true /*no history*/);
                }
            }

        });
    
});