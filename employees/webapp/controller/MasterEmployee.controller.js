sap.ui.define([
    "joserojas/employees/controller/Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "sap/m/MessageToast"

],
    /** 
     * @param {typeof sap.ui.model.json.JSONModel} JSONModel
     * @param {typeof sap.ui.model.Filter} Filter
     * @param {typeof sap.ui.model.FilterOperator} FilterOperator
     * @param {typeof sap.m.MessageToast} MessageToast
     */
    function (Base, JSONModel, Filter, FilterOperator, MessageToast, ) {
        "use strict";

        return Base.extend("joserojas.employees.controller.MasterEmployee", {
            onInit: function () {
                this._bus= sap.ui.getCore().getEventBus();
            },


            onFilter: function () {
                var oJSONCountries = this.getView().getModel("jsonCountries").getData();
                var filters = [];

                if (oJSONCountries.EmployeeId !== "") {
                    filters.push(new Filter("EmployeeID", FilterOperator.EQ, oJSONCountries.EmployeeId))
                };

                if (oJSONCountries.CountryKey !== "") {
                    filters.push(new Filter("Country", FilterOperator.EQ, oJSONCountries.CountryKey))
                };

                var oList = this.getView().byId("tableEmployee");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters);
            },

            onClearFilter: function () {
                var oModel = this.getView().getModel("jsonCountries")
                oModel.setProperty("/EmployeeId", "")
                oModel.setProperty("/CountryKey", "")

                var filters = [];
                var oList = this.getView().byId("tableEmployee");
                var oBinding = oList.getBinding("items");
                oBinding.filter(filters)
            },

            showPostalCode: function (oEvent) {
                var itemPressed = oEvent.getSource();
                var oContext = itemPressed.getBindingContext("jsonEmployees");
                var objectContext = oContext.getObject();

                MessageToast.show(objectContext.PostalCode)
            },

            onShowCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
                oJSONModelConfig.setProperty("/visibleCity", true)
                oJSONModelConfig.setProperty("/visibleBtnShowCity", false)
                oJSONModelConfig.setProperty("/visibleBtnHideCity", true)
            },

            onHideCity: function () {
                var oJSONModelConfig = this.getView().getModel("jsonModelConfig");
                oJSONModelConfig.setProperty("/visibleCity", false)
                oJSONModelConfig.setProperty("/visibleBtnShowCity", true)
                oJSONModelConfig.setProperty("/visibleBtnHideCity", false)
            },

            onCloseOrder: function () {
                this._oDialogOrders.close();
            },

            showOrders: function (oEvent) {

                // obtener el contexto del modelo que se utiliza
                var iconPress = oEvent.getSource();
                var oContext = iconPress.getBindingContext("odataNorthwind");

                // Instanciar el fragmento
                if (!this._oDialogOrders) {
                    this._oDialogOrders = sap.ui.xmlfragment("joserojas.employees.fragment.DialogOrder", this);
                    this.getView().addDependent(this._oDialogOrders);
                }

                //hacer binding al contexto para tener los datos del item seleccionado
                //this._oDialogOrders.bindElement("jsonEmployees>" + oContext.getPath());
                this._oDialogOrders.bindElement("odataNorthwind>" + oContext.getPath());
                this._oDialogOrders.open();

                /*
                // Crear tablas desde JSON para mostrar datos
                var ordersTable = this.getView().byId("ordersTable");
                //Destruir los ITEMS, para no tener duplicado los ITEMS por si se pulsa N veces
                ordersTable.destroyItems();

                var itemPress= oEvent.getSource();
                var oContext= itemPress.getBindingContext("jsonEmployees");

                var objectContext= oContext.getObject();
                var orders = objectContext.Orders;

                var orderItems = [];

                for (var i in orders){
                    orderItems.push(new sap.m.ColumnListItem({
                        cells: [
                            new sap.m.Label({ text: orders[i].OrderID}), 
                            new sap.m.Label({ text: orders[i].Freight}),
                            new sap.m.Label({ text: orders[i].ShipAddress})
                        ]
                    }));
                } 
                 
                var newTable = new sap.m.Table({
                    width : "auto",
                    columns:[
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>orderID}"})}),
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>freight}"})}),
                        new sap.m.Column({header: new sap.m.Label({text: "{i18n>shipAddress}"})})
                    ],

                    items: orderItems
                }).addStyleClass("sapUiSmallMargin");

                ordersTable.addItem(newTable);
                
                //Agregar nueva tabla creado con JavaScrip dinamicamente
                var newTableJSON = new sap.m.Table();
                newTableJSON.setWidth("auto");
                newTableJSON.addStyleClass("sapUiSmallMargin");

                var columnOrderID = new sap.m.Column();
                var labelOrderID  = new sap.m.Label();
                labelOrderID.bindProperty("text", "i18n>orderID")
                columnOrderID.setHeader(labelOrderID);
                newTableJSON.addColumn(columnOrderID);

                
                var columnFreight = new sap.m.Column();
                var labelFreight  = new sap.m.Label();
                labelFreight.bindProperty("text", "i18n>freight")
                columnFreight.setHeader(labelFreight);
                newTableJSON.addColumn(columnFreight);

                var columnShipAddress = new sap.m.Column();
                var labelShipAddress  = new sap.m.Label();
                labelShipAddress.bindProperty("text", "i18n>shipAddress")
                columnShipAddress.setHeader(labelShipAddress);
                newTableJSON.addColumn(columnShipAddress);


                var columnListItem = new sap.m.ColumnListItem();

                var cellOrder = new sap.m.Label();
                cellOrder.bindProperty("text", "jsonEmployees>OrderID" );
                columnListItem.addCell(cellOrder);

                var cellFreight = new sap.m.Label();
                cellFreight.bindProperty("text", "jsonEmployees>Freight" );
                columnListItem.addCell(cellFreight);

                var cellShipAddress = new sap.m.Label();
                cellShipAddress.bindProperty("text", "jsonEmployees>ShipAddress" );
                columnListItem.addCell(cellShipAddress);

                var oBindingInfo= {
                    model: "jsonEmployees", 
                    path: "Orders", 
                    template: columnListItem
                }

                newTableJSON.bindAggregation("items", oBindingInfo);
                newTableJSON.bindElement("jsonEmployees>" + oContext.getPath());

                ordersTable.addItem(newTableJSON)

            }
            */


            }, 

            showEmployee: function(oEvent){
                //var path= oEvent.getSource().getBindingContext("jsonEmployees").getPath();
                var path= oEvent.getSource().getBindingContext("odataNorthwind").getPath();
                this._bus.publish("flexible", "showEmployee", path)
            }
            
        });
    });
