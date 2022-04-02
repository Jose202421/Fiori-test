sap.ui.define([
    "joserojas/invoices/model/InvoicesFormatter",
    "sap/ui/model/resource/ResourceModel"
],

    /**
     * @param {typeof sap.ui.model.resource.ResourceModel} ResourceModel
     */

    function (InvoicesFormatter, ResourceModel) {
        "use strict"

        QUnit.module("Invoices Status", {
            beforeEach: function () {
                this._oResourceModel = new ResourceModel({
                    bundleUrl: sap.ui.require.toUrl("joserojas/invoices") + "/i18n/i18n.properties"
                });
            },

            afterEach: function () {
                this._oResourceModel.destroy();
            }
        });

        QUnit.test("Shoul return invoice status", function (assert) {
            let oModel = this.stub();
            oModel.withArgs("i18n").returns(this._oResourceModel);

            let oViewStub = {
                getModel: oModel
            };

            let oControllerStub = {
                getView: this.stub().returns(oViewStub)
            };

            let fnIsolateFormatter = InvoicesFormatter.invoiceStatus.bind(oControllerStub);

            //Assert
            assert.strictEqual(fnIsolateFormatter("A"), "New", "The invoices status A is correct");
            assert.strictEqual(fnIsolateFormatter("B"), "In Progress", "The invoices status B is correct");
            assert.strictEqual(fnIsolateFormatter("C"), "Done", "The invoices status C is correct");
        });
    })