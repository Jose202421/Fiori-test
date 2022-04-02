sap.ui.define([
	"sap/ui/core/UIComponent"
], function (UIComponent) {
	"use strict";

	return UIComponent.extend("joserojas.routing.Component", {

		metadata: {
			manifest: "json"
		}, 

        init: function(){
            UIComponent.prototype.init.apply(this, arguments);

            // Create de view based on the URL
            this.getRouter().initialize();
        }
	});

});
