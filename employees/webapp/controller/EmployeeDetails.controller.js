sap.ui.define([
    "joserojas/employees/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "joserojas/employees/model/formatter", 
    "sap/m/MessageBox"
],
    /**
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel 
     * @param {typeof sap.m.MessageBox} Messagebox 
     */

    function (Base, JSONModel, formatter, MessageBox) {
        'use strict';

        return Base.extend("joserojas.employee.controller.EmployeeDetails", {

            Formatter: formatter,

            onInit: function () {
                this._bus = sap.ui.getCore().getEventBus();   // se defini el atributo _bus para guardar la instancia donde se capturara el evento
            },

            onCreateIncidence: function () {
                var tableIncidence = this.getView().byId("tableIncidence")
                var newIncidence = sap.ui.xmlfragment("joserojas.employees.fragment.NewIncidence", this);
                var incidenceModel = this.getView().getModel("incidenceModel");
                var odata = incidenceModel.getData();
                var index = odata.length;
                odata.push({ index: index + 1, _ValidateDate: false, EnabledSave: false });
                incidenceModel.refresh();
                newIncidence.bindElement("incidenceModel>/" + index);
                tableIncidence.addContent(newIncidence);
            },

            onDeleteIncidence: function (oEvent) {
                var contextObj = oEvent.getSource().getBindingContext("incidenceModel").getObject();
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();

                // Habilitar mensaje de confirmacion para saber si el usuarion desea borrar el incidente
                MessageBox.confirm(oResourceBundle.getText("confirmDeleteIncidece"), {
                    onClose: function(oAction){
                        if (oAction === "OK"){
                            this._bus.publish("incidence", "onDeleteIncidence", {
                                // declarar la información que se pasa a la hora de declarar el evento
                                IncidenceId: contextObj.IncidenceId,
                                SapId: contextObj.SapId,
                                EmployeeId: contextObj.EmployeeId
                            });
                        }
                    }.bind(this)
                }); 

                /* IMPORTANTE: Esta logica se usa para borrar datos temporales de un modelo de dato en la interfaz de usuario
                 var tableIncidence = this.getView().byId("tableIncidence");
                 var rowIncidence = oEvent.getSource().getParent().getParent();
                 var incidenceModel = this.getView().getModel("incidenceModel");
                 var odata = incidenceModel.getData();
                 var contextObj =  rowIncidence.getBindingContext("incidenceModel"); 
     
                 odata.splice(contextObj.index-1,1);
                 for (var i in odata){
                     odata[i].index = parseInt(i) + 1;
                 }
     
                 incidenceModel.refresh();
                 tableIncidence.removeContent(rowIncidence);
     
                 for (var j in tableIncidence.getContent()){
                     tableIncidence.getContent()[j].bindElement("incidenceModel>/" + j )
                 }*/
            },

            onSaveODataIncidence: function (oEvent) {
                var incidence = oEvent.getSource().getParent().getParent(); // saber cual es la linea seleccionada
                var incidenceRow = incidence.getBindingContext("incidenceModel"); //se vincula cada elemento de la interfaz de usuario (Fecha, motivo, tipo)
                //var tem = incidenceRow.sPath.replace('/','');
                this._bus.publish("incidence", "onSaveIncidence", { incidenceRow: incidenceRow.sPath.replace('/', '') }); //Se levanta el eevento onSave Incidence Pasar la subscripcion al handler para que sepa que incidencia se ha seleccionado


            },

            updateIncidenceCreationDate: function (oEvent) {
                
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObject = context.getObject();
                // Validar que la fecha sea correcta
                if (!oEvent.getSource().isValidValue()) {
                    contextObject._ValidateDate = false;
                    contextObject.CreationDateState = "Error"

                    MessageBox.error(oResourceBundle.getText("errorCreationDateValue") , {
                        title: "Error", 
                        onClose: null, 
                        styleClass: "",
                        actions: MessageBox.Action.Close, 
                        emphasizedAction: null, 
                        initialFocus: null, 
                        textDirection: sap.ui.core.TextDirection.Inherit
                    })

                } else {
                    contextObject.CreationDateX = true;
                    contextObject._ValidateDate = true;
                    contextObject.CreationDateState = "None"
                };

                if (oEvent.getSource().isValidValue() && contextObject.Reason){
                    contextObject.EnabledSave = true;
                }else{
                    contextObject.EnabledSave = false;
                }


                context.getModel().refresh();
            },

            updateIncidenceReason: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObject = context.getObject();

                // Validar que el campo reason no este vacio
                if (oEvent.getSource().getValue()) {
                    contextObject.ReasonX = true;
                    contextObject.CreationReasonState = "None"
                } else {
                    contextObject.CreationReasonState = "Error"
                };

                if (contextObject._ValidateDate === true && oEvent.getSource().getValue()){
                    contextObject.EnabledSave = true;
                }else{
                    contextObject.EnabledSave = false;
                }

                context.getModel().refresh();
            },

            updateIncidenceType: function (oEvent) {
                var context = oEvent.getSource().getBindingContext("incidenceModel");
                var contextObject = context.getObject();
                contextObject.TypeX = true;

                if (contextObject._ValidateDate === true && contextObject.Reason){
                    contextObject.EnabledSave = true;
                }else{
                    contextObject.EnabledSave = false;
                }

                context.getModel().refresh();
            }

        });
    });