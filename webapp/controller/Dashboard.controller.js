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
			//	var url = "/MurphyCloudIdPDest/service/scim/Users";
			var url = "/sap/fiori/murphybusinessrule/MurphyCloudIdPDest/service/scim/Users";
			this.paginated_fetch(url).then(function (oData) {
				var oResult = oData;
				var aVendReq = [];
				var aVendApprov = [];
				var aVendSteward = [];
				var aCustReq = [];
				var aCustApprov = [];
				var aCustSteward = [];
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

				////////////
				this.getVendorSetwardApproverData();
				this.getCustomerStewardApproverData();
			}.bind(this));
		},
		getVendorSetwardApproverData: function () {
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
		onCloseCustApprover: function (oEvent) {
			this.getView().setBusy(true);
			this.getCustomerStewardApproverData();
			this._oDialogCustAprovr.then(function (oCustAprovrDialog) {
				oCustAprovrDialog.close();
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
		onCloseCustSteward: function (oEvent) {
			this.getView().setBusy(true);
			this.getCustomerStewardApproverData();
			this._oDialogCustStew.then(function (oCustStewDialog) {
				oCustStewDialog.close();
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
								caseSensitive: false,
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false,
							}),
						],
						and: false,
					})
				],
				and: true,
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
								caseSensitive: false,
							}),
							new Filter({
								path: "name/familyName",
								operator: FilterOperator.Contains,
								value1: query,
								caseSensitive: false,
							}),
						],
						and: false,
					})
				],
				and: true,
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