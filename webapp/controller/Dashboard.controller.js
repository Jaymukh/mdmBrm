sap.ui.define([
	"murphy/mdm/brm/murphybusinessrule/controller/BaseController",
	"sap/ui/core/Fragment",
	"murphy/mdm/brm/murphybusinessrule/shared/serviceCall",
	"sap/m/MessageToast",
	"sap/m/MessageBox"
], function (BaseController, Fragment, ServiceCall, MessageToast, MessageBox) {
	"use strict";

	return BaseController.extend("murphy.mdm.brm.murphybusinessrule.controller.Dashboard", {
		constructor: function () {
			this.serviceCall = new ServiceCall();
		},
		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 * @memberOf murphy.mdm.brm.murphybusinessrule.view.Dashboard
		 */
		onInit: function () {

			this.byId("idDashboardObjectPage").setSelectedSection("idVndr");
		},
		onVendorFilterSelect: function (oEvent) {
			var sKey = oEvent.getParameter("key");
			if (sKey === "vendReq") {
				this.getView().getModel("App").setProperty("/Vendor/requestor", true);
				this.getView().getModel("App").setProperty("/Vendor/steward", false);
				this.getView().getModel("App").setProperty("/Vendor/approver", false);
			} else if (sKey === "vendSteward") {
				this.getView().getModel("App").setProperty("/Vendor/requestor", false);
				this.getView().getModel("App").setProperty("/Vendor/steward", true);
				this.getView().getModel("App").setProperty("/Vendor/approver", false);
			} else if (sKey === "vendApprover") {
				this.getView().getModel("App").setProperty("/Vendor/requestor", false);
				this.getView().getModel("App").setProperty("/Vendor/steward", false);
				this.getView().getModel("App").setProperty("/Vendor/approver", true);
			}
		},
		addEditVendor: function () {
			this.emptyVendorObject();
			this.loadAddEditVendor();
		},
		emptyVendorObject: function () {
			this.getView().getModel("BRMVendor").setData({
				"attribute": "",
				"value": "",
				"stageapprover": "",
				"usertype": "",
				Edit: false
			});
		},
		onVendorDetails: function (oEvent) {
			var oVendor = oEvent.getSource().getBindingContext().getObject();
			oVendor.Edit = true;
			this.getView().getModel("BRMVendor").setData(oVendor);
			this.loadAddEditVendor();
		},
		loadAddEditVendor: function (oEvent) {
			var oButton = oEvent.getSource(),
				oView = this.getView();
			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.AddEditVendor",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					return oPopover;
				});
			}
			this._pPopover.then(function (oPopover) {
				oPopover.open(oButton);
			});

		},
		oncloseShipngInvoic: function () {
				this._pPopover.close();
			}
			/**
			 * Similar to onAfterRendering, but this hook is invoked before the controller's View is re-rendered
			 * (NOT before the first rendering! onInit() is used for that one!).
			 * @memberOf murphy.mdm.brm.murphybusinessrule.view.Dashboard
			 */
			//	onBeforeRendering: function() {
			//
			//	},

		/**
		 * Called when the View has been rendered (so its HTML is part of the document). Post-rendering manipulations of the HTML could be done here.
		 * This hook is the same one that SAPUI5 controls get after being rendered.
		 * @memberOf murphy.mdm.brm.murphybusinessrule.view.Dashboard
		 */
		//	onAfterRendering: function() {
		//
		//	},

		/**
		 * Called when the Controller is destroyed. Use this one to free resources and finalize activities.
		 * @memberOf murphy.mdm.brm.murphybusinessrule.view.Dashboard
		 */
		//	onExit: function() {
		//
		//	}

	});

});