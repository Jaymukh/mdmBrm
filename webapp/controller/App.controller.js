sap.ui.define([
	"murphy/mdm/brm/murphybusinessrule/controller/BaseController"
], function (BaseController) {
	"use strict";

	return BaseController.extend("murphy.mdm.brm.murphybusinessrule.controller.App", {
		onInit: function () {

			this.getView().addStyleClass(this.getOwnerComponent().getContentDensityClass());
			this.initializeApp();
		},
		initializeApp: function () {
			this.getView().getModel("App").setData({
				Vendor: {
					requestor: true,
					steward: false,
					approver: false
				}

			});
		}
	});
});