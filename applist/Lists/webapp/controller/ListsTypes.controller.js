// @ts-ignore
sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/GroupHeaderListItem",
    "sap/m/MessageToast"
],
	/**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.m.GroupHeaderListItem} GroupHeaderListItem
     * @param {typeof sap.m.MessageToast} MessageToast
     */

    function (Controller, JSONModel, GroupHeaderListItem, MessageToast) {
        "use strict";

        return Controller.extend("joserojas.Lists.controller.ListsTypes", {
            onInit: function () {
                var oJSONModel = new JSONModel();
                oJSONModel.loadData("./localService/mockdata/ListData.json");
                this.getView().setModel(oJSONModel);
            },

            getGroupHeader: function (oGroup) {
                // @ts-ignore
                var groupHeaderListItem = new GroupHeaderListItem({
                    title: oGroup.Key,
                    upperCase: true
                });
                return groupHeaderListItem;
            },

            onShowSelectedRow: function () {
                var standardList = this.getView().byId("standardList");
                // @ts-ignore
                var selectedItems = standardList.getSelectedItems();
                // @ts-ignore
                var i18nModel = this.getView().getModel("i18n").getResourceBundle();


                if (selectedItems.length === 0) {
                    MessageToast.show(i18nModel.getText("noSelection"))
                } else {
                    var textMessage = i18nModel.getText("selection");

                    for (var item in selectedItems) {
                        var context = selectedItems[item].getBindingContext();
                        var oContext = context.getObject();
                        textMessage = textMessage + " - " + oContext.Material
                    }
                    MessageToast.show(textMessage)
                }
            }, 

            onDeleteSelectedRow: function() {
                var standardList = this.getView().byId("standardList");
                var selectedItems = standardList.getSelectedItems();
                var i18nModel = this.getView().getModel("i18n").getResourceBundle();
            

                if (selectedItems.length === 0) {
                    MessageToast.show(i18nModel.getText("noSelection"))
                } else {
                    var textMessage = i18nModel.getText("selection");
                    var model= this.getView().getModel();
                    var products= model.getProperty("/Products")
                    var arrayId= [];

                    for(var i in selectedItems){
                        var context= selectedItems[i].getBindingContext();
                        var oContext= context.getObject();

                        arrayId.push(oContext.Id);
                        textMessage=textMessage + " - " + oContext.Material
                    }
                    
                    products = products.filter(function(p){
                        return !arrayId.includes(p.Id);
                    });

                    model.setProperty("/Products", products)
                    standardList.removeSelections();
                    MessageToast.show(textMessage)    
                }
            }, 

            onDeleteRow: function(oEvent){
                var selectedRow = oEvent.getParameter("listItem");
                var context = selectedRow.getBindingContext();
                var splitPath = context.getPath().split("/");
                var indexSelectedRow = splitPath[splitPath.length-1];
                var oModel = this.getView().getModel();
                var products = oModel.getProperty("/Products");
                products.splice(indexSelectedRow, 1);

                oModel.refresh();

            }
        });
    });
 