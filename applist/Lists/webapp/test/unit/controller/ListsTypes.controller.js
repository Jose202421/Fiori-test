/*global QUnit*/

sap.ui.define([
	"joserojas/Lists/controller/ListsTypes.controller"
], function (Controller) {
	"use strict";

	QUnit.module("ListsTypes Controller");

	QUnit.test("I should test the ListsTypes controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
