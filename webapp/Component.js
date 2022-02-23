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
			this.setModel(models.createUserModel(), "userModel");
			this.getModel("userModel").attachRequestCompleted(function (oData) {
				var sMailID = oData.getSource().getProperty("/email");
				this.setModel(models.createUserInfoModel(sMailID), "userRoleModel");
				// creating the user request
				this.getModel("userRoleModel").attachRequestCompleted(function (oDataReq) {
					var oUserModelResources = this.getModel("userRoleModel").getData().Resources[0];
					var aRoles = [];
					oUserModelResources.groups.find(function (oItem) {
						if (oItem.value === "DA_MDM_ADMIN") {
							aRoles.push(oItem);
						}
					});
					if (aRoles.length === 0) {
						this.getRouter().getTargets().display("notFound");
					}

					/*					this.getModel("userManagementModel").setProperty('/role', aRoles);
										this.getModel("userManagementModel").setProperty('/accountGroups', aAccountGrps);
										this.getModel("userManagementModel").refresh(true);
										var oObjParam = {
											url: "/murphyCustom/mdm/usermgmt-service/users/user/create",
											hasPayload: true,
											type: 'POST',
											data: {
												"userDetails": [{
													"email_id": oUserModelResources.emails[0].value,
													"firstname": oUserModelResources.name.givenName,
													"lastname": oUserModelResources.name.familyName,
													"display_name": oUserModelResources.name.givenName + " " + oUserModelResources.name.familyName,
													"external_id": oUserModelResources.id,
													"created_by": 1,
													"modified_by": 1,
													"roles": [{
														"role_code_btp": "DA_MDM_ADMIN"
													}],
													"is_active": true
												}]
											}

										};
										this.serviceCall.handleServiceRequest(oObjParam).then(function (oDataResp) {
											this.getModel("userManagementModel").setProperty('/data', oDataResp.result.userDetails[0]);
										}.bind(this));*/
				}.bind(this));
			}.bind(this));

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