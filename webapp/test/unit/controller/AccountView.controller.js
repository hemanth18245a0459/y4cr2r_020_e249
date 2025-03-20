/*global QUnit*/

sap.ui.define([
	"y4cr2r_020_e249/controller/AccountView.controller"
], function (Controller) {
	"use strict";

	QUnit.module("AccountView Controller");

	QUnit.test("I should test the AccountView controller", function (assert) {
		var oAppController = new Controller();
		oAppController.onInit();
		assert.ok(oAppController);
	});

});
