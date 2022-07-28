sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox"

],

    function (Controller, MessageBox) {
        'use strict';

        return Controller.extend("joserojas.employees.controller.MasterDetails", {
            onInit: function () {
                this._splitAppEmployee = this.byId("splitAppEmployee");
            },

            onPressBack: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                this._splitAppEmployee.to(this.createId("detailSelectEmployee"));
                oRouter.navTo("RouteMain", {}, true)
            },

            onSelectEmployee: function (oEvent) {
                //Primero se navega al detalle del empleado, ubicando el ID del de la seguna pagina del detailPage
                this._splitAppEmployee.to(this.createId("detailEmployee"));
                var oContext = oEvent.getParameter("listItem").getBindingContext("odataModel");
                //Se almacena el usuario seleccionado en una variable
                this.employeeId = oContext.getProperty("EmployeeId");
                var detailEmployee = this.byId("detailEmployee");
                //Se bindea a la vista con la entidad Users y las claves del id del empleado y el id del alumno
                detailEmployee.bindElement("odataModel>/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')");
            },

            onDeleteEmployee: function (oEvent) {
                var oI18n = this.getView().getModel("i18n").getResourceBundle();
                MessageBox.confirm(oI18n.getText("confirmarEliminar"), {
                    title: oI18n.getText("confirm"),
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            //Llamar a la funcion remover
                            this.getView().getModel("odataModel").remove("/Users(EmployeeId='" + this.employeeId + "',SapId='" + this.getOwnerComponent().SapId + "')", {
                                success: function () {
                                    sap.m.MessageToast.show(oI18n.getText("empleadoEliminado"))
                                    // Mostrar mensaje seleccione empleado
                                    this._splitAppEmployee.to(this.createId("detailSelectEmployee"))
                                }.bind(this),

                                error: function (e) {
                                    sap.base.Log.info(e);
                                }.bind(this)
                            });
                        }
                    }.bind(this)
                });
            },

            // Se llama a la funcion para acceder a un empleado
            onPromoteEmployee: function (oEvent) {
                if (!this.promoteDialog) {
                    this.promoteDialog = sap.ui.xmlfragment("joserojas.employees.fragment.PromoteEmployee", this);
                    this.getView().addDependent(this.promoteDialog);
                }

                this.promoteDialog.setModel(new sap.ui.model.json.JSONModel({}), "newPromote");
                this.promoteDialog.open();
            },

            //Funcion para promover al empleado
            onPromote: function () {
                //Se optiene el modelo new Promote
                var newPromote = this.promoteDialog.getModel("newPromote");
                // se optienen los datos
                var odata = newPromote.getData();
                var oMsg = this.getView().getModel("i18n").getResourceBundle();

                // Se prepara la data para enviar a SAP y se agrega el campo SapId con el ID del alumno y el Id del empleado
                var body = {
                    Amount: odata.Amount,
                    CreationDate: odata.CreationDate,
                    Comments: odata.Comments,
                    SapId: this.getOwnerComponent().SapId,
                    EmployeeId: this.employeeId
                };
                this.getView().getModel("odataModel").create("/Salaries", body, {
                    success: function () {
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show(oMsg.getText("ascensoCorrectamente"));
                        this.onClosePromote();
                        
                    }.bind(this),

                    error: function () {
                        this.getView().setBusy(false);
                        sap.m.MessageToast.show(oMsg.getText("ascensoErroneo"));
                    }.bind(this)

                });
            },

            onClosePromote: function () {
                this.promoteDialog.close();
            },

            //Función que se ejecuta al cargar un fichero en el uploadCollection
            //Se agrega el parametro de cabecera x-csrf-token con el valor del token del modelo
            //Es necesario para validarse contra sap
            onChange: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                //Token de cabecera
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("odataModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onUploadComplete: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                oUploadCollection.getBinding("items").refresh();
            },

            //Función que se ejecuta por cada fichero que se va a subir a sap
            //Se debe agregar el parametro de cabecera "slug" con el valor "id de sap del alumno",id del nuevo usuario y nombre del fichero, separados por ;
            onBeforeUploadStart: function (oEvent) {
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this.employeeId + ";" + oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileDeleted: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                var sPath = oEvent.getParameter("item").getBindingContext("odataModel").getPath();
                this.getView().getModel("odataModel").remove(sPath, {
                    success: function () {
                        oUploadCollection.getBinding("items").refresh();
                    },

                    error: function () {

                    }
                })
            },

            onDownloadFile: function (oEvent) {
                var sPath = oEvent.getSource().getBindingContext("odataModel").getPath();
                window.open("/sap/opu/odata/sap/ZEMPLOYEES_SRV" + sPath + "/$value")
            }
        })
    });