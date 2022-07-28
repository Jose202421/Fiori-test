sap.ui.define([
    "sap/ui/core/mvc/Controller"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     */
    function (Controller) {
        "use strict";

        return Controller.extend("joserojas.employees.controller.main", {
            onInit: function () {

            },

            onCreateEmployee: function(){
                //this.getOwnerComponent().getRouter().navTo("RouteCreateEmployee");
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("RouteCreateEmployee");              
            }, 

            onSeeEmployee: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("MasterDetailEmployees")
            }, 

            onSignOrder: function(){
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.navTo("OrderEmployee")
            }


        });
    });
