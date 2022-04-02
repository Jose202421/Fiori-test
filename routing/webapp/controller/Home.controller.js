sap.ui.define([
	"joserojas/routing/controller/BaseController"
    
], function (BaseController) {
	"use strict";

	return BaseController.extend("joserojas.routing.controller.Home", {

        onDisplayNotFound: function(){
            this.getRouter().getTargets().display("notFound", {
				fromTarget : "home"
			});
        }, 

        onNavToEmployees : function(){
            this.getRouter().navTo("employeeList")
        }
	});
});