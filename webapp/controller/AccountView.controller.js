sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    'sap/ui/model/Filter',
    'sap/ui/model/FilterOperator',
    "sap/ui/model/type/Currency",
    "sap/m/MessageBox",
    "sap/m/P13nColumnsPanel",
    "sap/m/CheckBox"
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator, Currency, MessageBox, P13nColumnsPanel, CheckBox) {
    "use strict";

    // var XLSX = window.XLSX;

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

            // Initialize the JSON model for the SmartTable data
            var obj = {
                "aResults": [
                    {
                        "Comp.Code": "COMP001",
                        "Amount Doc.Curr.": 1000,
                        "Amount Loc.Curr.": 950,
                        "G/L account": "4000",
                        "Vendor pos.": "V001",
                        "Customer pos.": "C001",
                        "Cost center": "CC100",
                        "Order Number": "ORD123",
                        "Assignment number": "ASG789",
                        "Item Text": "Item description",
                        "Profit Center": "PC001",
                        "Value Date": "2025-01-01",
                        "Business area": "BA01",
                        "Quantity": 10,
                        "Unit": "EA",
                        "Puchase Order": "PO12345",
                        "PO Item Adjust": "001",
                        "Trad. Partn.": "TP100",
                        "St. Centr. bk ind.": "X",
                        "Suppl. Ctry": "US",
                        "Tax code": "TX01",
                        "Tax percent.": 5,
                        "Plant": "PL01",
                        "Withh.TxCd": "WTX",
                        "Disc.base": 950,
                        "Days 1": 30,
                        "Disc.1": 2,
                        "Baseline Date": "2025-01-01",
                        "Payt Terms": "NET 30",
                        "PaymBlk": "PB001",
                        "Transaction Type": "TRX",
                        "SGL Ind.": "Y",
                        "Pymt method": "EFT",
                        "Payment Ref.": "PMT123",
                        "Dunn. Block": "DB001",
                        "Business place": "BP001"
                    },
                    {
                        "Comp.Code": "COMP002",
                        "Amount Doc.Curr.": 2000,
                        "Amount Loc.Curr.": 1900,
                        "G/L account": "4001",
                        "Vendor pos.": "V002",
                        "Customer pos.": "C002",
                        "Cost center": "CC200",
                        "Order Number": "ORD456",
                        "Assignment number": "ASG890",
                        "Item Text": "Another item description",
                        "Profit Center": "PC002",
                        "Value Date": "2025-02-01",
                        "Business area": "BA02",
                        "Quantity": 20,
                        "Unit": "KG",
                        "Puchase Order": "PO54321",
                        "PO Item Adjust": "002",
                        "Trad. Partn.": "TP200",
                        "St. Centr. bk ind.": "Y",
                        "Suppl. Ctry": "CA",
                        "Tax code": "TX02",
                        "Tax percent.": 10,
                        "Plant": "PL02",
                        "Withh.TxCd": "WTY",
                        "Disc.base": 1900,
                        "Days 1": 45,
                        "Disc.1": 3,
                        "Baseline Date": "2025-02-01",
                        "Payt Terms": "NET 45",
                        "PaymBlk": "PB002",
                        "Transaction Type": "INV",
                        "SGL Ind.": "N",
                        "Pymt method": "Wire",
                        "Payment Ref.": "PMT456",
                        "Dunn. Block": "DB002",
                        "Business place": "BP002"
                    }
                ]
            };

            var oResultModel = new JSONModel(obj);
            // Set the JSON model with a specific name for the view
            this.getView().setModel(oResultModel, "oResultModel");

            // Explicitly set the named model on the SmartTable instance
            // This helps when using enableAutoBinding="true" with JSON models
            // var oSmartTable = this.byId("smartAccountTable");
            // if (oSmartTable) {
            //     oSmartTable.setModel(oResultModel); // Pass the model instance directly
            // } else {
            //     console.error("SmartTable control not found during init!");
            // }
            this.getView().byId("smartAccountTable").setModel(this.getView().getModel("oResultModel"));

            // Check if XLSX is globally available
            if (typeof XLSX === "undefined") {
                console.error("XLSX library not loaded. Check your index.html file.");
            };

            // Attach ONE handler to the entire table
            // var oTable = this.byId("accountTable");
            // oTable.attachCellClick(this.onTableCellClick, this);
            // Initialize validation status for all items
            this._initializeValidationStatus();

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
        },

        _initializeValidationStatus: function() {
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            
            // Initialize validationStatus for all items
            if (aItems && aItems.length > 0) {
                aItems.forEach(function(oItem) {
                    if (!oItem.hasOwnProperty("validationStatus")) {
                        oItem.validationStatus = "pending";
                    }
                });
                oResultModel.refresh(true);
            }
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



        // This single function handles ALL cell clicks in the table
        // onTableCellClick: function(oEvent) {
        //     // Get the specific cell that was clicked
        //     var oCell = oEvent.getParameter("cellControl");

        //     // Only handle company code cells with valueHelp
        //     if (oCell && oCell.getId().indexOf("txtCompanyCode") !== -1 && 
        //         oCell.getShowValueHelp && oCell.getShowValueHelp()) {
        //         // Handle this specific cell's value help request
        //         this.onCompanyCodeValueHelpRequest({
        //             getSource: function() { return oCell; }
        //         });
        //     }
        // },

        onCompanyCodeValueHelpRequest: function (oEvent) {
            var that = this;
            var oTableModel = this.getView().getModel("oTableModel");
            var aCompanyData = oTableModel.getProperty("/aCompanyCode");

            // Store the source control that triggered the value help
            this._oValueHelpSource = oEvent.getSource();

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

        onComapnyCodehandleClose: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");

            if (oSelectedItem && this._oValueHelpSource) {
                var sCustomerID = oSelectedItem.getCells()[0].getText();

                // Get the ID of the source control
                var sSourceId = this._oValueHelpSource.getId();

                // Check if it's from the form or the table
                if (sSourceId === this.byId("inputCompanyCode").getId()) {
                    // It's the form field
                    this.byId("inputCompanyCode").setValue(sCustomerID);
                } else {
                    // It's a table cell - set the value directly on the source control
                    this._oValueHelpSource.setValue(sCustomerID);

                    // Get the binding context to update the model
                    var oBindingContext = this._oValueHelpSource.getBindingContext("oTableModel");
                    if (oBindingContext) {
                        var sPath = oBindingContext.getPath();
                        var oTableModel = this.getView().getModel("oTableModel");
                        oTableModel.setProperty(sPath + "/txtCompanyCode", sCustomerID);

                        // Optional: Reset validation status to pending
                        oTableModel.setProperty(sPath + "/validationStatus", "pending");
                    }
                }
            }

            // Clear the source reference
            this._oValueHelpSource = null;
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

        onHeaderTextValueHelpRequest: function (oEvent) {
            var that = this;
            var oView = this.getView();

            if (!this._pHeaderTextValueHelpDialog) {
                this._pHeaderTextValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.HeaderTextDialog",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pHeaderTextValueHelpDialog.then(function (oValueHelpDialog) {
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

        onHeaderTexthandleClose: function (oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("inputHeaderText");

            if (!oSelectedItem) {
                // oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle().trim());
        },

        onReferenceValueHelpRequest: function (oEvent) {
            var that = this;
            var oView = this.getView();

            if (!this._pReferenceValueHelpDialog) {
                this._pReferenceValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.ReferenceDiaglog",
                    controller: this
                }).then(function (oValueHelpDialog) {
                    oView.addDependent(oValueHelpDialog);
                    return oValueHelpDialog;
                });
            }
            this._pReferenceValueHelpDialog.then(function (oValueHelpDialog) {
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

        onReferencehandleClose: function (oEvent) {
            var that = this;
            var oSelectedItem = oEvent.getParameter("selectedItem"),
                oInput = this.byId("inputReference");

            if (!oSelectedItem) {
                // oInput.resetProperty("value");
                return;
            }
            oInput.setValue(oSelectedItem.getTitle().trim());
        },
/*
        // Simulation button logic starts here
        onSimulation: function () {
            var aItems = this.getView().getModel("oTableModel").getProperty("/items");
            let errorRows = [];

            aItems.forEach((oItem, index) => {
                // var isValid = oItem.txtCompanyCode &&  oItem.txtAmountDocCurr && !isNaN(oItem.txtAmountDocCurr);
                var isValid = oItem.txtCompanyCode && oItem.txtAmountDocCurr;

                oItem.validationStatus = isValid ? "valid" : "invalid";
                if (!isValid) errorRows.push(index + 1);
            });

            this.getView().getModel("oTableModel").refresh();

            if (errorRows.length > 0) {
                MessageBox.error(`Missing mandatory fields in rows: ${errorRows.join(", ")}`);
            }
        },
        // Simulation button logic ends here
*/
        // Updated Simulation button logic
        onSimulation: function() {
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            var errorRows = [];
            
            aItems.forEach(function(oItem, index) {
                // Validation check - ensure company code and amount are provided
                var isValid = oItem["Comp.Code"] && 
                              oItem["Amount Doc.Curr."] && 
                              !isNaN(parseFloat(oItem["Amount Doc.Curr."]));
                
                // Update validation status
                oItem.validationStatus = isValid ? "valid" : "invalid";
                if (!isValid) {
                    errorRows.push(index + 1);
                }
            });
            
            // Refresh the model to reflect changes
            oResultModel.refresh(true);
            
            // Show error message if needed
            if (errorRows.length > 0) {
                MessageBox.error("Missing mandatory fields in rows: " + errorRows.join(", "));
            } else {
                MessageToast.show("Simulation completed successfully.");
            }
        },
        // Simulation button logic ends here
/*
        // Add button logic starts
        onAdd: function () {
            var inputCompanyCode = this.getView().byId("inputCompanyCode").getValue();
            var inputDocumentDate = this.getView().byId("inputDocumentDate").getValue();
            var inputPostingDate = this.getView().byId("inputPostingDate").getValue();
            var inputPostingPeriod = this.getView().byId("inputPostingPeriod").getValue();
            var inputFiscalYear = this.getView().byId("inputFiscalYear").getValue();
            var inputCurrency = this.getView().byId("inputCurrency").getValue();
            // var inputHeaderText = this.getView().byId("inputHeaderText").getValue();
            // var inputReference = this.getView().byId("inputReference").getValue();

            if (inputCompanyCode === "" || inputDocumentDate === "" || inputPostingDate === "" || inputPostingPeriod === "" || inputCurrency === "" || inputFiscalYear === "") {

                MessageBox.error("Please fill the mandatory fields");
            }
            else {
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

            }



        },

*/
        // Updated Add button logic
        onAdd: function() {
            // Get form field values directly using their IDs
            var oCompanyCode = this.byId("inputCompanyCode");
            var oDocumentDate = this.byId("inputDocumentDate");
            var oPostingDate = this.byId("inputPostingDate");
            var oPostingPeriod = this.byId("inputPostingPeriod");
            var oFiscalYear = this.byId("inputFiscalYear");
            var oCurrency = this.byId("inputCurrency");
            
            // Validate mandatory fields
            if (!oCompanyCode.getValue() || 
                !oDocumentDate.getValue() || 
                !oPostingDate.getValue() || 
                !oPostingPeriod.getValue() || 
                !oFiscalYear.getValue() || 
                !oCurrency.getValue()) {
                
                MessageBox.error("Please fill all mandatory fields");
                return;
            }
            
            // Create new row object
            var oNewRow = {
                "Comp.Code": oCompanyCode.getValue(),
                "Amount Doc.Curr.": "",
                "Amount Loc.Curr.": "",
                "G/L account": "",
                "Vendor pos.": "",
                "Customer pos.": "",
                "Cost center": "",
                "Order Number": "",
                "Assignment number": "",
                "Item Text": "",
                "Profit Center": "",
                "Value Date": "",
                "Business Area": "",
                "Quantity": "",
                "Unit": "",
                "Purchase Order": "",
                "PO Item Adjustment": "",
                "Trading Partner": "",
                "St. Central Bank Ind.": "",
                "Supplementary Country": "",
                "Tax Code": "",
                "Tax Percentage": "",
                "Plant": "",
                "Withholding Tax Code": "",
                "Discount Base": "",
                "Days 1": "",
                "Discount 1": "",
                "Baseline Date": "",
                "Payment Terms": "",
                "Payment Block": "",
                "Transaction Type": "",
                "SGL Indicator": "",
                "Payment Method": "",
                "Payment Reference": "",
                "Dunning Block": "",
                "Business Place": "",
                "validationStatus": "pending"
                
            };
            
            // Get result model and add the new row
            var oResultModel = this.getView().getModel("oResultModel");
            var aResults = oResultModel.getProperty("/aResults");
            
            // Add new row to the beginning of the array
            aResults.unshift(oNewRow);
            
            // Update the model
            oResultModel.setProperty("/aResults", aResults);
            
            MessageToast.show("New row added");
        },
        // Add button logic ends

/*
        // Implement template download function
        onDownloadTemplate: function () {
            try {
                if (typeof XLSX === "undefined") {
                    MessageToast.show("XLSX library not loaded. Please check your index.html file.");
                    return;
                }

                // Create worksheet with headers
                var ws = XLSX.utils.json_to_sheet([{
                    "Comp.Code": "",
                    "Amount Doc.Curr.": "",
                    "G/L account": "",
                    "Vendor pos.": "",
                    "Customer pos.": "",
                    "Cost Center": "",
                    "Assignment Number": "",
                    "Profit Center": "",
                    "Item Text": ""
                }]);

                // Create workbook
                var wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Template");

                // Generate file and trigger download
                XLSX.writeFile(wb, "AccountPostingTemplate.xlsx");

            } catch (error) {
                console.error("Error generating template:", error);
                MessageToast.show("Error generating template file. See console for details.");
            }
        },
        // Download Template button logic ends
*/
        onDownloadTemplate: function() {
            try {
                // Check if the XLSX library is available
                if (typeof XLSX === "undefined") {
                    MessageToast.show("XLSX library not loaded. Cannot create template.");
                    console.error("XLSX library is undefined.");
                    return;
                }
                
                // Create column headers based on the expected Excel structure
                const headers = [
                    "Company Code",
                    "Document Currency Amount",
                    "Local Currency Amount",
                    "G/L Account",
                    "Vendor Position",
                    "Customer Position",
                    "Cost Center",
                    "Order Number",
                    "Assignment Number",
                    "Item Text",
                    "Profit Center",
                    "Value Date",
                    "Business Area",
                    "Quantity",
                    "Unit",
                    "Purchase Order",
                    "PO Item Adjustment",
                    "Trading Partner",
                    "St. Central Bank Ind.",
                    "Supplementary Country",
                    "Tax Code",
                    "Tax Percentage",
                    "Plant",
                    "Withholding Tax Code",
                    "Discount Base",
                    "Days 1",
                    "Discount 1",
                    "Baseline Date",
                    "Payment Terms",
                    "Payment Block",
                    "Transaction Type",
                    "SGL Indicator",
                    "Payment Method",
                    "Payment Reference",
                    "Dunning Block",
                    "Business Place"
                ];
                
                // Create an example row with sample data
                const exampleRow = {
                    "Company Code": "COMP001",
                    "Document Currency Amount": 1000,
                    "Local Currency Amount": 950,
                    "G/L Account": "4000",
                    "Vendor Position": "V001",
                    "Customer Position": "C001",
                    "Cost Center": "CC100",
                    "Order Number": "ORD123",
                    "Assignment Number": "ASG789",
                    "Item Text": "Sample item description",
                    "Profit Center": "PC001",
                    "Value Date": "2025-01-01",
                    "Business Area": "BA01",
                    "Quantity": 10,
                    "Unit": "EA",
                    "Purchase Order": "PO12345",
                    "PO Item Adjustment": "001",
                    "Trading Partner": "TP100",
                    "St. Central Bank Ind.": "X",
                    "Supplementary Country": "US",
                    "Tax Code": "TX01",
                    "Tax Percentage": 5,
                    "Plant": "PL01",
                    "Withholding Tax Code": "WTX",
                    "Discount Base": 950,
                    "Days 1": 30,
                    "Discount 1": 2,
                    "Baseline Date": "2025-01-01",
                    "Payment Terms": "NET 30",
                    "Payment Block": "PB001",
                    "Transaction Type": "TRX",
                    "SGL Indicator": "Y",
                    "Payment Method": "EFT",
                    "Payment Reference": "PMT123",
                    "Dunning Block": "DB001",
                    "Business Place": "BP001"
                };
                
                // Create a worksheet
                const ws = XLSX.utils.json_to_sheet([exampleRow], { header: headers });
                
                // Set column widths
                const wscols = headers.map(() => ({ wch: 15 })); // Set width for all columns
                ws['!cols'] = wscols;
                
                // Create a workbook
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Template");
                
                // Generate Excel file
                const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
                
                // Convert binary string to ArrayBuffer
                function s2ab(s) {
                    const buf = new ArrayBuffer(s.length);
                    const view = new Uint8Array(buf);
                    for (let i = 0; i < s.length; i++) {
                        view[i] = s.charCodeAt(i) & 0xFF;
                    }
                    return buf;
                }
                
                // Create Blob and download
                const blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' });
                const url = URL.createObjectURL(blob);
                
                const a = document.createElement('a');
                a.href = url;
                a.download = 'Financial_Data_Template.xlsx';
                document.body.appendChild(a);
                a.click();
                
                // Cleanup
                setTimeout(function() {
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                }, 0);
                
                MessageToast.show("Template downloaded successfully.");
                
            } catch (error) {
                console.error("Error creating template:", error);
                MessageBox.error("Error creating template. Details: " + error.message);
            }
        },

        /*
                // upload button logic starts
                onFileChange: function(oEvent) {
                    // This gets called when a file is selected
                    var oFile = oEvent.getParameter("files")[0];
                    if (!oFile) {
                        MessageToast.show("No file selected");
                        return;
                    }
                    
                    // Verify file type
                    var sFileType = oFile.type;
                    var sFileName = oFile.name;
                    
                    if (sFileName.indexOf(".xlsx") === -1 && sFileName.indexOf(".xls") === -1) {
                        MessageToast.show("Please upload an Excel file (.xlsx or .xls)");
                        return;
                    }
                    
                    this.processExcelFile(oFile);
                },
                
                processExcelFile: function(oFile) {
                    // Check if XLSX is available
                    if (typeof XLSX === "undefined") {
                        MessageToast.show("XLSX library not loaded. Please check your index.html file.");
                        return;
                    }
                    
                    var that = this;
                    var reader = new FileReader();
                    
                    reader.onload = function(e) {
                        try {
                            // Use the modern approach with ArrayBuffer
                            var data = new Uint8Array(e.target.result);
                            var workbook = XLSX.read(data, { type: "array" });
                            var sheetName = workbook.SheetNames[0]; // Get the first sheet
                            var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                            
                            console.log("Excel Data:", excelData);
                            if (excelData.length === 0) {
                                MessageToast.show("No data found in the Excel file.");
                                return;
                            }
                            
                            // Log the first row to help with debugging
                            console.log("First row of Excel data:", excelData[0]);
                            
                            // Map Excel data to your table model structure
                            var tableItems = excelData.map(function(item) {
                                return {
                                    "txtCompanyCode": item["Comp.Code"] || "",
                                    "txtAmountDocCurr": item["Amount Doc.Curr."] || "",
                                    "txtGlAccount": item["G/L account"] || "",
                                    "txtVendorPos": item["Vendor pos."] || "",
                                    "txtCustomerPos": item["Customer pos."] || "",
                                    "txtCostCenter": item["Cost Center"] || "",
                                    "txtAssignmentNumber": item["Assignment Number"] || "",
                                    "txtProfitCenter": item["Profit Center"] || "",
                                    "txtItemText": item["Item Text"] || "",
                                    "validationStatus": "pending" // Set initial validation status
                                };
                            });
                            
                            // Get the table model and update it
                            var oTableModel = that.getView().getModel("oTableModel");
                            oTableModel.setProperty("/items", tableItems);
                            
                            // Update the table title
                            that.getView().byId("tableTitle").setText("Items (" + tableItems.length + ")");
                            
                            MessageToast.show("File uploaded successfully! Loaded " + tableItems.length + " records.");
                            
                        } catch (error) {
                            console.error("Error processing Excel file:", error);
                            MessageToast.show("Error processing the Excel file. See console for details.");
                        }
                    };
                    
                    reader.onerror = function(error) {
                        console.error("FileReader error:", error);
                        MessageToast.show("Error reading the file.");
                    };
                    
                    // Read the file as an ArrayBuffer
                    reader.readAsArrayBuffer(oFile);
                },
                // upload button logic ends
        */
        // --- Excel Upload Logic ---
/*
        onFEUploadItems: function () {
            // var that = this; // 'that' is not used here
            // var oResource = this.getView().getModel("i18n").getResourceBundle(); // Removed if not needed
            var oFileInput = document.createElement('input');
            oFileInput.type = 'file';
            oFileInput.accept = '.xlsx, .xls'; // Accept both formats
            oFileInput.onchange = function (event) {
                var oFile = event.target.files[0];
                if (oFile) {
                    // Check file type again for robustness
                    var sFileName = oFile.name;
                    if (sFileName.toLowerCase().endsWith(".xlsx") || sFileName.toLowerCase().endsWith(".xls")) {
                        this._processExcelFile(oFile);
                    } else {
                        MessageToast.show("Please select a valid Excel file (.xlsx or .xls).");
                    }
                } else {
                    MessageToast.show("No file selected.");
                }
            }.bind(this); // Bind 'this' to ensure controller context is kept
            oFileInput.click(); // Programmatically click the hidden file input
        },
        
        _processExcelFile: function (file) {
            // Check if XLSX is available before processing
            if (typeof XLSX === "undefined") {
                MessageToast.show("XLSX library not loaded. Cannot process Excel file.");
                console.error("XLSX library is undefined.");
                return;
            }

            const reader = new FileReader();
            const that = this; // Keep controller context for use inside reader.onload

            reader.onload = (e) => {
                try {
                    // Use binary string read type as in friend's example
                    const workbook = XLSX.read(e.target.result, { type: 'binary' });
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get first sheet
                    // Use sheet_to_json with defval to handle empty cells gracefully
                    const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                    if (!excelData || excelData.length === 0) {
                        MessageToast.show("No data found in the selected Excel sheet.");
                        return;
                    }

                    // **IMPORTANT**: Adjust Excel column names ("Serial Id", etc.) if they differ in your file
                    const columnMapping = {
                        "Serial Id": "SID",
                        "Seni Name": "Name", // Assuming "Seni Name" maps to "Name"
                        "Plant Organization": "Org" // Assuming "Plant Organization" maps to "Org"
                    };

                    const mappedData = excelData.map(row =>
                        Object.entries(columnMapping).reduce((acc, [excelKey, jsonKey]) => {
                            // Ensure the Excel key exists in the row before assigning
                            acc[jsonKey] = row.hasOwnProperty(excelKey) ? String(row[excelKey]).trim() : ""; // Trim and convert to string
                            return acc;
                        }, {})
                    );

                    console.log("Mapped Data:", mappedData); // Keep for debugging if needed

                    // Get the result model (already set on the view with name "oResultModel")
                    var oResultModel = that.getView().getModel("oResultModel");
                    if (oResultModel) {
                        // Update the data in the model
                        oResultModel.setProperty("/aResults", mappedData);
                        MessageToast.show("File uploaded successfully! " + mappedData.length + " items loaded.");

                        // Rebind the SmartTable to reflect the changes in the JSON model
                        var oSmartTable = that.byId("smartAccountTable");
                        if (oSmartTable) {
                            // oSmartTable.rebindTable();
                        }

                    } else {
                        console.error("oResultModel not found.");
                        MessageToast.show("Error: Could not find table model to update.");
                    }

                } catch (error) {
                    console.error("Error processing Excel file:", error);
                    MessageBox.error("Error processing the Excel file. Please ensure it's a valid format and the structure is correct. Details: " + error.message);
                }
            };

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                MessageToast.show("Error reading the file.");
            };

            // Read as binary string, matching the 'type' in XLSX.read
            reader.readAsBinaryString(file);
        },

        _processExcelFile: function (file) {
            // Check if XLSX is available before processing
            if (typeof XLSX === "undefined") {
                MessageToast.show("XLSX library not loaded. Cannot process Excel file.");
                console.error("XLSX library is undefined.");
                return;
            }

            const reader = new FileReader();
            const that = this; // Keep controller context for use inside reader.onload

            reader.onload = (e) => {
                try {
                    // Convert ArrayBuffer to Uint8Array for XLSX processing
                    const data = new Uint8Array(e.target.result);
                    
                    // Use arraybuffer type instead of binary
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get first sheet
                    // Use sheet_to_json with defval to handle empty cells gracefully
                    const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                    if (!excelData || excelData.length === 0) {
                        MessageToast.show("No data found in the selected Excel sheet.");
                        return;
                    }

                    // Rest of the code remains the same with the column mapping
                    const columnMapping = {
                        "Company Code": "Comp.Code",
                        "Document Currency Amount": "Amount Doc.Curr.",
                        "Local Currency Amount": "Amount Loc.Curr.",
                        "G/L Account": "G/L account",
                        "Vendor Position": "Vendor pos.",
                        "Customer Position": "Customer pos.",
                        "Cost Center": "Cost center",
                        "Order Number": "Order Number",
                        "Assignment Number": "Assignment number",
                        "Item Text": "Item Text",
                        "Profit Center": "Profit Center",
                        "Value Date": "Value Date",
                        "Business Area": "Business area",
                        "Quantity": "Quantity",
                        "Unit": "Unit",
                        "Purchase Order": "Puchase Order",
                        "PO Item Adjustment": "PO Item Adjust",
                        "Trading Partner": "Trad. Partn.",
                        "St. Central Bank Ind.": "St. Centr. bk ind.",
                        "Supplementary Country": "Suppl. Ctry",
                        "Tax Code": "Tax code",
                        "Tax Percentage": "Tax percent.",
                        "Plant": "Plant",
                        "Withholding Tax Code": "Withh.TxCd",
                        "Discount Base": "Disc.base",
                        "Days 1": "Days 1",
                        "Discount 1": "Disc.1",
                        "Baseline Date": "Baseline Date",
                        "Payment Terms": "Payt Terms",
                        "Payment Block": "PaymBlk",
                        "Transaction Type": "Transaction Type",
                        "SGL Indicator": "SGL Ind.",
                        "Payment Method": "Pymt method",
                        "Payment Reference": "Payment Ref.",
                        "Dunning Block": "Dunn. Block",
                        "Business Place": "Business place"
                    };

                    const mappedData = excelData.map(row => {
                        // Create a new object with default values matching the structure
                        const mappedRow = {};
                        
                        // Populate all expected fields with default empty values
                        Object.values(columnMapping).forEach(jsonKey => {
                            mappedRow[jsonKey] = "";
                        });
                        
                        // Fill in values from Excel where they exist
                        Object.entries(columnMapping).forEach(([excelKey, jsonKey]) => {
                            if (row.hasOwnProperty(excelKey)) {
                                // Handle numeric values appropriately
                                if (["Amount Doc.Curr.", "Amount Loc.Curr.", "Quantity", "Tax percent.", "Disc.base", "Days 1", "Disc.1"].includes(jsonKey)) {
                                    mappedRow[jsonKey] = isNaN(parseFloat(row[excelKey])) ? 0 : parseFloat(row[excelKey]);
                                } else {
                                    mappedRow[jsonKey] = String(row[excelKey]).trim();
                                }
                            }
                        });
                        
                        return mappedRow;
                    });

                    console.log("Mapped Data:", mappedData);

                    // Get the result model (already set on the view with name "oResultModel")
                    var oResultModel = that.getView().getModel("oResultModel");
                    if (oResultModel) {
                        // Update the data in the model
                        oResultModel.setProperty("/aResults", mappedData);
                        MessageToast.show("File uploaded successfully! " + mappedData.length + " items loaded.");

                        // Ensure the SmartTable is aware of the model changes
                        var oSmartTable = that.byId("smartAccountTable");
                        if (oSmartTable) {
                            // If there's a specific method for rebinding in your SmartTable implementation
                            // oSmartTable.rebindTable();
                        }
                    } else {
                        console.error("oResultModel not found.");
                        MessageToast.show("Error: Could not find table model to update.");
                    }

                } catch (error) {
                    console.error("Error processing Excel file:", error);
                    MessageBox.error("Error processing the Excel file. Please ensure it's a valid format and the structure is correct. Details: " + error.message);
                }
            };

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                MessageToast.show("Error reading the file.");
            };

            // Use readAsArrayBuffer instead of the deprecated readAsBinaryString
            reader.readAsArrayBuffer(file);
        },
        // --- End of Excel Upload Logic ---
*/
        onFEUploadItems: function () {
            var oFileInput = document.createElement('input');
            oFileInput.type = 'file';
            oFileInput.accept = '.xlsx, .xls'; // Accept both formats
            oFileInput.onchange = function (event) {
                var oFile = event.target.files[0];
                if (oFile) {
                    // Check file type again for robustness
                    var sFileName = oFile.name;
                    if (sFileName.toLowerCase().endsWith(".xlsx") || sFileName.toLowerCase().endsWith(".xls")) {
                        this._processExcelFile(oFile);
                    } else {
                        MessageToast.show("Please select a valid Excel file (.xlsx or .xls).");
                    }
                } else {
                    MessageToast.show("No file selected.");
                }
            }.bind(this); // Bind 'this' to ensure controller context is kept
            oFileInput.click(); // Programmatically click the hidden file input
        },

        _processExcelFile: function (file) {
            // Check if XLSX is available before processing
            if (typeof XLSX === "undefined") {
                MessageToast.show("XLSX library not loaded. Cannot process Excel file.");
                console.error("XLSX library is undefined.");
                return;
            }

            const reader = new FileReader();
            const that = this; // Keep controller context for use inside reader.onload

            reader.onload = (e) => {
                try {
                    // Convert ArrayBuffer to Uint8Array for XLSX processing
                    const data = new Uint8Array(e.target.result);
                    
                    // Use arraybuffer type instead of binary
                    const workbook = XLSX.read(data, { type: 'array' });
                    
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]]; // Get first sheet
                    // Use sheet_to_json with defval to handle empty cells gracefully
                    const excelData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                    if (!excelData || excelData.length === 0) {
                        MessageToast.show("No data found in the selected Excel sheet.");
                        return;
                    }

                    // Updated column mapping to match the financial data structure
                    const columnMapping = {
                        "Company Code": "Comp.Code",
                        "Document Currency Amount": "Amount Doc.Curr.",
                        "Local Currency Amount": "Amount Loc.Curr.",
                        "G/L Account": "G/L account",
                        "Vendor Position": "Vendor pos.",
                        "Customer Position": "Customer pos.",
                        "Cost Center": "Cost center",
                        "Order Number": "Order Number",
                        "Assignment Number": "Assignment number",
                        "Item Text": "Item Text",
                        "Profit Center": "Profit Center",
                        "Value Date": "Value Date",
                        "Business Area": "Business area",
                        "Quantity": "Quantity",
                        "Unit": "Unit",
                        "Purchase Order": "Puchase Order",
                        "PO Item Adjustment": "PO Item Adjust",
                        "Trading Partner": "Trad. Partn.",
                        "St. Central Bank Ind.": "St. Centr. bk ind.",
                        "Supplementary Country": "Suppl. Ctry",
                        "Tax Code": "Tax code",
                        "Tax Percentage": "Tax percent.",
                        "Plant": "Plant",
                        "Withholding Tax Code": "Withh.TxCd",
                        "Discount Base": "Disc.base",
                        "Days 1": "Days 1",
                        "Discount 1": "Disc.1",
                        "Baseline Date": "Baseline Date",
                        "Payment Terms": "Payt Terms",
                        "Payment Block": "PaymBlk",
                        "Transaction Type": "Transaction Type",
                        "SGL Indicator": "SGL Ind.",
                        "Payment Method": "Pymt method",
                        "Payment Reference": "Payment Ref.",
                        "Dunning Block": "Dunn. Block",
                        "Business Place": "Business place"
                    };

                    // Define numeric fields for proper type conversion
                    const numericFields = [
                        "Amount Doc.Curr.", 
                        "Amount Loc.Curr.", 
                        "Quantity", 
                        "Tax percent.", 
                        "Disc.base", 
                        "Days 1", 
                        "Disc.1"
                    ];

                    const mappedData = excelData.map(row => {
                        // Create a new object with default values matching the structure
                        const mappedRow = {};
                        
                        // Initialize all expected fields with appropriate default values
                        Object.values(columnMapping).forEach(jsonKey => {
                            if (numericFields.includes(jsonKey)) {
                                mappedRow[jsonKey] = 0; // Default numeric fields to 0
                            } else {
                                mappedRow[jsonKey] = ""; // Default string fields to empty string
                            }
                        });
                        
                        // Fill in values from Excel where they exist
                        Object.entries(columnMapping).forEach(([excelKey, jsonKey]) => {
                            if (row.hasOwnProperty(excelKey)) {
                                if (numericFields.includes(jsonKey)) {
                                    // Parse numeric values
                                    mappedRow[jsonKey] = isNaN(parseFloat(row[excelKey])) ? 0 : parseFloat(row[excelKey]);
                                } else {
                                    // Ensure string values
                                    mappedRow[jsonKey] = String(row[excelKey]).trim();
                                }
                            }
                        });
                        
                        return mappedRow;
                    });

                    console.log("Mapped Data:", mappedData);

                    // Get the result model (already set on the view with name "oResultModel")
                    var oResultModel = that.getView().getModel("oResultModel");
                    if (oResultModel) {
                        // Update the data in the model
                        oResultModel.setProperty("/aResults", mappedData);
                        MessageToast.show("File uploaded successfully! " + mappedData.length + " items loaded.");

                        // Rebind the SmartTable to ensure data is displayed properly
                        var oSmartTable = that.byId("smartAccountTable");
                        if (oSmartTable) {
                            // Since this is a SmartTable, we can use the rebindTable method or refresh the model
                            if (oSmartTable.rebindTable) {
                                oSmartTable.rebindTable();
                            }
                        }
                    } else {
                        console.error("oResultModel not found.");
                        MessageToast.show("Error: Could not find table model to update.");
                    }

                } catch (error) {
                    console.error("Error processing Excel file:", error);
                    MessageBox.error("Error processing the Excel file. Please ensure it's a valid format and the structure is correct. Details: " + error.message);
                }
            };

            reader.onerror = (error) => {
                console.error("FileReader error:", error);
                MessageToast.show("Error reading the file.");
            };

            // Use readAsArrayBuffer instead of the deprecated readAsBinaryString
            reader.readAsArrayBuffer(file);
        },
/*
        // delete button logic starts
        onDelete: function () {
            var oTable = this.byId("accountTable");
            var aSelectedItems = oTable.getSelectedItems();
            var oModel = this.getView().getModel("oTableModel");
            var aItems = oModel.getProperty("/items");

            if (aSelectedItems.length === 0) {
                sap.m.MessageToast.show("Please select at least one row to delete.");
                return;
            }

            // Get the indices of the selected items
            var aSelectedIndices = [];
            aSelectedItems.forEach(function (oSelectedItem) {
                var iIndex = oTable.indexOfItem(oSelectedItem);
                if (iIndex !== -1) {
                    aSelectedIndices.push(iIndex);
                }
            });

            // Create a new array without the selected rows
            var aNewItems = aItems.filter(function (item, index) {
                return aSelectedIndices.indexOf(index) === -1;
            });

            // Update the model
            oModel.setProperty("/items", aNewItems);

            // Clear selections
            oTable.removeSelections();

            sap.m.MessageToast.show("Selected row(s) deleted.");
        },
        // delete button logic ends
*/
        // delete button logic starts
        onDelete: function () {
            // Get the inner UI Table from the SmartTable
            var oSmartTable = this.byId("smartAccountTable");
            var oTable = oSmartTable.getTable();
            
            // Get selected indices from the UI Table
            var aSelectedIndices = oTable.getSelectedIndices();
            
            if (aSelectedIndices.length === 0) {
                MessageToast.show("Please select at least one row to delete.");
                return;
            }
            
            // Get current data from the model
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            
            // Sort indices in descending order to avoid shifting issues when removing items
            aSelectedIndices.sort(function(a, b) {
                return b - a; // Descending order
            });
            
            // Remove selected items from the array
            aSelectedIndices.forEach(function(iIndex) {
                if (iIndex >= 0 && iIndex < aItems.length) {
                    aItems.splice(iIndex, 1);
                }
            });
            
            // Update the model with the modified array
            oResultModel.setProperty("/aResults", aItems);
            
            // Clear selections
            oTable.clearSelection();
            
            // Show success message
            MessageToast.show("Selected row(s) deleted.");
            
            // Refresh the table binding
            oTable.getBinding().refresh(true);
        },
        // delete button logic ends
/*
        // Clear filters button
        onClearFilters: function() {
            var oSmartTable = this.byId("smartAccountTable");
            if (oSmartTable) {
                oSmartTable.getTable().clearSelection();
                oSmartTable.rebindTable();
                sap.m.MessageToast.show("All filters cleared");
            }
        },
*/
/*
        // Clear filters button logic starts here
        onClearFilters: function() {
            // 1. Clear all SimpleForm fields
            // Get all input fields from the SimpleForm
            var oCompanyCode = this.byId("inputCompanyCode");
            var oDocumentDate = this.byId("inputDocumentDate");
            var oPostingDate = this.byId("inputPostingDate");
            var oPostingPeriod = this.byId("inputPostingPeriod");
            var oFiscalYear = this.byId("inputFiscalYear");
            var oCurrency = this.byId("inputCurrency");
            var oHeaderText = this.byId("inputHeaderText");
            var oReference = this.byId("inputReference");
            
            // Reset all field values
            oCompanyCode.setValue("");
            oDocumentDate.setValue("");
            oPostingDate.setValue("");
            oPostingPeriod.setValue("");
            oFiscalYear.setValue("");
            oCurrency.setValue("");
            oHeaderText.setValue("");
            oReference.setValue("");
            
            // Reset validation states if any
            oCompanyCode.setValueState("None");
            oDocumentDate.setValueState("None");
            oPostingDate.setValueState("None");
            oPostingPeriod.setValueState("None");
            oFiscalYear.setValueState("None");
            oCurrency.setValueState("None");
            
            // 2. Clear SmartTable filters
            var oSmartTable = this.byId("smartAccountTable");
            if (oSmartTable) {
                // Clear table selections
                oSmartTable.getTable().clearSelection();
                
                // Reset variant to standard
                if (oSmartTable.getVariant) {
                    var oVariant = oSmartTable.getVariant();
                    if (oVariant) {
                        oSmartTable.setCurrentVariantId("Standard");
                    }
                }
                
                // Clear any personalization settings
                if (oSmartTable.getPersonalizer) {
                    var oPersonalizer = oSmartTable.getPersonalizer();
                    if (oPersonalizer) {
                        oPersonalizer.resetPersonalization();
                    }
                }
                
                // Reset filters in the SmartFilterBar if connected
                var oSmartFilterBar = oSmartTable.getSmartFilterBar();
                if (oSmartFilterBar) {
                    oSmartFilterBar.clear();
                }
                
                // Clear any UI filters directly on the inner table
                var oTable = oSmartTable.getTable();
                if (oTable) {
                    var aColumns = oTable.getColumns();
                    aColumns.forEach(function(oColumn) {
                        oColumn.setFiltered(false);
                        oColumn.setFilterValue("");
                        oColumn.setSorted(false);
                    });
                }
                
                // Refresh the table data
                oSmartTable.rebindTable();
                
                // Show success message
                MessageToast.show("All filters and form fields cleared");
            }
        },
        // Clear filters button logic ends here
*/
        // Clear filters button
        onClearFilters: function() {
            // 1. Clear all SimpleForm fields
            var oCompanyCode = this.byId("inputCompanyCode");
            var oDocumentDate = this.byId("inputDocumentDate");
            var oPostingDate = this.byId("inputPostingDate");
            var oPostingPeriod = this.byId("inputPostingPeriod");
            var oFiscalYear = this.byId("inputFiscalYear");
            var oCurrency = this.byId("inputCurrency");
            var oHeaderText = this.byId("inputHeaderText");
            var oReference = this.byId("inputReference");
            
            // Reset all field values
            oCompanyCode.setValue("");
            oDocumentDate.setValue("");
            oPostingDate.setValue("");
            oPostingPeriod.setValue("");
            oFiscalYear.setValue("");
            oCurrency.setValue("");
            oHeaderText.setValue("");
            oReference.setValue("");
            
            // Reset validation states
            oCompanyCode.setValueState("None");
            oDocumentDate.setValueState("None");
            oPostingDate.setValueState("None");
            oPostingPeriod.setValueState("None");
            oFiscalYear.setValueState("None");
            oCurrency.setValueState("None");
            
            // 2. Clear SmartTable filters and sorting
            var oSmartTable = this.byId("smartAccountTable");
            if (oSmartTable) {
                // Clear table selections
                var oTable = oSmartTable.getTable();
                oTable.clearSelection();
                
                // Clear UI Table sorting - this is the key part to fix sorting
                if (oTable && oTable.getBinding("rows")) {
                    // Force remove all sorters from binding
                    oTable.getBinding("rows").sort([]);
                    
                    // Reset sort indicators on columns
                    var aColumns = oTable.getColumns();
                    aColumns.forEach(function(oColumn) {
                        oColumn.setSorted(false);
                        oColumn.setSortOrder("Ascending");
                    });
                }
                
                // Reset filters on columns if any
                if (oTable && oTable.getColumns) {
                    var aColumns = oTable.getColumns();
                    aColumns.forEach(function(oColumn) {
                        oColumn.setFiltered(false);
                        oColumn.setFilterValue("");
                    });
                }
                
                // Reset personalization dialog settings if possible
                if (oSmartTable.getPersoController) {
                    var oPersoController = oSmartTable.getPersoController();
                    if (oPersoController && oPersoController.resetPersData) {
                        oPersoController.resetPersData();
                    }
                }
                
                // Force rebind without personalization
                oSmartTable.rebindTable(true);
                
                MessageToast.show("All filters and form fields cleared");
            }
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