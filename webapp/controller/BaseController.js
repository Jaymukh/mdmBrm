sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"murphy/mdm/brm/murphybusinessrule/shared/serviceCall",
	'sap/ui/core/Fragment',
	"sap/m/MessageToast"
], function (Controller, ServiceCall, Fragment, MessageToast) {
	"use strict";

	return Controller.extend("murphy.mdm.brm.murphybusinessrule.controller.BaseController", {

		constructor: function () {
			this.serviceCall = new ServiceCall();
		}

	});
});