sap.ui.define([
	"murphy/mdm/brm/murphybusinessrule/controller/BaseController",
	"sap/ui/core/Fragment",
	"murphy/mdm/brm/murphybusinessrule/shared/serviceCall",
	"sap/m/MessageToast",
	"sap/m/MessageBox",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/FilterType",
	'sap/ui/model/Sorter',
], function (BaseController, Fragment, ServiceCall, MessageToast, MessageBox, JSONModel, Filter, FilterOperator, FilterType, Sorter) {
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
			this.getView().setBusy(true);
			this.vendorUserlist();
		},
		vendorUserlist: function () {
			//var url = "/MurphyCloudIdPDest/service/scim/Users";
			var url = "/sap/fiori/murphybusinessrule/MurphyCloudIdPDest/service/scim/Users";
			this.paginated_fetch(url).then(function (oData) {
				var oResult = oData;
				var aVendReq = [];
				var aVendApprov = [];
				var aVendSteward = [];
				var aCustReq = [];
				var aCustApprov = [];
				var aCustSteward = [];
				var aCCReq = [];
				var aCCApprov = [];
				var aCCSteward = [];
				var aPCReq = [];
				var aPCApprov = [];
				var aPCSteward = [];
				var aGLReq = [];
				var aGLApprov = [];
				var aGLSteward = [];
				for (var i = 0; i < oResult.length; i++) {
					var aGroups = oResult[i].groups;
					var oDataObj = oResult[i];
					/*	var resultObject = this.searchValue(aGroups, oDataObj);
					aVendReq.push(resultObject);
*/
					if (oResult[i].groups !== undefined) {
						for (var j = 0; j < aGroups.length; j++) {
							if (aGroups[j].value.search("DA_MDM_VEND_REQ") === 0) {
								aVendReq.push(oDataObj);
							} else if (aGroups[j].value.search("DA_MDM_VEND_APPROV") === 0) {
								var name = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var email = oDataObj.emails[0].value.toUpperCase();
								aVendApprov.push({
									'name': name,
									'key': email
								});
							} else if (aGroups[j].value.search("DA_MDM_VEND_STEW") === 0) {
								var vsname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var vsemail = oDataObj.emails[0].value.toUpperCase();

								aVendSteward.push({
									'name': vsname,
									'key': vsemail
								});
							}
							//////////////Filter Customer users
							if (aGroups[j].value.search("DA_MDM_CUST_REQ") === 0) {
								aCustReq.push(oDataObj);
							} else if (aGroups[j].value.search("DA_MDM_CUST_APPROV") === 0) {
								var cname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var cemail = oDataObj.emails[0].value.toUpperCase();
								aCustApprov.push({
									'name': cname,
									'key': cemail
								});
							} else if (aGroups[j].value.search("DA_MDM_CUST_STEW") === 0) {
								var csname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var csemail = oDataObj.emails[0].value.toUpperCase();

								aCustSteward.push({
									'name': csname,
									'key': csemail
								});
							}

							//////////////// Filter  CC users
							if (aGroups[j].value.search("DA_MDM_CC_REQ") === 0) {
								aCCReq.push(oDataObj);
							} else if (aGroups[j].value.search("DA_MDM_CC_APPROV") === 0) {
								var cname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var cemail = oDataObj.emails[0].value.toUpperCase();
								aCCApprov.push({
									'name': cname,
									'key': cemail
								});
							} else if (aGroups[j].value.search("DA_MDM_CC_STEW") === 0) {
								var csname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var csemail = oDataObj.emails[0].value.toUpperCase();

								aCCSteward.push({
									'name': csname,
									'key': csemail
								});
							}
							//////////// Filter PC users
							if (aGroups[j].value.search("DA_MDM_PC_REQ") === 0) {
								aPCReq.push(oDataObj);
							} else if (aGroups[j].value.search("DA_MDM_PC_APPROV") === 0) {
								var pcname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var pcemail = oDataObj.emails[0].value.toUpperCase();
								aPCApprov.push({
									'name': pcname,
									'key': pcemail
								});
							} else if (aGroups[j].value.search("DA_MDM_PC_STEW") === 0) {
								var pcsname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var pcsemail = oDataObj.emails[0].value.toUpperCase();

								aPCSteward.push({
									'name': pcsname,
									'key': pcsemail
								});
							}

							//////////// Filter GL users
							if (aGroups[j].value.search("DA_MDM_GL_REQ") === 0) {
								aGLReq.push(oDataObj);
							} else if (aGroups[j].value.search("DA_MDM_GL_APPROV") === 0) {
								var GLname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var GLemail = oDataObj.emails[0].value.toUpperCase();
								aGLApprov.push({
									'name': GLname,
									'key': GLemail
								});
							} else if (aGroups[j].value.search("DA_MDM_GL_STEW") === 0) {
								var GLsname = oDataObj.name.givenName + ' ' + oDataObj.name.familyName;
								var GLsemail = oDataObj.emails[0].value.toUpperCase();

								aGLSteward.push({
									'name': GLsname,
									'key': GLsemail
								});
							}

						}
					}

					/*	var jsonObject = books.map(JSON.stringify);
						var uniqueSet = new Set(jsonObject);
						var uniqueArray = Array.from(uniqueSet).map(JSON.parse);*/

					/*oObj.groups.find(function (post) {
						if (post.value.search("DA_MDM_VEND_REQ") == 0) {
							aVendReq.push(oObj);
						}

					});*/
				}

				//////////Removeing duplicates in array
				var aVendorReqData = Object.values(aVendReq.reduce((acc, cur) => Object.assign(acc, {
					[cur.id]: cur
				}), {}));
				////End
				this.getView().getModel("BRMMaster").setProperty("/FilterVendorReqData", aVendorReqData);
				this.getView().getModel("App").setProperty("/Vendor/requestorCount", aVendorReqData.length);

				var aVendorApprvData = Object.values(aVendApprov.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterVendorApproverData", aVendorApprvData);

				//////////Removeing duplicates in array
				var aVendorStewardData = Object.values(aVendSteward.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterVendorStewardData", aVendorStewardData);

				//////////Removeing duplicates in array
				var aCustomerReqData = Object.values(aCustReq.reduce((acc, cur) => Object.assign(acc, {
					[cur.id]: cur
				}), {}));
				////End
				this.getView().getModel("BRMMaster").setProperty("/FilterCustomerReqData", aCustomerReqData);
				this.getView().getModel("App").setProperty("/Customer/requestorCount", aCustomerReqData.length);

				var aCustomerApprvData = Object.values(aCustApprov.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterCustomerApproverData", aCustomerApprvData);

				//////////Removeing duplicates in array
				var aCusomerStewardData = Object.values(aCustSteward.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterCustomerStewardData", aCusomerStewardData);

				//////////Removeing duplicates in CC array
				var aCCReqData = Object.values(aCCReq.reduce((acc, cur) => Object.assign(acc, {
					[cur.id]: cur
				}), {}));
				////End
				this.getView().getModel("BRMMaster").setProperty("/FilterCCReqData", aCCReqData);
				this.getView().getModel("App").setProperty("/CC/requestorCount", aCCReqData.length);

				var aCCApprvData = Object.values(aCCApprov.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterCCApproverData", aCCApprvData);

				//////////Removeing duplicates in array
				var aCCStewardData = Object.values(aCCSteward.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterCCStewardData", aCCStewardData);

				//////////Removeing duplicates in PC array
				var aPCReqData = Object.values(aPCReq.reduce((acc, cur) => Object.assign(acc, {
					[cur.id]: cur
				}), {}));
				////End
				this.getView().getModel("BRMMaster").setProperty("/FilterPCReqData", aPCReqData);
				this.getView().getModel("App").setProperty("/PC/requestorCount", aPCReqData.length);

				var aPCApprvData = Object.values(aPCApprov.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterPCApproverData", aPCApprvData);

				//////////Removeing duplicates in array
				var aPCStewardData = Object.values(aCCSteward.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterPCStewardData", aPCStewardData);

				//////////Removeing duplicates in GL array
				var aGLReqData = Object.values(aPCReq.reduce((acc, cur) => Object.assign(acc, {
					[cur.id]: cur
				}), {}));
				////End
				this.getView().getModel("BRMMaster").setProperty("/FilterGLReqData", aGLReqData);
				this.getView().getModel("App").setProperty("/GL/requestorCount", aGLReqData.length);

				var aGLApprvData = Object.values(aGLApprov.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterGLApproverData", aGLApprvData);

				//////////Removeing duplicates in array
				var aGLStewardData = Object.values(aGLSteward.reduce((acc, cur) => Object.assign(acc, {
					[cur.key]: cur
				}), {}));
				this.getView().getModel("BRMMaster").setProperty("/FilterGLStewardData", aGLStewardData);

				////////////
				this.getVendorSetwardApproverData();
				this.getCustomerStewardApproverData();
				this.getCCStewardApproverData();
				this.getPCStewardApproverData();
				this.getGLStewardApproverData();
			}.bind(this));
		},
		getVendorSetwardApproverData: function () {
			//sap/fiori/murphybusinessrule
			$.ajax({
				url: '/sap/fiori/murphybusinessrule/MDM_WORKBOX_DEST/customProcess/getAttributes/MDGVendorWorkflow?processType=Ad-hoc&_=1644482799078',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				Asynch: false,
				success: function (data, textStatus) {
					var oResult = data;
					this.getView().getModel("MDGVendorWorkflow").setData(oResult);
					/*	var mdgVendSteward = [];
						var msdgVendApprover = []
						oResult.teamDetailDto.find(function (post) {
							if (post.eventName == "Steward Task") {
								mdgVendSteward.push(post);
							} else if (post.eventName == "ApproverTask") {
								msdgVendApprover.push(post);
							}
						})*/
					var mdgVendSteward = oResult.teamDetailDto.filter(role => role.eventName === "Steward Task");
					var msdgVendApprover = oResult.teamDetailDto.filter(role => role.eventName === "ApproverTask");

					this.getView().getModel("BRMMaster").setProperty("/oMDGStewardData", mdgVendSteward[0]);
					this.getView().getModel("BRMMaster").setProperty("/aFilterMDGStewardData", mdgVendSteward[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/Vendor/VendStewCount", mdgVendSteward[0].ownerSelectionRules.length);

					this.getView().getModel("BRMMaster").setProperty("/oMDGApproverData", msdgVendApprover[0]);
					this.getView().getModel("BRMMaster").setProperty("/aFilterMDGApproverData", msdgVendApprover[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/Vendor/VendApproverCount", msdgVendApprover[0].ownerSelectionRules.length);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (jqXHR, tranStatus) {
					this.getView().setBusy(false);
				}
			});
		},
		getCustomerStewardApproverData: function () {
			//	this.getView().setBusy(true);
			///sap/fiori/murphybusinessrule
			$.ajax({
				url: '/sap/fiori/murphybusinessrule/MDM_WORKBOX_DEST/customProcess/getAttributes/MDGCustomerWorkflow?processType=Ad-hoc&_=1644482799078',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				Asynch: false,
				success: function (data, textStatus) {
					var oResult = data;
					//	this.getView().getModel("MDGCustData").setData(oResult);
					this.getView().getModel("BRMMaster").setProperty("/MDGCustomerWorkflow", oResult);
					/*	var mdgVendSteward = [];
						var msdgVendApprover = []
						oResult.teamDetailDto.find(function (post) {
							if (post.eventName == "Steward Task") {
								mdgVendSteward.push(post);
							} else if (post.eventName == "ApproverTask") {
								msdgVendApprover.push(post);
							}
						})*/
					var mdgCustSteward = oResult.teamDetailDto.filter(role => role.eventName === "Steward Task");
					var mdgCustApprover = oResult.teamDetailDto.filter(role => role.eventName === "ApproverTask");

					this.getView().getModel("BRMMaster").setProperty("/oCustMDGStewardData", mdgCustSteward[0]);
					this.getView().getModel("BRMMaster").setProperty("/aCustFilterMDGStewardData", mdgCustSteward[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/Customer/CustStewCount", mdgCustSteward[0].ownerSelectionRules.length);

					this.getView().getModel("BRMMaster").setProperty("/oCustMDGApproverData", mdgCustApprover[0]);
					this.getView().getModel("BRMMaster").setProperty("/aCustFilterMDGApproverData", mdgCustApprover[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/Customer/CustApproverCount", mdgCustApprover[0].ownerSelectionRules.length);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (jqXHR, tranStatus) {
					this.getView().setBusy(false);
				}
			});

		},
		getPCStewardApproverData: function () {
			///sap/fiori/murphybusinessrule
			$.ajax({
				url: '/sap/fiori/murphybusinessrule/MDM_WORKBOX_DEST/customProcess/getAttributes/MDGCCWorkflow?processType=Ad-hoc&_=1644482799078',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				Asynch: false,
				success: function (data, textStatus) {
					var oResult = data;
					//	this.getView().getModel("MDGCustData").setData(oResult);
					this.getView().getModel("BRMMaster").setProperty("/MDGPCWorkflow", oResult);
					var mdgPCSteward = oResult.teamDetailDto.filter(role => role.eventName === "Steward Task");
					var mdgPCApprover = oResult.teamDetailDto.filter(role => role.eventName === "ApproverTask");

					this.getView().getModel("BRMMaster").setProperty("/oPCMDGStewardData", mdgPCSteward[0]);
					this.getView().getModel("BRMMaster").setProperty("/aPCFilterMDGStewardData", mdgPCSteward[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/PC/PCStewCount", mdgPCSteward[0].ownerSelectionRules.length);

					this.getView().getModel("BRMMaster").setProperty("/oPCMDGApproverData", mdgPCApprover[0]);
					this.getView().getModel("BRMMaster").setProperty("/aPCFilterMDGApproverData", mdgPCApprover[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/PC/PCApproverCount", mdgPCApprover[0].ownerSelectionRules.length);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (jqXHR, tranStatus) {
					this.getView().setBusy(false);
				}
			});
		},
		getCCStewardApproverData: function () {
			///sap/fiori/murphybusinessrule
			$.ajax({
				url: '/sap/fiori/murphybusinessrule/MDM_WORKBOX_DEST/customProcess/getAttributes/MDGCCWorkflow?processType=Ad-hoc&_=1644482799078',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				Asynch: false,
				success: function (data, textStatus) {
					var oResult = data;
					//	this.getView().getModel("MDGCustData").setData(oResult);
					this.getView().getModel("BRMMaster").setProperty("/MDGCCWorkflow", oResult);
					var mdgCCSteward = oResult.teamDetailDto.filter(role => role.eventName === "Steward Task");
					var mdgCCApprover = oResult.teamDetailDto.filter(role => role.eventName === "ApproverTask");

					this.getView().getModel("BRMMaster").setProperty("/oCCMDGStewardData", mdgCCSteward[0]);
					this.getView().getModel("BRMMaster").setProperty("/aCCFilterMDGStewardData", mdgCCSteward[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/CC/CCStewCount", mdgCCSteward[0].ownerSelectionRules.length);

					this.getView().getModel("BRMMaster").setProperty("/oCCMDGApproverData", mdgCCApprover[0]);
					this.getView().getModel("BRMMaster").setProperty("/aCCFilterMDGApproverData", mdgCCApprover[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/CC/CCApproverCount", mdgCCApprover[0].ownerSelectionRules.length);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (jqXHR, tranStatus) {
					this.getView().setBusy(false);
				}
			});

		},
		getGLStewardApproverData: function () {
			///sap/fiori/murphybusinessrule
			$.ajax({
				url: '/sap/fiori/murphybusinessrule/MDM_WORKBOX_DEST/customProcess/getAttributes/MDGGLWorkflow?processType=Ad-hoc&_=1644482799078',
				type: 'GET',
				contentType: "application/json; charset=utf-8",
				dataType: "json",
				Asynch: false,
				success: function (data, textStatus) {
					var oResult = data;
					//	this.getView().getModel("MDGCustData").setData(oResult);
					this.getView().getModel("BRMMaster").setProperty("/MDGGLWorkflow", oResult);
					var mdgGLSteward = oResult.teamDetailDto.filter(role => role.eventName === "Steward Task");
					var mdgGLApprover = oResult.teamDetailDto.filter(role => role.eventName === "ApproverTask");

					this.getView().getModel("BRMMaster").setProperty("/oGLMDGStewardData", mdgGLSteward[0]);
					this.getView().getModel("BRMMaster").setProperty("/aGLFilterMDGStewardData", mdgGLSteward[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/GL/GLStewCount", mdgGLSteward[0].ownerSelectionRules.length);

					this.getView().getModel("BRMMaster").setProperty("/oGLMDGApproverData", mdgGLApprover[0]);
					this.getView().getModel("BRMMaster").setProperty("/aGLFilterMDGApproverData", mdgGLApprover[0].ownerSelectionRules.reverse());
					this.getView().getModel("App").setProperty("/GL/GLApproverCount", mdgGLApprover[0].ownerSelectionRules.length);
					this.getView().setBusy(false);
				}.bind(this),
				error: function (jqXHR, tranStatus) {
					this.getView().setBusy(false);
				}
			});
		},
		onVendorReqdetails: function (oEvent) {
			var oSource = oEvent.getSource();
			var aGroups = oSource.getBindingContext("BRMMaster").getProperty("groups");

			var aFilterGrp = aGroups.filter(role => role.value.search("DA_MDM_VEND_REQ") === 0);
			this.getView().getModel("BRMMaster").setProperty("/VendorACGroupdData", aFilterGrp);
			var oView = this.getView();
			// create popover
			if (!this._pPopover) {
				this._pPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmvendor.VendorACgroup",
					controller: this
				}).then(function (oPopover) {
					oView.addDependent(oPopover);
					oPopover.bindElement("/aGroups");
					return oPopover;
				});
			}
			this._pPopover.then(function (oPopover) {
				oPopover.openBy(oSource);
			});

		},
		onCustomerReqdetails: function (oEvent) {
			var oSource = oEvent.getSource();
			var aGroups = oSource.getBindingContext("BRMMaster").getProperty("groups");

			var aFilterGrp = aGroups.filter(role => role.value.search("DA_MDM_CUST_REQ") === 0);
			this.getView().getModel("BRMMaster").setProperty("/CustomerACGroupdData", aFilterGrp);
			var oView = this.getView();
			// create popover
			if (!this._custpPopover) {
				this._custpPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmcustomer.CustomerACgroup",
					controller: this
				}).then(function (oCustPopover) {
					oView.addDependent(oCustPopover);
					oCustPopover.bindElement("/aGroups");
					return oCustPopover;
				});
			}
			this._custpPopover.then(function (oCustPopover) {
				oCustPopover.openBy(oSource);
			});

		},
		onCCReqdetails: function (oEvent) {
			var oSource = oEvent.getSource();
			var aGroups = oSource.getBindingContext("BRMMaster").getProperty("groups");

			var aFilterGrp = aGroups.filter(role => role.value.search("DA_MDM_CC_REQ") === 0);
			this.getView().getModel("BRMMaster").setProperty("/CCACGroupdData", aFilterGrp);
			var oView = this.getView();
			// create popover
			if (!this._ccPopover) {
				this._ccPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmCostCenter.CCACgroup",
					controller: this
				}).then(function (oCCPopover) {
					oView.addDependent(oCCPopover);
					oCCPopover.bindElement("/aGroups");
					return oCCPopover;
				});
			}
			this._ccPopover.then(function (oCCPopover) {
				oCCPopover.openBy(oSource);
			});

		},
		onPCReqdetails: function (oEvent) {
			var oSource = oEvent.getSource();
			var aGroups = oSource.getBindingContext("BRMMaster").getProperty("groups");
			var aFilterGrp = aGroups.filter(role => role.value.search("DA_MDM_PC_REQ") === 0);
			this.getView().getModel("BRMMaster").setProperty("/PCACGroupdData", aFilterGrp);
			var oView = this.getView();
			// create popover
			if (!this._pcPopover) {
				this._pcPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmProfitCenter.PCACgroup",
					controller: this
				}).then(function (oPCPopover) {
					oView.addDependent(oPCPopover);
					oPCPopover.bindElement("/aGroups");
					return oPCPopover;
				});
			}
			this._pcPopover.then(function (oPCPopover) {
				oPCPopover.openBy(oSource);
			});

		},
		onGLReqdetails: function (oEvent) {
			var oSource = oEvent.getSource();
			var aGroups = oSource.getBindingContext("BRMMaster").getProperty("groups");
			var aFilterGrp = aGroups.filter(role => role.value.search("DA_MDM_GL_REQ") === 0);
			this.getView().getModel("BRMMaster").setProperty("/GLACGroupdData", aFilterGrp);
			var oView = this.getView();
			// create popover
			if (!this._GLPopover) {
				this._GLPopover = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmGLAccount.GLACgroup",
					controller: this
				}).then(function (oGLPopover) {
					oView.addDependent(oGLPopover);
					oGLPopover.bindElement("/aGroups");
					return oGLPopover;
				});
			}
			this._GLPopover.then(function (oPCPopover) {
				oPCPopover.openBy(oSource);
			});

		},
		handleCloseGLACgrp: function () {
			this.getView().byId("myGLPopover").close();
		},
		handleClosePCACgrp: function () {
			this.getView().byId("myPCPopover").close();
		},
		handleCloseCCACgrp: function () {
			this.getView().byId("myCCPopover").close();
		},
		handleCloseVendorACgrp: function () {
			this.getView().byId("myPopover").close();
		},
		handleCloseCustACgrp: function () {
			this.getView().byId("myCustPopover").close();
		},
		paginated_fetch: function (
			url = is_required("url"), // Improvised required argument in JS
			page = 1,
			previousResponse = []
		) {
			return fetch(`${url}?startIndex=${page}`) // Append the page number to the base URL
				.then(response => response.json())
				.then(newResponse => {
					const response = [...previousResponse, ...newResponse.Resources]; // Combine the two arrays
					if (newResponse.Resources.length !== 0) {
						var pages = response.length;
						pages++;
						return this.paginated_fetch(url, pages, response);
					}
					return response;
				});
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
		addEditVendor: function (oEvent) {
			this.emptyVendorObject();
			this.loadAddEditVendor(oEvent);
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
			var oVendor = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("VendrStewApprov").setData(oVendor);
			this.loadAddEditVendor(oEvent);
		},
		loadAddEditVendor: function (oEvent) {
			var oView = this.getView();
			if (!this._pValueHelpDialog) {
				this._pValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmvendor.AddVendStew",
					controller: this
				}).then(function (oValueHelpDialog) {
					oView.addDependent(oValueHelpDialog);
					return oValueHelpDialog;
				});
			}
			this._pValueHelpDialog.then(function (oValueHelpDialog) {
				oValueHelpDialog.open();
			}.bind(this));

		},
		onCloseVendSteward: function (oEvent) {
			this.getView().setBusy(true);
			this.getVendorSetwardApproverData();
			this._pValueHelpDialog.then(function (oValueHelpDialog) {
				oValueHelpDialog.close();
			}.bind(this));
		},

		onSaveSteward: function () {
			this.getView().getModel("BRMMaster").getProperty("/oMDGStewardData");
			this.getView().getModel("VendrStewApprov").getData();
		},
		onVendorApproverDetails: function (oEvent) {
			var oVendor = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("VendrStewApprov").setData(oVendor);
			this.loadAddEditVendorApprovr(oEvent);
		},
		onCustStewDetails: function (oEvent) {
			var oCustomer = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("BRMMaster").setProperty("/CustStewApprov", oCustomer);
			//	this.getView().getModel("CustStewApprov").setData(oVendor);
			this.loadAddEditCustStew(oEvent);
		},
		onCustApproverDetails: function (oEvent) {
			var oCustomer = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			//this.getView().getModel("CustStewApprov").setData(oVendor);
			this.getView().getModel("BRMMaster").setProperty("/CustStewApprov", oCustomer);
			this.loadAddEditCustApprover(oEvent);
		},
		onCCStewDetails: function (oEvent) {
			var oCostCenterStew = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("BRMMaster").setProperty("/CCStewApprov", oCostCenterStew);
			//	this.getView().getModel("CustStewApprov").setData(oVendor);
			this.loadAddEditCCStew(oEvent);
		},
		onCCApproverDetails: function (oEvent) {
			var oCostCenterApprov = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			//this.getView().getModel("CustStewApprov").setData(oVendor);
			this.getView().getModel("BRMMaster").setProperty("/CCStewApprov", oCostCenterApprov);
			this.loadAddEditCCApprover(oEvent);
		},
		onPCStewDetails: function (oEvent) {
			var oPCStew = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("BRMMaster").setProperty("/PCStewApprov", oPCStew);
			//	this.getView().getModel("CustStewApprov").setData(oVendor);
			this.loadAddEditPCStew(oEvent);
		},
		onPCApproverDetails: function (oEvent) {
			var oPCAprov = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			//this.getView().getModel("CustStewApprov").setData(oVendor);
			this.getView().getModel("BRMMaster").setProperty("/PCStewApprov", oPCAprov);
			this.loadAddEditPCApprover(oEvent);
		},
		onGLStewDetails: function (oEvent) {
			var oGLStew = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			this.getView().getModel("BRMMaster").setProperty("/GLStewApprov", oGLStew);
			//	this.getView().getModel("CustStewApprov").setData(oVendor);
			this.loadAddEditGLStew(oEvent);
		},
		onGLApproverDetails: function (oEvent) {
			var oGLAprov = oEvent.oSource.oBindingContexts.BRMMaster.getObject();
			//this.getView().getModel("CustStewApprov").setData(oVendor);
			this.getView().getModel("BRMMaster").setProperty("/GLStewApprov", oGLAprov);
			this.loadAddEditGLApprover(oEvent);
		},
		loadAddEditCCApprover: function () {
			var oView = this.getView();
			if (!this._oDialogCCAprovr) {
				this._oDialogCCAprovr = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmCostCenter.AddCCApprover",
					controller: this
				}).then(function (oCCAprovrDialog) {
					oView.addDependent(oCCAprovrDialog);
					return oCCAprovrDialog;
				});
			}
			this._oDialogCCAprovr.then(function (oCCAprovrDialog) {
				oCCAprovrDialog.open();
			}.bind(this));
		},
		loadAddEditCustApprover: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogCustAprovr) {
				this._oDialogCustAprovr = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmcustomer.AddCustApprover",
					controller: this
				}).then(function (oCustAprovrDialog) {
					oView.addDependent(oCustAprovrDialog);
					return oCustAprovrDialog;
				});
			}
			this._oDialogCustAprovr.then(function (oCustAprovrDialog) {
				oCustAprovrDialog.open();
			}.bind(this));

		},
		loadAddEditPCApprover: function () {
			var oView = this.getView();
			if (!this._oDialogPCAprovr) {
				this._oDialogPCAprovr = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmProfitCenter.AddPCApprover",
					controller: this
				}).then(function (oPCAprovrDialog) {
					oView.addDependent(oPCAprovrDialog);
					return oPCAprovrDialog;
				});
			}
			this._oDialogPCAprovr.then(function (oPCAprovrDialog) {
				oPCAprovrDialog.open();
			}.bind(this));
		},
		loadAddEditGLApprover: function () {
			var oView = this.getView();
			if (!this._oDialogGLAprovr) {
				this._oDialogGLAprovr = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmGLAccount.AddGLApprover",
					controller: this
				}).then(function (oGLAprovrDialog) {
					oView.addDependent(oGLAprovrDialog);
					return oGLAprovrDialog;
				});
			}
			this._oDialogGLAprovr.then(function (oGLAprovrDialog) {
				oGLAprovrDialog.open();
			}.bind(this));

		},
		onCloseGLApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getGLStewardApproverData();
			this._oDialogGLAprovr.then(function (oGLAprovrDialog) {
				oGLAprovrDialog.close();
			}.bind(this));
		},
		onCloseCustApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getCustomerStewardApproverData();
			this._oDialogCustAprovr.then(function (oCustAprovrDialog) {
				oCustAprovrDialog.close();
			}.bind(this));
		},
		onCloseCCApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getCCStewardApproverData();
			this._oDialogCCAprovr.then(function (oCCAprovrDialog) {
				oCCAprovrDialog.close();
			}.bind(this));
		},
		onClosePCApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getPCStewardApproverData();
			this._oDialogPCAprovr.then(function (oPCAprovrDialog) {
				oPCAprovrDialog.close();
			}.bind(this));
		},
		loadAddEditCustStew: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogCustStew) {
				this._oDialogCustStew = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmcustomer.AddCustStew",
					controller: this
				}).then(function (oCustStewDialog) {
					oView.addDependent(oCustStewDialog);
					return oCustStewDialog;
				});
			}
			this._oDialogCustStew.then(function (oCustStewDialog) {
				oCustStewDialog.open();
			}.bind(this));

		},
		loadAddEditCCStew: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogCCStew) {
				this._oDialogCCStew = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmCostCenter.AddCCStew",
					controller: this
				}).then(function (oCCStewDialog) {
					oView.addDependent(oCCStewDialog);
					return oCCStewDialog;
				});
			}
			this._oDialogCCStew.then(function (oCCStewDialog) {
				oCCStewDialog.open();
			}.bind(this));

		},
		loadAddEditPCStew: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogPCStew) {
				this._oDialogPCStew = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmProfitCenter.AddPCStew",
					controller: this
				}).then(function (oPCStewDialog) {
					oView.addDependent(oPCStewDialog);
					return oPCStewDialog;
				});
			}
			this._oDialogPCStew.then(function (oPCStewDialog) {
				oPCStewDialog.open();
			}.bind(this));

		},
		loadAddEditGLStew: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogGLStew) {
				this._oDialogGLStew = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmGLAccount.AddGLStew",
					controller: this
				}).then(function (oGLStewDialog) {
					oView.addDependent(oGLStewDialog);
					return oGLStewDialog;
				});
			}
			this._oDialogGLStew.then(function (oGLStewDialog) {
				oGLStewDialog.open();
			}.bind(this));

		},
		onCloseGLSteward: function () {
			this.getView().setBusy(true);
			this.getGLStewardApproverData();
			this._oDialogGLStew.then(function (oGLStewDialog) {
				oGLStewDialog.close();
			}.bind(this));
		},
		onCloseCustSteward: function (oEvent) {
			this.getView().setBusy(true);
			this.getCustomerStewardApproverData();
			this._oDialogCustStew.then(function (oCustStewDialog) {
				oCustStewDialog.close();
			}.bind(this));
		},
		onCloseCCSteward: function (oEvent) {
			this.getView().setBusy(true);
			this.getCCStewardApproverData();
			this._oDialogCCStew.then(function (oCCStewDialog) {
				oCCStewDialog.close();
			}.bind(this));
		},
		onClosePCSteward: function (oEvent) {
			this.getView().setBusy(true);
			this.getPCStewardApproverData();
			this._oDialogPCStew.then(function (oPCStewDialog) {
				oPCStewDialog.close();
			}.bind(this));
		},
		loadAddEditVendorApprovr: function (oEvent) {
			var oView = this.getView();
			if (!this._oDialogVendApprov) {
				this._oDialogVendApprov = Fragment.load({
					id: oView.getId(),
					name: "murphy.mdm.brm.murphybusinessrule.fragment.brmvendor.AddVendApprover",
					controller: this
				}).then(function (oVendApprovDialog) {
					oView.addDependent(oVendApprovDialog);
					return oVendApprovDialog;
				});
			}
			this._oDialogVendApprov.then(function (oVendApprovDialog) {
				oVendApprovDialog.open();
			}.bind(this));

		},
		onCloseVendApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getVendorSetwardApproverData();
			this._oDialogVendApprov.then(function (oVendApprovDialog) {
				oVendApprovDialog.close();
			}.bind(this));
		},
		onSaveVendSteward: function () {
			this.getView().setBusy(true);
			var oResult = this.getView().getModel("BRMMaster").getProperty("/oMDGApproverData");
			var oSelRoule = this.getView().getModel("VendrStewApprov").getData();
			var oMDGVend = this.getView().getModel("MDGVendorWorkflow").getData();
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGVend
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseVendSteward();
			}.bind(this));
		},
		onSaveVendApprover: function () {
			this.getView().setBusy(true);
			var oResult = this.getView().getModel("BRMMaster").getProperty("/oMDGApproverData");
			var oSelRoule = this.getView().getModel("VendrStewApprov").getData();
			var oMDGVend = this.getView().getModel("MDGVendorWorkflow").getData();
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGVend
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseVendApprover();
			}.bind(this));

			/*	var aOwnerSelectionRules = [];
				oMDGVend.teamDetailDto.find(function (post) {
					if (post.eventName == "ApproverTask") {
						//	msdgVendApprover.push(post);post.ownerSelectionRules
						post.ownerSelectionRules.find(function (post2) {
							if (oSelRoule.value === post2.value) {
								aOwnerSelectionRules.push(oSelRoule);
							} else {
								aOwnerSelectionRules.push(post2);

							}
						})
					}
				});*/

		},
		onSaveCustSteward: function () {
			this.getView().setBusy(true);
			var oMDGCust = this.getView().getModel("BRMMaster").getProperty("/MDGCustomerWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGCust
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseCustSteward();
			}.bind(this));
		},
		onSaveCustApprover: function () {
			this.getView().setBusy(true);
			var oMDGCust = this.getView().getModel("BRMMaster").getProperty("/MDGCustomerWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGCust
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseCustApprover();
			}.bind(this));

		},
		onSaveCCApprover: function () {
			this.getView().setBusy(true);
			var oMDGCust = this.getView().getModel("BRMMaster").getProperty("/MDGCCWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGCust
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseCCApprover();
			}.bind(this));

		},
		onSaveCCSteward: function () {
			this.getView().setBusy(true);
			var oMDGCostCenter = this.getView().getModel("BRMMaster").getProperty("/MDGCCWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGCostCenter
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseCCSteward();
			}.bind(this));
		},
		onSavePCSteward: function () {
			this.getView().setBusy(true);
			var oMDGProfitCenter = this.getView().getModel("BRMMaster").getProperty("/MDGPCWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGProfitCenter
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onClosePCSteward();
			}.bind(this));
		},
		onSavePCApprover: function () {
			this.getView().setBusy(true);
			var oMDGPCApprov = this.getView().getModel("BRMMaster").getProperty("/MDGPCWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGPCApprov
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onClosePCApprover();
			}.bind(this));
		},
		onSaveGLSteward: function () {
			this.getView().setBusy(true);
			var oMDGGLStew = this.getView().getModel("BRMMaster").getProperty("/MDGGLWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGGLStew
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseGLSteward();
			}.bind(this));
		},
		onSaveGLApprover: function () {
			this.getView().setBusy(true);
			var oMDGGLApprov = this.getView().getModel("BRMMaster").getProperty("/MDGGLWorkflow");
			var objParamCreate = {
				url: "/MDM_WORKBOX_DEST/customProcess/updateProcess",
				type: 'POST',
				hasPayload: true,
				data: oMDGGLApprov
			};
			this.serviceCall.handleServiceRequest(objParamCreate).then(function (oData) {
				this.onCloseGLApprover();
			}.bind(this));
		},
		onVendReqTableSearch: function (event) {
			/*	var oTableSearchState = [],
					sQuery = oEvent.getSource().getValue();

				if (sQuery && sQuery.length > 0) {
					oTableSearchState.push(new Filter("name/givenName", FilterOperator.Contains, sQuery));
					oTableSearchState.push(new Filter("name/familyName", FilterOperator.Contains, sQuery));
				}
				this.getView().byId("idVendReqTbl").getBinding("items").filter(oTableSearchState, "Application");*/
			var query = event.getParameter("query");
			this.getView().byId("idVendReqTbl").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						filters: [
							new Filter({
								path: "name/givenName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							})
						],
						and: false
					})
				],
				and: true
			}), FilterType.Application);
		},
		onVendStewrdTableSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idVendStewrdTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onVendApprovTableSearch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idVendApprovTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onObjpagenav: function (oEvent) {
			/*	var sTitle = oEvent.getParameters().section._sInternalTitle;
				if (sTitle === "Vendor") {
					this.getVendorSetwardApproverData();
				} else if (sTitle === "Customer") {
					this.getCustomerStewardApproverData();
				}*/
		},
		onCustReqTableSearch: function (event) {
			var query = event.getParameter("query");
			this.getView().byId("idCustReqTbl").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						filters: [
							new Filter({
								path: "name/givenName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							})
						],
						and: false
					})
				],
				and: true
			}), FilterType.Application);
		},
		onCustStewrdTableSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idCustStewrdTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onCustAprobrTablSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idCustApprovTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onCCReqTableSearch: function (event) {
			var query = event.getParameter("query");
			this.getView().byId("idCCReqTbl").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						filters: [
							new Filter({
								path: "name/givenName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							})
						],
						and: false
					})
				],
				and: true
			}), FilterType.Application);
		},
		onCCStewrdTableSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idCCStewrdTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onCCAprobrTablSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idCCApprovTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onPCReqTableSearch: function (event) {
			var query = event.getParameter("query");
			this.getView().byId("idPCReqTbl").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						filters: [
							new Filter({
								path: "name/givenName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							})
						],
						and: false
					})
				],
				and: true
			}), FilterType.Application);
		},
		onPCStewrdTableSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idPCStewrdTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onPCAprovrTablSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idPCApprovTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onGLReqTableSearch: function (event) {
			var query = event.getParameter("query");
			this.getView().byId("idGLReqTbl").getBinding("items").filter(new Filter({
				filters: [
					new Filter({
						filters: [
							new Filter({
								path: "name/givenName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false
							})
						],
						and: false
					})
				],
				and: true
			}), FilterType.Application);
		},
		onGLStewrdTableSrch: function (oEvent) {
			var oTableSearchState = [],
				sQuery = oEvent.getSource().getValue();
			if (sQuery && sQuery.length > 0) {
				oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
			}
			this.getView().byId("idGLStewrdTbl").getBinding("items").filter(oTableSearchState, "Application");
		},
		onGLAprobrTablSrch: function (oEvent) {
				var oTableSearchState = [],
					sQuery = oEvent.getSource().getValue();
				if (sQuery && sQuery.length > 0) {
					oTableSearchState.push(new Filter("value", FilterOperator.Contains, sQuery));
				}
				this.getView().byId("idGLApprovTbl").getBinding("items").filter(oTableSearchState, "Application");
			}
			/*	onNavtoNotFound: function () {
						this.getOwnerComponent().getRouter().getTargets().display("notFound");
					}*/
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