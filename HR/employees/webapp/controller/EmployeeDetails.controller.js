sap.ui.define([
    "sap/ui/core/mvc/Controller", 
    "sap/ui/model/json/JSONModel", 
    "joserojas/employees/model/formatter"
], 

    function(Controller, JSONModel, formatter) {
    'use strict';
    
    return Controller.extend("joserojas.employee.controller.EmployeeDetails", {
        
        Formatter : formatter,

        onInit: function(){
            this._bus = sap.ui.getCore().getEventBus();   // se defini el atributo _bus para guardar la instancia donde se capturara el evento
        }, 

        onCreateIncidence: function() {
            var tableIncidence = this.getView().byId("tableIncidence")
            var newIncidence = sap.ui.xmlfragment("joserojas.employees.fragment.NewIncidence", this);
            var incidenceModel = this.getView().getModel("incidenceModel");
            var odata = incidenceModel.getData();
            var index = odata.length; 
            odata.push({index : index + 1});
            incidenceModel.refresh();
            newIncidence.bindElement("incidenceModel>/" + index);
            tableIncidence.addContent(newIncidence);
        }, 

        onDeleteIncidence: function(oEvent){
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
            }
        }, 

        onSaveODataIncidence: function(oEvent){
            var incidence = oEvent.getSource().getParent().getParent(); // saber cual es la linea seleccionada
            var incidenceRow = incidence.getBindingContext("incidenceModel"); //se vincula cada elemento de la interfaz de usuario (Fecha, motivo, tipo)
            //var tem = incidenceRow.sPath.replace('/','');
            this._bus.publish("incidence", "onSaveIncidence", {incidenceRow: incidenceRow.sPath.replace('/','')}); //Se levanta el eevento onSave Incidence Pasar la subscripcion al handler para que sepa que incidencia se ha seleccionado


        }
    });
});