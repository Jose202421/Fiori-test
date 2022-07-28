sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageBox",
    "sap/ui/model/json/JSONModel"
],
    /**
     * @param {typeof sap.ui.core.mvc.Controller} Controller
     * @param {typeof sap.ui.model.JSONModel} JSONModel
     */


    function (Controller, MessageBox, JSONModel) {
        "use strict";

        function _onRefreshPage() {
            this._wizard = this.byId("createEmployeeWizard");
            this._oWizardContentPage = this.byId("wizardContentPage");

            // se crea el modelo princiapl que contendra todos los datos
            this._model = new JSONModel({});
            this.getView().setModel(this._model)

            //Se resetan los pasos
            var oFirstStep = this._wizard.getSteps()[0];
            this._wizard.discardProgress(oFirstStep);

            //Scroll to top
            this._wizard.goToStep(oFirstStep);

            //Invalidate First step
            oFirstStep.setValidated(false)
        }


        return Controller.extend("joserojas.employees.controller.createEmployee", {

            onInit: function () {
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);
                oRouter.getRoute("RouteCreateEmployee").attachPatternMatched(_onRefreshPage, this);

            },


            onCancel: function () {
                var oResourceBundle = this.getView().getModel("i18n").getResourceBundle();
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this)

                MessageBox.confirm(oResourceBundle.getText("msgConfirmCancelar"), {
                    onClose: function (oAction) {
                        if (oAction === "OK") {
                            oRouter.navTo("RouteMain", {}, true);
                        }
                    }.bind(this)
                })
            },

            onGoStep2: function (oEvent) {
                var typeEmployeeStep = this.byId("employeeTypeStep");

                var dataEmployeeStep = this.byId("dataEmployeeStep");

                // Para obtener el tipo seleccionado se usa el custom
                // Obtener la data del boton pulsado
                var button = oEvent.getSource();
                var typeEmployee = button.data("typeEmployee");

                //Dependiendo del tipo, el salario bruto por defecto es:
                // Interno : 24000
                // autonomo : 400
                // Gerente  : 70000

                var Salary, Type;
                switch (typeEmployee) {
                    case "interno":
                        Salary = 24000;
                        Type = "0";
                        break;
                    case "autonomo":
                        Salary = 400;
                        Type = "1";
                        break;
                    case "gerente":
                        Salary = 70000;
                        Type = "2";
                        break;
                }

                // Al pulsar sobre el tipo se sobre escribe el modelo resgistrado el tipo de empleado y le valor del salario por defecto
                this._model.setData({
                    _type: typeEmployee,
                    Type: Type,
                    _Salary: Salary
                });

                if (this._wizard.getCurrentStep() === typeEmployeeStep.getId()) {
                    this._wizard.nextStep();
                } else {
                    //En caso de que ya se encuentre activ el paso dos se navega directamente al employeeDataStep
                    this._wizard.goToStep(dataEmployeeStep);
                }
            },

            onDataEmployeeValidation: function (oEvent, callback) {
                var object = this._model.getData();
                var isValid = true;

                //Nombre
                if (!object.FirstName) {
                    object._FirsNameState = "Error";
                    isValid = false;
                } else {
                    object._FirsNameState = "None"
                }

                //Apellido
                if (!object.LastName) {
                    object._LastNameState = "Error";
                    isValid = false;
                } else {
                    object._LastNameState = "None"
                }

                //Fecha
                if (!object.CreationDate) {
                    object._CreationDateState = "Error"
                    isValid = false;
                } else {
                    object._CreationDateState = "None"
                }

                //DNI
                if (!object.Dni) {
                    object._DniState = "Error";
                    isValid = false
                } else {
                    object._DniState = "None"
                }

                if (isValid) {
                    this._wizard.validateStep(this.byId("dataEmployeeStep"));
                } else {
                    this._wizard.invalidateStep(this.byId("dataEmployeeStep"));
                }

                // Si hay callback se devuelve el valor isValid
                if (callback) {
                    callback(isValid)
                }
            },

            onValidateDni: function (oEvent) {
                //Se comprueba si es dni o cif. En caso de dni, se comprueba su valor. Para ello se comprueba que el tipo no sea "autonomo"
                if (this._model.getProperty("_type") !== "autonomo") {
                    var dni = oEvent.getParameter("value");
                    var number;
                    var letter;
                    var letterList;
                    var regularExp = /^\d{8}[a-zA-Z]$/;
                    //Se comprueba que el formato es válido
                    if (regularExp.test(dni) === true) {
                        //Número
                        number = dni.substr(0, dni.length - 1);
                        //Letra
                        letter = dni.substr(dni.length - 1, 1);
                        number = number % 23;
                        letterList = "TRWAGMYFPDXBNJZSQVHLCKET";
                        letterList = letterList.substring(number, number + 1);
                        if (letterList !== letter.toUpperCase()) {
                            this._model.setProperty("/_DniState", "Error");
                        } else {
                            this._model.setProperty("/_DniState", "None");
                            this.onDataEmployeeValidation();
                        }
                    } else {
                        this._model.setProperty("/_DniState", "Error");
                    }
                }
            },

            wizardCompleteHandler: function (oEvent) {
                // verificar que en el paso dataEmployeeStep no exista error
                // se declara una funcion con el valor isValir para verificar si es true o false
                this.onDataEmployeeValidation(oEvent, function (isValid) {
                    if (isValid) {
                        // se navega a la pagina Review
                        var wizardNavContainer = this.byId("wizardNavContainer");
                        wizardNavContainer.to(this.byId("ReviewPage"));
                        // Se optienen los archivos subidos
                        var uploadCollection = this.byId("UploadCollection");
                        var files = uploadCollection.getItems();
                        var numFiles = uploadCollection.getItems().length;
                        this._model.setProperty("/_numFiles", numFiles);
                        if (numFiles > 0) {
                            var arrayFiles = [];
                            for (var i in files) {
                                arrayFiles.push({ DocName: files[i].getFileName(), MimeType: files[i].getMimeType() });
                            }
                            this._model.setProperty("/_files", arrayFiles)
                        } else {
                            this._model.setProperty("/_files", [])
                        }
                    } else {
                        this._wizard.goToStep(this.byId("dataEmployeeStep"))
                    }
                }.bind(this));

            },

            editStepOne: function () {
                this._editStep("employeeTypeStep")
                //_editStep.bind(this)("employeeTypeStep")
            },

            onEditStepTwo: function () {
                this._editStep("dataEmployeeStep")
                //_editStep.bind(this)("dataEmployeeStep")
            },

            editStepThree: function () {
                this._editStep("employeeInfoStep")
                //_editStep.bind(this)("employeeInfoStep")
            },

            //Funcion para editar step
            _editStep: function (step) {
                var wizardNavContainer = this.byId("wizardNavContainer");
                //Se añade una función al evento afterNavigate, ya que se necesita 
                //que la función se ejecute una vez ya se haya navegado a la vista principal
                var fnAfterNavigate = function () {
                    this._wizard.goToStep(this.byId(step));
                    // se quita la funcion para que no vuelva a ejecutar al volver a navegar
                    wizardNavContainer.attachAfterNavigate(fnAfterNavigate);
                }.bind(this);

                wizardNavContainer.attachAfterNavigate(fnAfterNavigate);
                wizardNavContainer.back();
            },

            // Registrar ficheros
            //Se agrega el parametro de cabecera x-csrf-token con el valor del token del modelo
            //Es necesario para validarse contra sap
            onFileChange: function (oEvent) {
                var oUploadCollection = oEvent.getSource();
                //Header token
                var oCustomerHeaderToken = new sap.m.UploadCollectionParameter({
                    name: "x-csrf-token",
                    value: this.getView().getModel("odataModel").getSecurityToken()
                });
                oUploadCollection.addHeaderParameter(oCustomerHeaderToken);
            },

            onFileBeforeUpload: function (oEvent) {
                var oCustomerHeaderSlug = new sap.m.UploadCollectionParameter({
                    name: "slug",
                    value: this.getOwnerComponent().SapId + ";" + this.newUser + ";" + oEvent.getParameter("fileName")
                });
                oEvent.getParameters().addHeaderParameter(oCustomerHeaderSlug);
            },

            onFileUploadComplete: function(oEvent){
                oEvent.getSource().getBinding("items").refresh();
            },

            _onStartUpload: function () {
                var oUploadCollection = this.byId(UploadCollection);
                oUploadCollection.Upload();
            },

            onSaveEmployee: function () {
                var json = this.getView().getModel().getData();
                var body = {};
                var oRouter = sap.ui.core.UIComponent.getRouterFor(this);

                // Se optienen aquellos campos que no empiecen por "_", ya que son los que vamos a enviar
                for (var i in json) {
                    if (i.indexOf("_") !== 0) {
                        body[i] = json[i];
                    }
                }
                body.SapId = this.getOwnerComponent().SapId;
                body.UserToSalary = [{
                    Amount: parseFloat(json._Salary).toString(),
                    Comments: json.Comments,
                    Waers: "EUR"
                }];

                this.getView().setBusy(true);
                this.getView().getModel("odataModel").create("/Users", body, {
                    success: function (data) {
                        this.getView().setBusy(false);
                        //Se almacena el nuevo usuario
                        this.newUser = data.EmployeeId;
                        sap.m.MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("newEmployee") + ": " + this.newUser, {
                            onClose: function () {
                                //Se vuelve al wizard, para que al vovler a entrar a la aplicacion aparezca ahi
                                var wizardNavContainer = this.byId("wizardNavContainer");
                                wizardNavContainer.back();
                                //Regresamos al menú principal
                                oRouter.navTo("RouteMain", {}, true);
                            }.bind(this)
                        });
                        //Se llama a la función "upload" del uploadCollection
                        this._onStartUpload();
                    }.bind(this),
                    error: function () {
                        this.getView().setBusy(false)
                        MessageBox.information(this.oView.getModel("i18n").getResourceBundle().getText("createEmployeeError"))
                    }.bind(this)
                });
            }

        });
    });
