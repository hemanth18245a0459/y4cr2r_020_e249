sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast"
], function (Controller, JSONModel, MessageToast) {
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
                notificationCount: 0
            };

            // Create a new JSON model with the empty data
            var oModel = new JSONModel(oData);

            // Set the model to the view
            this.getView().setModel(oModel);

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
        },

        _handleRouteMatched: function(oEvent) {
            var that = this;
            // oEvent.getParameters().arguments.TableIndex
            var oParameters = oEvent.getParameters();
            if (oParameters.name === 'RouteAccountView') {
                this.onReadData();
                
            }
        },

        onReadData: function() {
            var oModel = this.getView().getModel("oModel");
            oModel.read("/Customers", {
                success: function(oData, response) {
                    console.log("Customers data:", oData);
                },
                error: function(oError) {
                    console.error("Error reading data:", oError);
                }
            });
        },

        validateDate: function(oEvent) {
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
        onDocumentDateChange: function(oEvent) {
            this.validateDate(oEvent);
        },
        
        onPostingDateChange: function(oEvent) {
            this.validateDate(oEvent);
        },
        
        onPostingPeriodChange: function(oEvent) {
            this.validateDate(oEvent);
        },
        // Regular expression for DD.MM.YYYY format
        // var dateRegex = /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.\d{4}$/;

        onFiscalYearChange: function(oEvent) {
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
            aSelectedIndices.sort(function(a, b) { return b - a; });
            
            // Loop over the sorted indices and remove the corresponding items.
            aSelectedIndices.forEach(function(iIndex) {
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
