// @ts-nocheck
sap.ui.define([
    "joserojas/invoices/localService/mockserver",
    "sap/ui/test/opaQunit",
    "./pages/HelloPanel"
],
    /**
    * @param{typeof sap.ui.test.opaQUnit} opaQUnit */

    function (mockserver, opaQunit) {

        QUnit.module("Navigation");

        opaQunit("Should open the Hello Dialog", function (Given, When, Then) {
            //initialize the mock server
            mockserver.init();

            //Arrangements
            Given.iStartMyUIComponent({
                componentConfig: {
                    name: "joserojas.invoices"
                }
            });

            //Actions
            When.onTheAppPage.iSayHelloDialogButton();

            //Assertions
            Then.onTheAppPage.iSeeTheHelloDialog();

            //Cleanup
            Then.iTeardownMyApp();
        });

    });
