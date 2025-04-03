sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
	'sap/ui/model/FilterOperator',
    "sap/ui/model/type/Currency",
    "sap/m/MessageBox"
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator, Currency, MessageBox) {
    "use strict";

    var XLSX = window.XLSX;

    return Controller.extend("y4cr2r020e249.controller.AccountView", {

        onInit: function () {
            var oDocDatePicker = this.byId("inputDocumentDate");
            var oPostDatePicker = this.byId("inputPostingDate");
            var oPostPeriodPicker = this.byId("inputPostingPeriod");
            var oFiscalYearPicker = this.byId("inputFiscalYear");
            var oData = {
                items: [
                    
                ],
                notifications: [],
                notificationCount: 0,
                tableKey: "",
                // currencyCode: "",
                currencies: [
                    { code: "USD" },
                    { code: "EUR" },
                    { code: "JPY" },
                    { code: "GBP" },
                    { code: "AUD" }
                ],
                selectedCurrency: "",
                amount: 0
                
            };

            // Create a new JSON model with the empty data
            var oModel = new JSONModel(oData);

            // Set the model to the view
            this.getView().setModel(oModel);

            // this.getView().setModel(oModel, "oModel");
            // console.log("Model set in onInit:", this.getView().getModel("oModel").getProperty("/currencies"));

            var oTableModel = new JSONModel(oData);
            this.getView().setModel(oTableModel, "oTableModel");
            console.log("Model set in onInit:", this.getView().getModel("oTableModel").getProperty("/currencies"));


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

        // onReadData: function () {
        //     var oModel = this.getView().getModel("oModel");
        //     oModel.read("/Customers", {
        //         success: function (oData, response) {
        //             console.log("Customers data:", oData);
        //         },
        //         error: function (oError) {
        //             console.error("Error reading data:", oError);
        //         }
        //     });
        // },


        onCompanyCodeValueHelpRequest: function (oEvent) {
            var that = this;
            var oTableModel = this.getView().getModel("oTableModel");
            var aCompanyData = oTableModel.getProperty("/aCompanyCode");
            
            if (!this._oCompCodeDialog) {
                this._oCompCodeDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.CompanyCodeDialog", this);
                this.getView().addDependent(this._oCompCodeDialog);
                
                this._oCompCodeDialog.attachSearch(this.onCompanyCodeSearchFilter, this);
                this._oCompCodeDialog.attachLiveChange(this.onCompanyCodeSearchFilter, this);
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
        
        onCompanyCodeSearchFilter: function (oEvent) {
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

        onComapnyCodehandleClose: function(oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem");
            
            if (oSelectedItem) {
                var sCustomerID = oSelectedItem.getCells()[0].getText();
                this.byId("inputCompanyCode").setValue(sCustomerID);
            }
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

        onCurrencyValueHelpRequest: function (oEvent) {
            var oView = this.getView();
            if (!this._oCurrencyValueHelpDialog) {
                Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.CurrencyValueHelp",
                    controller: this
                }).then(function (oDialog) {
                    console.log("Dialog loaded:", oDialog);
                    this._oCurrencyValueHelpDialog = oDialog;
                    oView.addDependent(this._oCurrencyValueHelpDialog);
                    // Set the model on the dialog
                    var oTableModel = oView.getModel("oTableModel");
                    console.log("Currencies:", oTableModel.getProperty("/currencies"));
                    this._oCurrencyValueHelpDialog.setModel(oTableModel, "oTableModel");
                    // this._oCurrencyValueHelpDialog.setModel(oView.getModel("oModel"), "oModel");
                    this._oCurrencyValueHelpDialog.open();
                }.bind(this)).catch(function (error) {
                    console.error("Failed to load fragment:", error);
                });
            } else {
                // Ensure the model is set even if reusing the dialog
                this._oCurrencyValueHelpDialog.setModel(oView.getModel("oModel"), "oModel");
                this._oCurrencyValueHelpDialog.open();
            }
        },

        onCurrencyValueHelpCancel: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            // var oInput = this.byId("inputCurrency");
            if (oSelectedItem) {
                var sCurrency = oSelectedItem.getTitle();
                this.getView().getModel("oTableModel").setProperty("/selectedCurrency", sCurrency);
            }
        },

        onCurrencyhandleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value");
            var oFilter = new sap.ui.model.Filter("code", FilterOperator.Contains, sValue);
            var oBinding = oEvent.getSource().getBinding("items");
            oBinding.filter([oFilter]);
        },

        onHeaderTextValueHelpRequest: function(oEvent) {
            var that = this;
            var oView = this.getView();

			if (!this._pHeaderTextValueHelpDialog) {
				this._pHeaderTextValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "y4cr2r020e249.fragment.HeaderTextDialog",
					controller: this
				}).then(function (oValueHelpDialog){
					oView.addDependent(oValueHelpDialog);
					return oValueHelpDialog;
				});
			}
			this._pHeaderTextValueHelpDialog.then(function(oValueHelpDialog){
				oValueHelpDialog.open();
			}.bind(this));
        },

        onHeaderTexthandleSearch: function (oEvent) {
            var that = this;
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getParameter("itemsBinding");
            if (!sValue) {
                oBinding.filter([]);
            } else {
                var oFilter = new Filter("TerritoryDescription", FilterOperator.Contains, sValue);
                oBinding.filter([oFilter]);
            }
        },

        onHeaderTexthandleClose: function(oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.byId("inputHeaderText");

			if (!oSelectedItem) {
				// oInput.resetProperty("value");
				return;
			}
			oInput.setValue(oSelectedItem.getTitle().trim());
        },

        onReferenceValueHelpRequest: function(oEvent) {
            var that = this;
            var oView = this.getView();

			if (!this._pReferenceValueHelpDialog) {
				this._pReferenceValueHelpDialog = Fragment.load({
					id: oView.getId(),
					name: "y4cr2r020e249.fragment.ReferenceDiaglog",
					controller: this
				}).then(function (oValueHelpDialog){
					oView.addDependent(oValueHelpDialog);
					return oValueHelpDialog;
				});
			}
			this._pReferenceValueHelpDialog.then(function(oValueHelpDialog){
				oValueHelpDialog.open();
			}.bind(this));
        },

        onReferencehandleSearch: function (oEvent) {
            var that = this;
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getParameter("itemsBinding");
            if (!sValue) {
                oBinding.filter([]);
            } else {
                var oFilter = new Filter("Address", FilterOperator.Contains, sValue);
                oBinding.filter([oFilter]);
            }
        },

        onReferencehandleClose: function(oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem"),
				oInput = this.byId("inputReference");

			if (!oSelectedItem) {
				// oInput.resetProperty("value");
				return;
			}
			oInput.setValue(oSelectedItem.getTitle().trim());
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

        // onSimulation: function() {
        //     var oModel = this.getView().getModel("oTableModel");
        //     var aItems = oModel.getProperty("/items") || [];
        //     var bAllValid = true;
            
        //     // Validate each row
        //     aItems.forEach(function(oItem, index) {
        //         // Check mandatory fields
        //         if (!oItem.txtCompanyCode || !oItem.txtAmountDocCurr) {
        //             oItem.validationStatus = "invalid"; // Required fields missing
        //             bAllValid = false;
        //         } else {
        //             oItem.validationStatus = "valid"; // All required fields provided
        //         }
                
        //         // Add more validation as needed
        //         // For example, check if amount is a valid number
        //         if (oItem.txtAmountDocCurr && isNaN(parseFloat(oItem.txtAmountDocCurr))) {
        //             oItem.validationStatus = "invalid";
        //             bAllValid = false;
        //         }
        //     });
            
        //     // Update model
        //     oModel.setProperty("/items", aItems);
            
        //     // Show message based on validation result
        //     if (bAllValid) {
        //         MessageToast.show("All items validated successfully!");
        //     } else {
        //         MessageBox.error("There are validation errors. Please check the items marked in red.");
        //     }
        // },

        onSimulation: function() {
            var oModel = this.getView().getModel("oTableModel");
            var aItems = oModel.getProperty("/items") || [];
            var bAllValid = true;
            var missingFields = {
                companyCode: [],
                amountDocCurr: []
            };
            var rowsWithErrors = 0;
            
            // Validate each row
            aItems.forEach(function(oItem, index) {
                var rowHasError = false;
                
                // Check Company Code
                if (!oItem.txtCompanyCode) {
                    missingFields.companyCode.push(index + 1); // +1 for human-readable row numbers
                    rowHasError = true;
                }
                
                // Check Amount
                if (!oItem.txtAmountDocCurr) {
                    missingFields.amountDocCurr.push(index + 1);
                    rowHasError = true;
                } else if (isNaN(parseFloat(oItem.txtAmountDocCurr))) {
                    // Valid number check
                    missingFields.amountDocCurr.push(index + 1);
                    rowHasError = true;
                }
                
                // Set validation status for this row
                oItem.validationStatus = rowHasError ? "invalid" : "valid";
                
                // Track overall validation
                if (rowHasError) {
                    bAllValid = false;
                    rowsWithErrors++;
                }
            });
            
            // Update model
            oModel.setProperty("/items", aItems);
            
            // Force binding refresh to ensure UI updates
            this.byId("accountTable").getBinding("rows").refresh();
            
            // Show appropriate message based on validation results
            if (bAllValid) {
                MessageToast.show("All items validated successfully!");
            } else {
                var errorMessage = "Validation errors found in " + rowsWithErrors + " row(s):\n";
                
                if (missingFields.companyCode.length > 0) {
                    errorMessage += "-> Missing Company Code in rows: " + missingFields.companyCode.join(", ") + "\n";
                }
                
                if (missingFields.amountDocCurr.length > 0) {
                    errorMessage += "-> Missing or invalid Amount Doc.Curr. in rows: " + missingFields.amountDocCurr.join(", ") + "\n";
                }
                
                errorMessage += "\nPlease fix the items marked in red.";
                
                MessageBox.error(errorMessage);
            }
        },


        onAdd: function () {
            var inputCompanyCode = this.getView().byId("inputCompanyCode").getValue();
            var inputDocumentDate = this.getView().byId("inputDocumentDate").getValue();
            var inputPostingDate = this.getView().byId("inputPostingDate").getValue();
            var inputPostingPeriod = this.getView().byId("inputPostingPeriod").getValue();
            var inputFiscalYear = this.getView().byId("inputFiscalYear").getValue();
            var inputCurrency = this.getView().byId("inputCurrency").getValue();
            var inputHeaderText = this.getView().byId("inputHeaderText").getValue();
            var inputReference = this.getView().byId("inputReference").getValue();
            
            // if (inputCompanyCode === "" || inputDocumentDate === "" || inputPostingDate === "" || inputPostingPeriod === "" || inputCurrency === "" || inputFiscalYear === "" || inputHeaderText === "" || inputReference === "") {

            //     MessageBox.error("Please select the mandatory fields");
            // }
            // else {
                


            // }

            var obj = {
                "txtCompanyCode": inputCompanyCode,
                "txtAmountDocCurr": "",
                "txtGlAccount": "",
                "txtVendorPos": "",
                "txtCustomerPos": "",
                "txtCostCenter": "",
                "txtAssignmentNumber": "",
                "txtItemText": "",
                "txtProfitCenter": "",
                "validationStatus": "pending"
            };

            this.getView().getModel("oTableModel").getData().items.unshift(obj);
            this.getView().getModel("oTableModel").updateBindings();

        },

        onDelete: function() {
            var oTable = this.byId("accountTable");
            var aSelectedIndices = oTable.getSelectedIndices();
            var oModel = this.getView().getModel();
            var aItems = oModel.getProperty("/items");
        
            if (aSelectedIndices.length === 0) {
                sap.m.MessageToast.show("Please select at least one row to delete.");
                return;
            }
        
            // Create a new array without the selected rows
            var aNewItems = aItems.filter(function(item, index) {
                return aSelectedIndices.indexOf(index) === -1;
            });
        
            // Update the model
            oModel.setProperty("/items", aNewItems);
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