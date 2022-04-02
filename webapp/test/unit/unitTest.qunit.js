// @ts-nocheck

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict"

    sap.ui.require([
        "joserojas/invoices/test/unit/AllTests"
    ], function () {
        QUnit.start();
    });
});