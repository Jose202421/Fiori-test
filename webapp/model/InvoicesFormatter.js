sap.ui.define([
    
], function( ) {
    'use strict';

    return {
        invoiceStatus: function(sStatus){

            const resouceBundle = this.getView().getModel("i18n").getResourceBundle();

            switch (sStatus) {
                case 'A': return resouceBundle.getText("invoicesStatusA")                 
                case 'B': return resouceBundle.getText("invoicesStatusB") 
                case 'C': return resouceBundle.getText("invoicesStatusC") 
      
                default: return sStatus
            }
        }
    } 
    
});