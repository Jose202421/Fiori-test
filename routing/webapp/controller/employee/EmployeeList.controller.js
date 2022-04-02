sap.ui.define([
    "joserojas/routing/controller/BaseController"
],
    function (BaseController) {
        'use strict';

        return BaseController.extend("joserojas.routing.controller.employee.EmployeeList", {
            
            onListItemPressed: function(oEvent){
                var oItem = oEvent.getSource();
                var oCtx = oItem.getBindingContext();
                this.getRouter().navTo("employee", {
                    employeeId: oCtx.getProperty("EmployeeID")
                });
            }
        });
    });