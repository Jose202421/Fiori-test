sap.ui.define([
    "joserojas/routing/controller/BaseController"
], 
    
    function(BaseController) {
    'use strict';
    
    return BaseController.extend("joserojas.routing.controller.NotFound", {
        onInit: function(){

            var oRouter = this.getRouter();
            var oTarget = oRouter.getTarget("notFound");
            oTarget.attachDisplay(function(oEvent){
                this._oData = oEvent.getParameter("data"); 
            }, this);    
        }, 

        // overwrite the parent´s onNavBack
        onNavBack : function(){
            // in some cases we could display a certain target when the back button is hit

            if (this._oData && this._oData.fromTarget){
                this.getRouter().getTargets().display(this._oData.fromTarget)
                delete this._oData.fromTarget;
                return;
            }

            // call parent onNavBack
            BaseController.prototype.onNavBack.apply(this, arguments)
        }


    })
});