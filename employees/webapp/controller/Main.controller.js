sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel", 
    "sap/m/MessageBox"
],
    /**
     * 
     * @param {typeof sap.u.core.mvc.Controller} Controller 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * 
     */

    function (Controller, JSONModel, MessageBox) {
        'use strict';

        return Controller.extend("joserojas.employees.controller.Main", {

            onBeforeRendering: function () {
                this._detailEmployeeView = this.getView().byId("employeeDetails")
            },

            onInit: function () {
                var oView = this.getView();
                //var i18Bundle = oView.getModel("i18n").getResourceBundle();

                const oJSONModelEmpl = new JSONModel();
                oJSONModelEmpl.loadData("../model/json/Employees.json", false)
                oView.setModel(oJSONModelEmpl, "jsonEmployees");

                const oJSONModelCountries = new JSONModel();
                oJSONModelCountries.loadData("../model/json/Countries.json", false)
                oView.setModel(oJSONModelCountries, "jsonCountries")

                const oJSONModelLayout = new JSONModel();
                oJSONModelLayout.loadData("../model/json/Layout.json", false)
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
                
                // aca se ejecuta un ejemplo de como se puede llamar directamente a la funcion desde el subscriber
                // que se recibe en el parametro "data"= los datos enviados desde la publicacion en la funcion onDeleteIncidence, del controlador employee details
                this._bus.subscribe("incidence", "onDeleteIncidence", function (channelId, eventId, data) {
                    var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                    this.getView().getModel("incidenceModel").remove("/IncidentsSet(IncidenceId='" + data.IncidenceId +
                        "',SapId='" + data.SapId +
                        "',EmployeeId='" + data.EmployeeId + "')", {

                        success: function () {
                            //Hacer una llamada al backend
                            this.onReadDataIncidence.bind(this)(data.EmployeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteOK"))
                        }.bind(this), // donde hay que realizar la llamada

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataDeleteKO"))
                        }.bind(this)
                    })
                }, this)

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


                if (incidenceModel[data.incidenceRow].IncidenceId == undefined) {
                    // Construir el cuerpo que se va a utilizar para realizar la llamda al servicio oData, seleccionando las propiedades que queremos enviar
                    var body = {
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: employeeId.toString(),
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        Type: incidenceModel[data.incidenceRow].Type,
                        Reason: incidenceModel[data.incidenceRow].Reason
                    };

                    // Obtener el modelo para realizar la llamda Request al servicio oData
                    // Crear incidente
                    this.getView().getModel("incidenceModel").create("/IncidentsSet", body, {
                        success: function () {
                            this.onReadDataIncidence.bind(this)(employeeId);
                            MessageBox.success();
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveOK"))
                        }.bind(this), // donde hay que realizar la llamada

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataSaveKO"))
                        }.bind(this)
                    })
                    // Actualizar incidente
                    // si la fecha, razon o tipo cambiaron , entonces actualizar
                } else if (incidenceModel[data.incidenceRow].CreationDateX ||
                    incidenceModel[data.incidenceRow].ReasonX ||
                    incidenceModel[data.incidenceRow].TypeX) {

                    var body = {
                        CreationDate: incidenceModel[data.incidenceRow].CreationDate,
                        CreationDateX: incidenceModel[data.incidenceRow].CreationDateX,
                        Type: incidenceModel[data.incidenceRow].Type,
                        TypeX: incidenceModel[data.incidenceRow].TypeX,
                        Reason: incidenceModel[data.incidenceRow].Reason,
                        ReasonX: incidenceModel[data.incidenceRow].ReasonX
                    };

                    //Indicar cuales son los campos con que se debe actualizar la incidencia, en este caso IncidecenId, SapId, EmployeeId
                    this.getView().getModel("incidenceModel").update("/IncidentsSet(IncidenceId='" + incidenceModel[data.incidenceRow].IncidenceId +
                        "',SapId='" + incidenceModel[data.incidenceRow].SapId +
                        "',EmployeeId='" + incidenceModel[data.incidenceRow].EmployeeId + "')", body, {

                        success: function () {
                            //Hacer una llamada al backend
                            this.onReadDataIncidence.bind(this)(incidenceModel[data.incidenceRow].EmployeeId);
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdateOK"))
                        }.bind(this), // donde hay que realizar la llamada

                        error: function (e) {
                            sap.m.MessageToast.show(oResourceBundle.getText("oDataUpdateKO"))
                        }.bind(this)
                    })
                }

                else {
                    sap.m.MessageToast.show(oResourceBundle.getText("odataNoChange"))
                }
            },

            onReadDataIncidence: function (employeeId) {
                
                this.getView().getModel("incidenceModel").read("/IncidentsSet", {
                    filters: [new sap.ui.model.Filter("SapId", "EQ", this.getOwnerComponent().SapId),
                              new sap.ui.model.Filter("EmployeeId", "EQ", employeeId.toString())
                    ],

                    success: function (data) {
                        var incidenceModel = this._detailEmployeeView.getModel("incidenceModel");
                        incidenceModel.setData(data.results);
                        var tableIncidence = this._detailEmployeeView.byId("tableIncidence");
                        tableIncidence.removeAllContent();

                        for (var incidence in data.results) {
                            // Ya que cuando se lee los datos desde el back end, la fecha siempre va a ser correcta, por eso _ValidateDate= true
                            data.results[incidence]._ValidateDate= true  //

                            var newIncidence = sap.ui.xmlfragment("joserojas.employees.fragment.NewIncidence", 
                                                                    this._detailEmployeeView.getController())
                            this._detailEmployeeView.addDependent(newIncidence);
                            newIncidence.bindElement("incidenceModel>/" + incidence);
                            tableIncidence.addContent(newIncidence);
                        }
                    }.bind(this),

                    error: function (e) {

                    }
                });
            }
        })
    });