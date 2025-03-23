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
            // var oSimpleForm = this.byId("accountSimpleForm");
            // oSimpleForm.addStyleClass("noTitles");
            // Create an empty data object for the model
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

        // onCompanyCodeValueHelpRequest: function (oEvent) {
        //     var that = this;
        //     var oModel = this.getView().getModel("oModel");
        //     var oTableModel = this.getView().getModel("oTableModel");
        //     sap.ui.core.BusyIndicator.show(0);
        //     var oParams = {
        //         $select: "CustomerID,CompanyName"
        //     };
        //     oModel.read("/Customers", {
        //         urlParameters: oParams,
        //         success: function (oData, response) {
        //             sap.ui.core.BusyIndicator.hide();
        //             oTableModel.setProperty("/aCompanyCode", oData.results);
        //             // TableIndex: oEvent.getSource().getBindingContext("aCompanyCode").sPath.split("/")[2]
        //             if (!that.odlgCompanyCode) {
        //                 that.odlgCompanyCode = sap.ui.xmlfragment("y4cr2r020e249.fragment.CompanyCodeDialog", that);
        //                 that.getView().addDependent(that.odlgCompanyCode, that);

        //                 var oSearchField = sap.ui.getCore().byId(that.odlgCompanyCode.getId() + "-searchField");
                
        //                 // Attach the liveChange event
        //                 if (oSearchField) {
        //                     oSearchField.attachLiveChange(that.handleLiveSearch, that);
        //                 }

        //             }
        //             that.odlgCompanyCode.open();
        //         },
        //         error: function (oError) {
        //             console.error("Error reading data:", oError);
        //         }
        //     });

        // },

        // handleSearch: function (oEvent) {
		// 	var sValue = oEvent.getParameter("value");
		// 	var oFilter = new Filter("CustomerID", FilterOperator.Contains, sValue);
		// 	var oBinding = oEvent.getSource().getBinding("items");
		// 	oBinding.filter([oFilter]);
		// },

        // handleLiveSearch: function (oEvent) {
        //     var sValue = oEvent.getParameter("newValue");
        //     var oBinding = this.odlgCompanyCode.getBinding("items");
            
        //     if (!sValue || sValue === "") {
        //         // Clear all filters if search field is empty
        //         oBinding.filter([]);
        //     } else {
        //         // Create filters for both CustomerID and CompanyName
        //         var oFilterCustomerID = new Filter("CustomerID", FilterOperator.Contains, sValue);
        //         var oFilterCompanyName = new Filter("CompanyName", FilterOperator.Contains, sValue);
                
        //         // Combine the filters with OR operator
        //         var oCombinedFilter = new Filter({
        //             filters: [oFilterCustomerID, oFilterCompanyName],
        //             and: false  // This means OR operation
        //         });
                
        //         // Apply the filter to the binding
        //         oBinding.filter(oCombinedFilter);
        //     }
        // },

        // handleSearch: function (oEvent) {
        //     var sValue = oEvent.getParameter("value");
        //     var oBinding = oEvent.getSource().getBinding("items");
            
        //     if (!sValue || sValue === "") {
        //         oBinding.filter([]);
        //     } else {
        //         var oFilterCustomerID = new Filter("CustomerID", FilterOperator.Contains, sValue);
        //         var oFilterCompanyName = new Filter("CompanyName", FilterOperator.Contains, sValue);
        //         var oCombinedFilter = new Filter({
        //             filters: [oFilterCustomerID, oFilterCompanyName],
        //             and: false
        //         });
        //         oBinding.filter(oCombinedFilter);
        //     }
        // },

        onCompanyCodeValueHelpRequest: function (oEvent) {
            var that = this;
            // Only load data if it hasn't been loaded yet
            var oTableModel = this.getView().getModel("oTableModel");
            var aCompanyData = oTableModel.getProperty("/aCompanyCode");
            
            // Create dialog if it doesn't exist
            if (!this._oCompCodeDialog) {
                this._oCompCodeDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.CompanyCodeDialog", this);
                this.getView().addDependent(this._oCompCodeDialog);
                
                // Attach event handlers just once when creating the dialog
                this._oCompCodeDialog.attachSearch(this.onSearchFilter, this);
                this._oCompCodeDialog.attachLiveChange(this.onSearchFilter, this);
            }
            
            // Only load data if we don't have it already
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
                        // Show error message to user
                        sap.m.MessageToast.show("Error loading company data");
                    }
                });
            } else {
                // If we already have data, just open the dialog
                this._oCompCodeDialog.open();
            }
        },
        
        // Single unified search handler for both live change and search events
        onSearchFilter: function (oEvent) {
            // Get search value, checking both possible parameter names
            var sValue = oEvent.getParameter("value") || oEvent.getParameter("newValue") || "";
            var oBinding = oEvent.getSource().getBinding("items");
            
            if (!sValue) {
                oBinding.filter([]);
            } else {
                // Create filters for both CustomerID and CompanyName
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
            
            // If item was selected (not just canceled)
            if (oSelectedItem) {
                var sCustomerID = oSelectedItem.getCells()[0].getText();
                
                // Set the selected CustomerID to your input field
                this.byId("inputCompanyCode").setValue(sCustomerID);
                
                // If you want to trigger the change event programmatically
                // this.onCompanyCodeChange();
            }
        },

        onCurrencyValueHelpRequest: function(oEvent) {
            // If you don't have an OData service for currencies, you can define a local model
            var aCurrencies = [
                { code: "USD", name: "US Dollar" },
                { code: "EUR", name: "Euro" },
                { code: "GBP", name: "British Pound" },
                { code: "JPY", name: "Japanese Yen" }
                // Add more currencies as needed
            ];
            
            // Create a model for the currencies
            var oCurrencyModel = new sap.ui.model.json.JSONModel({
                currencies: aCurrencies
            });
            
            // Create a dialog or fragment to show the currencies
            // This is a simplified example - you might want to use a fragment
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
            
            // Create dialog if it doesn't exist
            if (!this._oHeaderTextDialog) {
                this._oHeaderTextDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.HeaderTextDialog", this);
                this.getView().addDependent(this._oHeaderTextDialog);
                
                // Attach event handlers just once when creating the dialog
                this._oHeaderTextDialog.attachSearch(this.onHeaderTextSearchFilter, this);
                this._oHeaderTextDialog.attachLiveChange(this.onHeaderTextSearchFilter, this);
            }
            
            // Only load data if we don't have it already
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
                // If we already have data, just open the dialog
                this._oHeaderTextDialog.open();
            }

        },
        onHeaderTextSearchFilter: function (oEvent) {
            // Get search value, checking both possible parameter names
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
                // Important: add this else branch to open the dialog when data exists
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

        // onShowData: function() {
        //     var that = this;
        //     var oModel = this.getView().getModel("oModel");
        //     var oTableModel = this.getView().getModel("oTableModel");
        //     sap.ui.core.BusyIndicator.show(0);
        //     oModel.read("/Customers", {
        //         success: function(oData, response) {
        //             sap.ui.core.BusyIndicator.hide();
        //             oTableModel.setProperty("/aTableResults", oData.results);
        //             if(!that.odlgCustomerData) {
        //                 that.odlgCustomerData = sap.ui.xmlfragment("y4cr2r020e249.fragment.ShowTableData", that);
        //                 that.getView().addDependent(that.odlgCustomerData, that);

        //             }
        //             that.odlgCustomerData.open();
        //         },
        //         error: function(oError) {
        //             console.error("Error reading data:", oError);
        //         }
        //     });
        // },

        // onCustomersPress: function(oEvent) {
        //     var that = this;
        //     var oModel = this.getView().getModel("oModel");
        //     var oTableModel = this.getView().getModel("oTableModel");
        //     oModel.read("/Customers", {
        //         success: function(oData, response) {
        //             sap.ui.core.BusyIndicator.hide();
        //             oTableModel.setProperty("/aTableResults", oData.results);
        //         }
        //     },
        // },

        // onShowData: function () {
        //     var that = this;
        //     sap.ui.core.BusyIndicator.show(0);
        //     if (!that.odlgCustomerData) {
        //         that.odlgCustomerData = sap.ui.xmlfragment("y4cr2r020e249.fragment.ShowTableData", that);
        //         that.getView().addDependent(that.odlgCustomerData);
        //     }
        //     sap.ui.core.BusyIndicator.hide();
        //     that.odlgCustomerData.open();
        // },

        // onPress: function(sPath, sID) {
        //     var that = this;
        //     var oModel = this.getView().getModel("oModel");
        //     var oTableModel = this.getView().getModel("oTableModel");

        //     sap.ui.core.BusyIndicator.show(0);

        //     oModel.read(sPath, {
        //         success: function(oData) {
        //             sap.ui.core.BusyIndicator.hide();
        //             oTableModel.setProperty("/" + sID, oData.results);

        //             // // Set all tables to invisible
        //             // var aTables = ["tblCustomers", "tblEmployees", "tblSuppliers"];
        //             // aTables.forEach(function(tableId) {
        //             //     that.byId(tableId).setVisible(false);
        //             // });

        //             that.byId("sID").setVisible(true);

        //         },
        //         error: function(oError) {
        //             sap.ui.core.BusyIndicator.hide();
        //             console.error("Error reading data:", oError);
        //         }
        //     });
        // },



        // onCustomersPress: function() {
        //     this.onPress("/Customers", "tblCustomers");
        // },

        // onEmployeesPress: function() {
        //     this.onPress("/Employees", "tblEmployees");
        // },

        // onSuppliersPress: function() {
        //     this.onPress("/Suppliers", "tblSuppliers");
        // },
        onShowData: function() {
            var that = this;
            sap.ui.core.BusyIndicator.show(0);
            
            if (!that.odlgCustomerData) {
                that.odlgCustomerData = sap.ui.xmlfragment("y4cr2r020e249.fragment.ShowTableData", that);
                that.getView().addDependent(that.odlgCustomerData);
            }
            
            // Reset the active table when opening the dialog
            var oModel = this.getView().getModel();
            oModel.setProperty("/tableKey", "");
            
            sap.ui.core.BusyIndicator.hide();
            that.odlgCustomerData.open();
        },
        // Modify the onPress function to update tableKey
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
        // Update button press handlers to pass tableKey
        onCustomersPress: function (oEvent) {
            var that = this;
            var oButton = oEvent.getSource();
            var oView = this.getView();
            that.customerID = oButton.getId();
            // id = oView.getId();
            this.onPress("/Customers", "c");  // pass "c" as tableKey
        },

        onEmployeesPress: function () {
            this.onPress("/Employees", "Employees", "e");  // pass "e" as tableKey 
        },

        onSuppliersPress: function () {
            this.onPress("/Suppliers", "Suppliers", "s");  // pass "s" as tableKey
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
        // Regular expression for DD.MM.YYYY format
        // var dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;

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
            // Get the table control by its ID.
            var oTable = this.byId("accountTable");

            // Retrieve the array of selected indices.
            var aSelectedIndices = oTable.getSelectedIndices();
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("Please select at least one row to delete.");
                return;
            }

            // Get the model and the current items array.
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");

            // Sort the indices in descending order to avoid re-indexing issues.
            aSelectedIndices.sort(function (a, b) { return b - a; });

            // Loop over the sorted indices and remove the corresponding items.
            aSelectedIndices.forEach(function (iIndex) {
                aItems.splice(iIndex, 1);
            });

            // Update the model with the new items array.
            oModel.setProperty("/items", aItems);

            // Clear the table's selection to update the UI.
            oTable.clearSelection();

            sap.m.MessageToast.show("Selected row(s) deleted.");
        },


        // Event handler for notification button press
        onNotificationPress: function (oEvent) {
            // Get the notifications array from the model
            var oModel = this.getView().getModel();
            var aNotifications = oModel.getProperty("/notifications");

            if (aNotifications.length === 0) {
                MessageToast.show("No Notifications");
            }
        }

    });
});
