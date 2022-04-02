/* eslint-disable no-undef */
// @ts-nocheck
/* global QUnit */

QUnit.config.autostart = false;

sap.ui.getCore().attachInit(function () {
    "use strict";
    sap.ui.require([
        "joserojas/invoices/test/integration/NavigationJourney"
    ], 
        function () {
            QUnit.start();
    });
});