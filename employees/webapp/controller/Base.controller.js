sap.ui.define([
    "sap/ui/core/mvc/Controller"

], 

function(Controller) {
    'use strict';
    return Controller.extend("joserojas.employees.controller.Base", {
        
        onInit: function(){
            
        }, 

        toOrderDetials: function(oEvent){
            var orderID = oEvent.getSource().getBindingContext("odataNorthwind").getObject().OrderID;
            var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            oRouter.navTo("RouteOrderDetails", {
                OrderID: orderID
            });
        }
    })

});