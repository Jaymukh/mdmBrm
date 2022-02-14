sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"murphy/mdm/brm/murphybusinessrule/model/models",
	"murphy/mdm/brm/murphybusinessrule/shared/serviceCall"
], function (UIComponent, Device, models, ServiceCall) {
	"use strict";

	return UIComponent.extend("murphy.mdm.brm.murphybusinessrule.Component", {

		metadata: {
			manifest: "json"
		},

		/**
		 * The component is initialized by UI5 automatically during the startup of the app and calls the init method once.
		 * @public
		 * @override
		 */
		init: function () {
			this.serviceCall = new ServiceCall();
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// enable routing
			this.getRouter().initialize();

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
		/*	//count model
			this.getModel().setDefaultCountMode("Inline");*/
		},
		getContentDensityClass: function () {
			if (!this._sContentDensityClass) {
				this._sContentDensityClass = "sapUiSizeCompact";
			/*	if (!Device.support.touch) {
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					this._sContentDensityClass = "sapUiSizeCozy";
				}*/
			}
			return this._sContentDensityClass;
		}
	});
});