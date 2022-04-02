sap.ui.define([
    "joserojas/routing/controller/BaseController"
],
    function (BaseController) {
        'use strict';

        return BaseController.extend("joserojas.routing.controller.employee.Employee", {

            onInit: function () {
                var oRouter = this.getRouter();
                oRouter.getRoute("employee").attachMatched(this._onRouteMatched, this);


            },

            _onRouteMatched : function (oEvent) {
                var oArgs, oView;
			        oArgs = oEvent.getParameter("arguments");
			        oView = this.getView();
                    

                oView.bindElement({
                    path: "/Employees(" + oArgs.employeeId + ")",
                    events: {
                        change: this._onBindingChange.bind(this),
                        dataRequested: function (oEvent) {
                            oView.setBusy(true);
                        },
                        dataReceived: function (oEvent) {
                            oView.setBusy(false);
                        }
                    }
                })
            },

            _onBindingChange: function (oEvent) {
                // No data for Binding
                if (!this.getView().getBindingContext()) {
                    this.getRouter().getTargets().display("notFound");
                }
            }, 
            
            onShowResume: function(){
                var oCtx = this.getView().getElementBinding().getBoundContext();


                this.getRouter().navTo("employeeResume", {
                    employeeId : oCtx.getProperty("EmployeeID")
                });
            }
        })
    });