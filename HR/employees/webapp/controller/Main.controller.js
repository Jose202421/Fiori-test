sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel"
],
    /**
     * 
     * @param {typeof sap.u.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * 
     */

    function (Controller, JSONModel) {
        'use strict';

        return Controller.extend("joserojas.employees.controller.Main", {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("employeeDetails")
            },

            onInit: function () {
                var oView = this.getView();
                var i18Bundle = oView.getModel("i18n").getResourceBundle();

                const oJSONModelEmpl = new JSONModel();
                oJSONModelEmpl.loadData("../localService/mockdata/Employees.json", false)
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                const oJSONModelCountries = new JSONModel();
                oJSONModelCountries.loadData("../localService/mockdata/Countries.json", false)
                oView.setModel(oJSONModelCountries, "jsonCountries")

                const oJSONModelLayout = new JSONModel();
                oJSONModelLayout.loadData("../localService/mockdata/Layout.json", false)
                oView.setModel(oJSONModelLayout, "jsonLayout")

                const oJSONModelConfig = new JSONModel({
                    visibleID: true,
                    visibleName: true,
                    visibleCountry: true,
                    visibleCity: false,
                    visibleBtnShowCity: true,
                    visibleBtnHideCity: false
                });
                oView.setModel(oJSONModelConfig, "jsonModelConfig")


                this._bus = sap.ui.getCore().getEventBus();
                this._bus.subscribe("flexible", "showEmployee", this.showEmployeeDetials, this);
                this._bus.subscribe("incidence", "onSaveIncidence", this.onSaveODataIncidence, this)

            },

            showEmployeeDetials: function (category, nameEvent, path) {
                var detailView = this.getView().byId("employeeDetails");
                detailView.bindElement("odataNorthwind>" + path);
                this.getView().getModel("jsonLayout").setProperty("/ActiveKey", "TwoColumnsMidExpanded")

                var incidenceModel = new JSONModel([]);
                detailView.setModel(incidenceModel, "incidenceModel");
                detailView.byId("tableIncidence").removeAllContent();

                this.onReadDataIncidence(this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID)

            },

            // registrar datos al servicio Odata
            onSaveODataIncidence: function (channelId, eventId, data) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var employeeId = this._detailEmployeeView.getBindingContext("odataNorthwind").getObject().EmployeeID; // se usa para obtener el valor del objecto seleccionado, en esete caso EmployeeID
                var incidenceModel = this._detailEmployeeView.getModel("incidenceModel").getData();


                if (typeof incidenceModel[data.incidenceRow].IncidenceId == 'undifined') {
                    // Construir el cuerpo que se va a utilizar para realizar la llamda al servicio oData, seleccionando las propiedades que queremos enviar
                    var body = {
                        //SapId: this.getOwnerComponent().SapId,
                        EmployeeID: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    };

                    // Obtener el modelo para realizar la llamda Request al servicio oData
                    this.getView.getModel("incidenceModel").create("/IncidentsSet"), body, {
                        success: function () {
                            this.onReadDataIncidence.bind(this)(employeeID)
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"))
                        }.bind(this), // donde hay que realizar la llamada

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"))
                        }.bind(this),
                    }
                } else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChange"))
                }
            },

            onReadDataIncidence: function (employeeID) {
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {

                    filters: [
                        new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                        new sap.ui.model.Filter("EmployeeId", "EQ", employeeID.toString())
                    ],

                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            var newIncidence = sap.ui.xmlfragment("joserojas.Employees.fragment.NewIncidence", this._detailEmployeeView.getController())
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("newIncidence>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),

                    error: function (e) {

                    }
                });
            }
        })
    });