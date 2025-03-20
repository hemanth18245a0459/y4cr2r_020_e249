/* global QUnit */
// https://api.qunitjs.com/config/autostart/
QUnit.config.autostart = false;

sap.ui.require([
	"y4cr2r_020_e249/test/unit/AllTests"
], function (Controller) {
	"use strict";
	QUnit.start();
});