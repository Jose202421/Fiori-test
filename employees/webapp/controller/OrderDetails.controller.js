sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/routing/History",
    "sap/m/MessageBox",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"

],
    function (Controller, History, MessageBox, Filter, FilterOperator) {
        'use strict';

        // crear funcion en la zona privada para vencular el modelo y el OrderID seleccionado
        function _onObjectMatched(oEvent) {
            this.onClearSignature();

            this.getView().bindElement({
                path: "/Orders(" + oEvent.getParameter("arguments").OrderID + ")",
                model: "odataNorthwind",
                // recuperar los elementos, firma y archivos media cuando se refresca la vista
                events: {
                    dataRecived: function (oData) {
                        _readSignature.bind(this)(oData.getParameter("data").OrderID, oData.getParameter("data").EmployeeID);
                    }
                }
            });
            // Acceder al contexto del modelo para obtener el EmployeeID
            const objContext = this.getView().getModel("odataNorthwind").getContext("/Orders("
                + oEvent.getParameter("arguments").OrderID + ")").getObject();
            // LLamar a la siguiente funcion , y pasar los parametros de OrderID y EmployeeID tomados del objContext
            // solo si objContext = true
            if (objContext) {
                _readSignature.bind(this)(objContext.OrderID, objContext.EmployeeID)
            }
        };


        // Realizar la llamda al servicio Odata

        function _readSignature(orderId, employeeId) {
            // Concatenamos los datos que necesita el servicio Odata para acceder a la entidad SignatureSet
            this.getView().getModel("incidenceModel").read("/SignatureSet(OrderId='" + orderId
                + "',SapId='" + this.getOwnerComponent().SapId
                + "',EmployeeId='" + employeeId + "')", {
                success: function (data) {
                    // Para poder acceder a las funciones del control signature se identifica el ID de la vista que lo contiene
                    const signature = this.getView().byId("signature");
                    // si luego de leer , el Media content esta vacio entonces no llamar la la funcion setSignature del control signature
                    if (data.MediaContent !== "") {
                        signature.setSignature("data:image/png;base64," + data.MediaContent);
                    }
                }.bind(this),
                error: function (data) {

                }
            });

            //Bind files y mostrar en la vista de usuario
            //Ubicamos la propiedad del modelo donde queremos bucar el File
            this.byId("UploadCollection").bindAggregation("items", {
                path: "incidenceModel>/FilesSet",
                filters: [
                    new Filter("OrderId", FilterOperator.EQ, orderId),
                    new Filter("SapId", FilterOperator.EQ, this.getOwnerComponent().SapId),
                    new Filter("EmployeeId", FilterOperator.EQ, employeeId)
                ],

                //mostramos los archivos
                template: new sap.m.UploadCollectionItem({
                    documentId: "{incidenceModel>AttId}",
                    visibleEdit: false,
                    fileName: "{incidenceModel>FileName}"
                }).attachPress(this.downloadFile)
            });
        }

        return Controller.extend("joserojas.employee.controller.OrderDetails", {

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteOrderDetails").attachPatternMatched(_onObjectMatched, this);
            },

            onBack: function (oEvent) {
                var oHistory = History.getInstance();
                var sPreviousHash = oHistory.getPreviousHash();

                if (sPreviousHash !== "undefined") {
                    window.history.go(-1);
                } else {
                    var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                    oRouter.navTo("RouteMain", true)
                }
            },

            onClearSignature: function (oEvent) {
                var signature = this.getView().byId("signature");
                //si usa el clear de la funcion dentro del script signature
                signature.clear()
            },

            // Factoria para visualizar la parte de las uniades del la orden
            factoryOrderDetails: function (listId, oContext) {
                var contextObject = oContext.getObject();
                contextObject.Currency = "EUR";
                var unitsInStock = oContext.getModel().getProperty("/Products(" + contextObject.ProductID + ")/UnitsInStock");

                if (contextObject.Quantity <= unitsInStock) {
                    var objectListItem = new sap.m.ObjectListItem({
                        title: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})",
                        number: "{parts:[{path:'odataNorthwind>UnitPrice'}, {path:'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency', formatOptions: {showMeasure: false}}",
                        numberUnit: "{odataNorthwind>Currency}"
                    });
                    return objectListItem;
                } else {
                    var customListItem = new sap.m.CustomListItem({
                        content: [
                            new sap.m.Bar({
                                contentLeft: new sap.m.Label({ text: "{odataNorthwind>/Products(" + contextObject.ProductID + ")/ProductName} ({odataNorthwind>Quantity})" }),
                                contentMiddle: new sap.m.ObjectStatus({ text: "{i18n>availableStock} {odataNorthwind>/Products(" + contextObject.ProductID + ")/UnitsInStock}", state: "Error" }),
                                contentRight: new sap.m.Label({ text: "{parts:[{path:'odataNorthwind>UnitPrice'}, {path:'odataNorthwind>Currency'}], type:'sap.ui.model.type.Currency'}" })
                            })
                        ]
                    });
                    return customListItem;
                }
            },

            onSaveSignature: function (oEvent) {
                const signature = this.byId("signature");
                const oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                let signaturePng;
                if (!signature.isFill()) {
                    MessageBox.error(oResourceBundle.getText("fillSignature")
                    );
                } else {
                    signaturePng = signature.getSignature().replace("data:image/png;base64,", "");
                    let objectOrder = oEvent.getSource().getBindingContext("odataNorthwind").getObject();
                    let body = {
                        OrderId: objectOrder.OrderID.toString(),
                        SapId: this.getOwnerComponent().SapId,
                        EmployeeId: objectOrder.EmployeeID.toString(),
                        MimeType: "image/png",
                        MediaContent: signaturePng
                    };
                    this.getView().getModel("incidenceModel").create("/SignatureSet", body, {
                        success: function () {
                            MessageBox.information(oResourceBundle.getText("signatureSave"));
                        },
                        error: function () {
                            MessageBox.error(oResourceBundle.getText("signatureNotSave"));
                        },
                    });
                };
            },

            // Funcion para fichero y cargar datos avariable Slug
            onFileBeforeUpload: function (oEvent) {
                let fileName = oEvent.getParameter("fileName");
                let objContext = oEvent.getSource().getBindingContext("odataNorthwind").getObject();

                let oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: objContext.OrderID + ";" + this.getOwnerComponent().SapId + ";" + objContext.EmployeeID + ";" + fileName
                });

                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            // la mejor opcion para crear o añadir el token en la cabecera es cuando se requiere hacer un cambio del file
            onFileChange: function (oEvent) {
                let oUploadCollection = oEvent.getSource();

                //header TOKEn CSRF - Cross-site forgery
                let oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("incidenceModel").getSecurityToken()
                })

                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            // Actualizar la vista una vez se sube un nuevo archivo
            onFileUploadComplete: function (oEvent) {
                oEvent.getSource().getBinding("items").refresh();
            },

            onFileDeleted: function (oEvent) {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oUploadColletionEvent = oEvent.getSource();
                // En el getPath se optiene el File para poder eliminar el fichero desde el servidor de aplicaciones
                var sPath = oEvent.getParameter("item").getBindingContext("incidenceModel").getPath();
                this.getView().getModel("incidenceModel").remove(sPath, {
                    success: function () {
                        oUploadColletionEvent.getBinding("items").refresh();
                    },

                    error: function () {
                        MessageBox.error(oResourceBundle.getText("errorDelete"))
                    }
                    // se usa Bind(this) para los eventos (pero en este caso no es necesario)
                });
            },

            downloadFile: function (oEvent) {
                const sPath = oEvent.getSource().getBindingContext("incidenceModel").getPath();
                window.open("sap/opu/odata/sap/YSAPUI5_SRV_01" + sPath + "/$value")
            }
        });
    });