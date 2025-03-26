sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    "sap/ui/model/type/Currency"
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator, Currency) {
    "use strict";

    return Controller.extend("y4cr2r020e249.controller.AccountView", {

        onInit: function () {
            var oDocDatePicker = this.byId("inputDocumentDate");
            var oPostDatePicker = this.byId("inputPostingDate");
            var oPostPeriodPicker = this.byId("inputPostingPeriod");
            var oFiscalYearPicker = this.byId("inputFiscalYear");
            var oData = {
                items: [
                    {
                        "txtCompanyCode": "1000",
                        "txtAmountDocCurr": "1500.00",
                        "txtAmountLocCurr": "1400.00",
                        "txtGlAccount": "400001",
                        "txtVendorPos": "VP1001",
                        "txtCustomerPos": "CP2001",
                        "txtCostCenter": "CC100",
                        "txtOrderNumber": "ORD1001",
                        "txtAssignmentNumber": "ASG1001",
                        "txtItemText": "Item description 1",
                        "txtProfitCenter": "PC100"
                    },
                    {
                        "txtCompanyCode": "2000",
                        "txtAmountDocCurr": "2500.50",
                        "txtAmountLocCurr": "2450.75",
                        "txtGlAccount": "400002",
                        "txtVendorPos": "VP1002",
                        "txtCustomerPos": "CP2002",
                        "txtCostCenter": "CC200",
                        "txtOrderNumber": "ORD1002",
                        "txtAssignmentNumber": "ASG1002",
                        "txtItemText": "Item description 2",
                        "txtProfitCenter": "PC200"
                    },
                    {
                        "txtCompanyCode": "3000",
                        "txtAmountDocCurr": "3500.00",
                        "txtAmountLocCurr": "3400.00",
                        "txtGlAccount": "400003",
                        "txtVendorPos": "VP1003",
                        "txtCustomerPos": "CP2003",
                        "txtCostCenter": "CC300",
                        "txtOrderNumber": "ORD1003",
                        "txtAssignmentNumber": "ASG1003",
                        "txtItemText": "Item description 3",
                        "txtProfitCenter": "PC300"
                    },
                    {
                        "txtCompanyCode": "4000",
                        "txtAmountDocCurr": "4500.75",
                        "txtAmountLocCurr": "4400.60",
                        "txtGlAccount": "400004",
                        "txtVendorPos": "VP1004",
                        "txtCustomerPos": "CP2004",
                        "txtCostCenter": "CC400",
                        "txtOrderNumber": "ORD1004",
                        "txtAssignmentNumber": "ASG1004",
                        "txtItemText": "Item description 4",
                        "txtProfitCenter": "PC400"
                    },
                    {
                        "txtCompanyCode": "5000",
                        "txtAmountDocCurr": "5500.25",
                        "txtAmountLocCurr": "5400.25",
                        "txtGlAccount": "400005",
                        "txtVendorPos": "VP1005",
                        "txtCustomerPos": "CP2005",
                        "txtCostCenter": "CC500",
                        "txtOrderNumber": "ORD1005",
                        "txtAssignmentNumber": "ASG1005",
                        "txtItemText": "Item description 5",
                        "txtProfitCenter": "PC500"
                    }
                ],
                notifications: [],
                notificationCount: 0,
                tableKey: "",
                currencyCode: "",
                amount: 0
            };

            // Create a new JSON model with the empty data
            var oModel = new JSONModel(oData);

            // Set the model to the view
            this.getView().setModel(oModel);

            var oTableModel = new JSONModel(oData);
            this.getView().setModel(oTableModel, "oTableModel");


            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
        },

        _handleRouteMatched: function (oEvent) {
            var that = this;
            // oEvent.getParameters().arguments.TableIndex
            var oParameters = oEvent.getParameters();
            if (oParameters.name === 'RouteAccountView') {
                this.onReadData();

            }
        },

        onReadData: function () {
            var oModel = this.getView().getModel("oModel");
            oModel.read("/Customers", {
                success: function (oData, response) {
                    console.log("Customers data:", oData);
                },
                error: function (oError) {
                    console.error("Error reading data:", oError);
                }
            });
        },


        onCompanyCodeValueHelpRequest: function (oEvent) {
            var that = this;
            var oTableModel = this.getView().getModel("oTableModel");
            var aCompanyData = oTableModel.getProperty("/aCompanyCode");
            
            if (!this._oCompCodeDialog) {
                this._oCompCodeDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.CompanyCodeDialog", this);
                this.getView().addDependent(this._oCompCodeDialog);
                
                this._oCompCodeDialog.attachSearch(this.onSearchFilter, this);
                this._oCompCodeDialog.attachLiveChange(this.onSearchFilter, this);
            }
            
            if (!aCompanyData || aCompanyData.length === 0) {
                sap.ui.core.BusyIndicator.show(0);
                var oModel = this.getView().getModel("oModel");
                var oParams = {
                    $select: "CustomerID,CompanyName"
                };
                
                oModel.read("/Customers", {
                    urlParameters: oParams,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        oTableModel.setProperty("/aCompanyCode", oData.results);
                        that._oCompCodeDialog.open();
                    },
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        console.error("Error reading data:", oError);
                        sap.m.MessageToast.show("Error loading company data");
                    }
                });
            } else {
                this._oCompCodeDialog.open();
            }
        },
        
        onSearchFilter: function (oEvent) {
            var sValue = oEvent.getParameter("value") || oEvent.getParameter("newValue") || "";
            var oBinding = oEvent.getSource().getBinding("items");
            
            if (!sValue) {
                oBinding.filter([]);
            } else {
                var oFilters = [
                    new Filter("CustomerID", FilterOperator.Contains, sValue),
                    new Filter("CompanyName", FilterOperator.Contains, sValue)
                ];
                
                oBinding.filter(new Filter({
                    filters: oFilters,
                    and: false
                }));
            }
        },

        handleClose: function(oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            
            if (oSelectedItem) {
                var sCustomerID = oSelectedItem.getCells()[0].getText();
                this.byId("inputCompanyCode").setValue(sCustomerID);
            }
        },

        onCurrencyValueHelpRequest: function(oEvent) {
            var aCurrencies = [
                { code: "USD", name: "US Dollar" },
                { code: "EUR", name: "Euro" },
                { code: "GBP", name: "British Pound" },
                { code: "JPY", name: "Japanese Yen" }
            ];
            
            var oCurrencyModel = new sap.ui.model.json.JSONModel({
                currencies: aCurrencies
            });
            
            if (!this._oDialog) {
                this._oDialog = new sap.m.SelectDialog({
                    title: "Select Currency",
                    items: {
                        path: "/currencies",
                        template: new sap.m.StandardListItem({
                            title: "{code}",
                            description: "{name}"
                        })
                    },
                    search: function(oEvent) {
                        var sValue = oEvent.getParameter("value");
                        var oFilter = new sap.ui.model.Filter(
                            "code",
                            sap.ui.model.FilterOperator.Contains,
                            sValue
                        );
                        oEvent.getSource().getBinding("items").filter([oFilter]);
                    },
                    confirm: function(oEvent) {
                        var oSelectedItem = oEvent.getParameter("selectedItem");
                        if (oSelectedItem) {
                            var sCode = oSelectedItem.getTitle();
                            // Set the selected currency code to your model
                            this.getView().getModel("oModel").setProperty("/currencyCode", sCode);
                        }
                    }.bind(this)
                });
                
                this._oDialog.setModel(oCurrencyModel);
            }
            
            this._oDialog.open();
        },

        onHeaderTextValueHelpRequest: function () {
            var that = this;
            // Only load data if it hasn't been loaded yet
            var oTableModel = this.getView().getModel("oTableModel");
            var aTerritoriesData = oTableModel.getProperty("/aTerritories");
            
            if (!this._oHeaderTextDialog) {
                this._oHeaderTextDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.HeaderTextDialog", this);
                this.getView().addDependent(this._oHeaderTextDialog);
                
                this._oHeaderTextDialog.attachSearch(this.onHeaderTextSearchFilter, this);
                this._oHeaderTextDialog.attachLiveChange(this.onHeaderTextSearchFilter, this);
            }
            
            if (!aTerritoriesData || aTerritoriesData.length === 0) {
                sap.ui.core.BusyIndicator.show(0);
                var oModel = this.getView().getModel("oModel");
                var oParams = "TerritoryDescription"
                
                oModel.read("/Territories", {
                    urlParameters: oParams,
                    success: function (oData) {
                        sap.ui.core.BusyIndicator.hide();
                        oTableModel.setProperty("/aTerritories", oData.results);
                        that._oHeaderTextDialog.open();
                    },
                    error: function (oError) {
                        sap.ui.core.BusyIndicator.hide();
                        console.error("Error reading data:", oError);
                        // Show error message to user
                        sap.m.MessageToast.show("Error loading company data");
                    }
                });
            } else {
                this._oHeaderTextDialog.open();
            }

        },
        onHeaderTextSearchFilter: function (oEvent) {
            var sValue = oEvent.getParameter("value") || oEvent.getParameter("newValue") || "";
            var oBinding = oEvent.getSource().getBinding("items");
            
            if (!sValue) {
                oBinding.filter([]);
            } else {
                oBinding.filter(new Filter("TerritoryDescription", FilterOperator.Contains, sValue));
            }
        },

        HeaderTexthandleClose: function (oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sTerritoryDescription = oSelectedItem.getCells()[0].getText().trim();;
                this.byId("inputHeaderText").setValue(sTerritoryDescription);
            };
        },

        onReferenceValueHelpRequest: function() {
            var that = this;
            var oTableModel = this.getView().getModel("oTableModel");

            if(!that.pRefDialog) {
                that.pRefDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.ReferenceDiaglog", this);
                that.getView().addDependent(that.pRefDialog);
            }
            if (!this.aSuppliersData || this.aSuppliersData.length === 0) {
                sap.ui.core.BusyIndicator.show(0);
                var oModel = this.getView().getModel("oModel");
                var oParams = "Address";
                // this.aSuppliersData = oTableModel.getProperty("/aSuppliers");
                oModel.read("/Suppliers", {
                    urlParameters: oParams,
                    success: function(oData){
                        sap.ui.core.BusyIndicator.hide();
                        that.aSuppliersData = oData.results;
                        oTableModel.setProperty("/aSuppliers", oData.results);
                        that.pRefDialog.open();
                    },
                    error: function(oError) {
                        sap.ui.core.BusyIndicator.hide();
                        console.error("Error reading data:", oError);
                        sap.m.MessageToast.show("Error loading company data");
                    }
                });

            }
            else {
                that.pRefDialog.open();
            }
            
        },

        ReferencehandleClose: function(oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            if (oSelectedItem) {
                var sAddress = oSelectedItem.getCells()[0].getText().trim();;
                this.byId("inputReference").setValue(sAddress);
            };
        },

        onShowData: function() {
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            
            if (!that.odlgCustomerData) {
                that.odlgCustomerData = sap.ui.xmlfragment("y4cr2r020e249.fragment.ShowTableData", that);
                that.getView().addDependent(that.odlgCustomerData);
            }
            
            var oModel = this.getView().getModel();
            oModel.setProperty("/tableKey", "");
            
            sap.ui.core.BusyIndicator.hide();
            that.odlgCustomerData.open();
        },
        onPress: function (sPath, tableKey) {  // Add tableKey parameter
            var that = this;
            var oModel = this.getView().getModel("oModel");
            var oTableModel = this.getView().getModel("oTableModel");

            sap.ui.core.BusyIndicator.show(0);

            oModel.read(sPath, {
                success: function (oData) {
                    sap.ui.core.BusyIndicator.hide();
                    oTableModel.setProperty(sPath, oData.results);

                    // Set the tableKey property to control visibility
                    oTableModel.setProperty("/tableKey", tableKey);
                },
                error: function (oError) {
                    sap.ui.core.BusyIndicator.hide();
                    console.error("Error reading data:", oError);
                }
            });
        },

        onCustomersPress: function (oEvent) {
            var that = this;
            var oButton = oEvent.getSource();
            var oView = this.getView();
            that.customerID = oButton.getId();
            // id = oView.getId();
            this.onPress("/Customers", "c");
        },

        onEmployeesPress: function () {
            // this.onPress("/Employees", "Employees", "e");
            this.onPress("/Employees", "e");
        },

        onSuppliersPress: function () {
            // this.onPress("/Suppliers", "Suppliers", "s");
            this.onPress("/Suppliers", "s");
        },

        onCloseDialog: function() {
            var that = this;
            that.odlgCustomerData.close();
        },

        onCancelShowTableDialog: function () {
            var that = this;
            that.odlgCustomerData.close();
        },

        validateDate: function (oEvent) {
            var oDatePicker = oEvent.getSource();
            var oDate = oDatePicker.getDateValue();

            if (!oDate) {
                oDatePicker.setValueState("Error");
                oDatePicker.setValueStateText("Please enter a valid date");
                return false;
            } else {
                oDatePicker.setValueState("None");
                return true;
            }
        },
        onDocumentDateChange: function (oEvent) {
            this.validateDate(oEvent);
        },

        onPostingDateChange: function (oEvent) {
            this.validateDate(oEvent);
        },

        onPostingPeriodChange: function (oEvent) {
            this.validateDate(oEvent);
        },
        
        onFiscalYearChange: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oInput = oEvent.getSource();
            // Regular expression for YYYY format
            var dateRegex = /^\d{4}$/;
            if (!dateRegex.test(sValue)) {
                // Invalid format
                oInput.setValueState("Error");
                oInput.setValueStateText("Please enter date in format YYYY");
            } else {
                // Valid format
                oInput.setValueState("None");
            }
        },

        onAdd: function () {
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");

            if (aItems.length > 0) {
                var oLastRow = aItems[aItems.length - 1];

                if (!oLastRow.txtCompanyCode || !oLastRow.txtAmountDocCurr) {
                    sap.m.MessageToast.show("Please fill all mandatory fields before adding a new row.");
                    return;
                }
            }

            aItems.push({
                txtCompanyCode: "",
                txtAmountDocCurr: "",
                txtAmountLocCurr: "",
                txtGlAccount: "",
                txtVendorPos: "",
                txtCustomerPos: "",
                txtCostCenter: "",
                txtOrderNumber: "",
                txtAssignmentNumber: "",
                txtItemText: "",
                txtProfitCenter: ""
            });
            oModel.setProperty("/items", aItems);
        },

        onDelete: function () {
            var oTable = this.byId("accountTable");

            var aSelectedIndices = oTable.getSelectedIndices();
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("Please select at least one row to delete.");
                return;
            }

            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");

            aSelectedIndices.sort(function (a, b) { return b - a; });

            aSelectedIndices.forEach(function (iIndex) {
                aItems.splice(iIndex, 1);
            });

            oModel.setProperty("/items", aItems);
            oTable.clearSelection();

            sap.m.MessageToast.show("Selected row(s) deleted.");
        },

        onNotificationPress: function (oEvent) {
            var oModel = this.getView().getModel();
            var aNotifications = oModel.getProperty("/notifications");

            if (aNotifications.length === 0) {
                MessageToast.show("No Notifications");
            }
        }

    });
});
