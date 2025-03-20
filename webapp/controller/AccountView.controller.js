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
                    },
                    {
                        "txtCompanyCode": "6000",
                        "txtAmountDocCurr": "6500.00",
                        "txtAmountLocCurr": "6400.00",
                        "txtGlAccount": "400006",
                        "txtVendorPos": "VP1006",
                        "txtCustomerPos": "CP2006",
                        "txtCostCenter": "CC600",
                        "txtOrderNumber": "ORD1006",
                        "txtAssignmentNumber": "ASG1006",
                        "txtItemText": "Item description 6",
                        "txtProfitCenter": "PC600"
                    },
                    {
                        "txtCompanyCode": "7000",
                        "txtAmountDocCurr": "7500.50",
                        "txtAmountLocCurr": "7400.50",
                        "txtGlAccount": "400007",
                        "txtVendorPos": "VP1007",
                        "txtCustomerPos": "CP2007",
                        "txtCostCenter": "CC700",
                        "txtOrderNumber": "ORD1007",
                        "txtAssignmentNumber": "ASG1007",
                        "txtItemText": "Item description 7",
                        "txtProfitCenter": "PC700"
                    },
                    {
                        "txtCompanyCode": "8000",
                        "txtAmountDocCurr": "8500.00",
                        "txtAmountLocCurr": "8400.00",
                        "txtGlAccount": "400008",
                        "txtVendorPos": "VP1008",
                        "txtCustomerPos": "CP2008",
                        "txtCostCenter": "CC800",
                        "txtOrderNumber": "ORD1008",
                        "txtAssignmentNumber": "ASG1008",
                        "txtItemText": "Item description 8",
                        "txtProfitCenter": "PC800"
                    },
                    {
                        "txtCompanyCode": "9000",
                        "txtAmountDocCurr": "9500.25",
                        "txtAmountLocCurr": "9400.25",
                        "txtGlAccount": "400009",
                        "txtVendorPos": "VP1009",
                        "txtCustomerPos": "CP2009",
                        "txtCostCenter": "CC900",
                        "txtOrderNumber": "ORD1009",
                        "txtAssignmentNumber": "ASG1009",
                        "txtItemText": "Item description 9",
                        "txtProfitCenter": "PC900"
                    },
                    {
                        "txtCompanyCode": "10000",
                        "txtAmountDocCurr": "10500.00",
                        "txtAmountLocCurr": "10400.00",
                        "txtGlAccount": "400010",
                        "txtVendorPos": "VP1010",
                        "txtCustomerPos": "CP2010",
                        "txtCostCenter": "CC1000",
                        "txtOrderNumber": "ORD1010",
                        "txtAssignmentNumber": "ASG1010",
                        "txtItemText": "Item description 10",
                        "txtProfitCenter": "PC1000"
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
