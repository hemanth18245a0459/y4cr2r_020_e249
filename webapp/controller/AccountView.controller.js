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
    "sap/m/CheckBox",
    "sap/m/MessagePopover",
	"sap/m/MessageItem",
	"sap/m/Link",
    "sap/ui/core/library"
], function (Controller, JSONModel, MessageToast, Fragment, Filter, FilterOperator, Currency, MessageBox, P13nColumnsPanel, CheckBox, MessagePopover, MessageItem, Link, coreLibrary ) {
    "use strict";

    // Get MessageType enum from the core library
    var MessageType = coreLibrary.MessageType;

    // var XLSX = window.XLSX;

    return Controller.extend("y4cr2r020e249.controller.AccountView", {

        // --- Add a formatter for MessageType ---
        messageTypeFormatter: function(sMsgTypeString) {
            switch (sMsgTypeString) {
                case "Error":       return MessageType.Error;
                case "Warning":     return MessageType.Warning;
                case "Success":     return MessageType.Success;
                case "Information": return MessageType.Information;
                default:            return MessageType.None; // Or Information/Warning as default
            }
        },

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
            this.getView().byId("smartAccountTable").setModel(this.getView().getModel("oResultModel"));

            // --- Initialize Message Model ---
            var oMessageModel = new JSONModel([]);
            this.getView().setModel(oMessageModel, "messageModel");
            // --------------------------------

            // --- Create Message Popover programmatically ---
            var oMessageTemplate = new MessageItem({
                // Use the new formatter for the 'type' property
				type: {
                    path: 'messageModel>type',
                    formatter: this.messageTypeFormatter // <<< Use formatter
                },
				title: '{messageModel>title}',
				description: '{messageModel>description}'
                // subtitle: '{messageModel>subtitle}',
				// counter: '{messageModel>counter}'
			});

            // Create and store the popover instance on the controller instance ('this')
            this._oMessagePopover = new MessagePopover({ // <<< Use this._oMessagePopover
				items: {
					path: 'messageModel>/',
					template: oMessageTemplate
				}
			});

            // Add the popover as a dependent to the button
            this.byId("messagePopoverBtn").addDependent(this._oMessagePopover); // <<< Use this._oMessagePopover
            // ---------------------------------------------

            // Check if XLSX is globally available
            if (typeof XLSX === "undefined") {
                console.error("XLSX library not loaded. Check your index.html file.");
            };

            // Initialize validation status for all items
            this._initializeValidationStatus();

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
        },

        /*
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
*/
        _initializeValidationStatus: function() {
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            
            if (aItems && aItems.length > 0) {
                // Use map to create a new array with validation status
                var updatedItems = aItems.map(function(oItem) {
                    if (!oItem.hasOwnProperty("validationStatus")) {
                        oItem.validationStatus = "pending";
                    }
                    return oItem;
                });
                
                oResultModel.setProperty("/aResults", updatedItems);
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

        // --- Helper function to add messages (No change needed here) ---
        _addMessage: function (sType, sTitle, sDescription) {
            var oMessageModel = this.getView().getModel("messageModel");
            var aMessages = oMessageModel.getData(); // Get the array reference
            aMessages.push({
                type: sType, // Store as string (e.g., "Error", "Information")
                title: sTitle,
                description: sDescription
            });
            oMessageModel.refresh(true); // Refresh bindings
        },
        // ------------------------------------

        // --- Formatter Functions for the Button ---

        // Determines button icon based on highest severity message
        buttonIconFormatter: function (aMessages) {
            var sIcon = "sap-icon://message-popup"; // Default icon
            if (!aMessages || aMessages.length === 0) {
                return sIcon;
            }

            aMessages.forEach(function (sMessage) {
				switch (sMessage.type) {
					case "Error": // MessageType.Error
						sIcon = "sap-icon://error";
						break;
					case "Warning": // MessageType.Warning
						sIcon = sIcon !== "sap-icon://error" ? "sap-icon://alert" : sIcon;
						break;
					case "Success": // MessageType.Success
						sIcon = sIcon !== "sap-icon://error" && sIcon !== "sap-icon://alert" ? "sap-icon://sys-enter-2" : sIcon;
						break;
					default: // MessageType.Information or others
						sIcon = (sIcon !== "sap-icon://error" && sIcon !== "sap-icon://alert" && sIcon !== "sap-icon://sys-enter-2") ? "sap-icon://information" : sIcon;
						break;
				}
			});
            return sIcon;
        },

        // Determines button type (color) based on highest severity message
        buttonTypeFormatter: function (aMessages) {
            var sHighestSeverityType = "Default"; // Default type
             if (!aMessages || aMessages.length === 0) {
                return sHighestSeverityType;
            }

            aMessages.forEach(function (sMessage) {
				switch (sMessage.type) {
                    case "Error": // MessageType.Error
						sHighestSeverityType = "Negative";
						break;
					case "Warning": // MessageType.Warning
						sHighestSeverityType = sHighestSeverityType !== "Negative" ? "Critical" : sHighestSeverityType;
						break;
					case "Success": // MessageType.Success
						sHighestSeverityType = sHighestSeverityType !== "Negative" && sHighestSeverityType !== "Critical" ?  "Success" : sHighestSeverityType;
						break;
					default: // MessageType.Information or others
						sHighestSeverityType = (sHighestSeverityType !== "Negative" && sHighestSeverityType !== "Critical" && sHighestSeverityType !== "Success") ? "Neutral" : sHighestSeverityType;
						break;
				}
			});
            return sHighestSeverityType;
        },

        // Returns the total number of messages
        totalMessageCountFormatter: function (aMessages) {
            if (!aMessages) {
                return 0;
            }
            return aMessages.length; // Return the total count
        },

        // ------------------------------------

        // --- Handler for the message button press (FIXED) ---
        handleMessagePopoverPress: function (oEvent) {
            // Access the popover instance stored on the controller
            if (this._oMessagePopover) { // <<< Use this._oMessagePopover
			    this._oMessagePopover.toggle(oEvent.getSource()); // <<< Use this._oMessagePopover
            } else {
                 this._addMessage("Error", "Error", "Message Popover not initialized correctly.");
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
                        this._addMessage("Error", "Configuration Error", "OData Model not available for Company Code lookup.");
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

        // Document Type (NEW)
        onDocumentTypeValueHelpRequest: function(oEvent) {
            var oView = this.getView();
            this._oValueHelpSource = oEvent.getSource(); // Store the input field

            if (!this._pDocTypeDialog) {
                this._pDocTypeDialog = Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.DocumentTypeDialog", // New fragment name
                    controller: this
                }).then(function (oDialog){
                    oView.addDependent(oDialog);
                     // Assign the default OData model (ensure it's configured in manifest)
                    oDialog.setModel(oView.getModel("oModel")); // Assumes default OData model name
                    return oDialog;
                });
            }
            this._pDocTypeDialog.then(function(oDialog){
                oDialog.getBinding("items").filter([]); // Clear previous filters
                oDialog.open();
            }.bind(this));
        },

        onDocumentTypehandleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value") || "";
            var oBinding = oEvent.getParameter("itemsBinding"); // Get binding from event parameter
             if (!sValue) {
                oBinding.filter([]);
            } else {
                // Filter on Shipper CompanyName or ShipperID
                var oFilter = new Filter({
                    filters: [
                        new Filter("CompanyName", FilterOperator.Contains, sValue),
                        // new Filter("ShipperID", FilterOperator.EQ, sValue) // Use EQ for ID if needed
                    ],
                    and: false // OR condition
                });
                oBinding.filter([oFilter]);
            }
        },

        onDocumentTypehandleClose: function(oEvent) {
            var oSelectedItem = oEvent.getParameter("selectedItem");
            var oSourceInput = this._oValueHelpSource; // Use the stored source input

            if (oSelectedItem && oSourceInput) {
                // Assuming title is CompanyName, description is ShipperID
                // Set the input field value - choose title or description as needed
                var sSelectedValue = oSelectedItem.getTitle(); // Example: using ShipperID
                oSourceInput.setValue(sSelectedValue);
            }
             this._oValueHelpSource = null; // Clear the stored input field
        },

         // Document Number (NEW)
        onDocumentNumberValueHelpRequest: function(oEvent) {
            var oView = this.getView();
            this._oValueHelpSource = oEvent.getSource(); // Store the input field

            if (!this._pDocNumDialog) {
                this._pDocNumDialog = Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.DocumentNumberDialog", // New fragment name
                    controller: this
                }).then(function (oDialog){
                    oView.addDependent(oDialog);
                     // Assign the default OData model
                    oDialog.setModel(oView.getModel("oModel")); // Assumes default OData model name
                    return oDialog;
                });
            }
            this._pDocNumDialog.then(function(oDialog){
                 oDialog.getBinding("items").filter([]); // Clear previous filters
                oDialog.open();
            }.bind(this));
        },

        onDocumentNumberhandleSearch: function (oEvent) {
            var sValue = oEvent.getParameter("value") || "";
            var oBinding = oEvent.getParameter("itemsBinding");
             if (!sValue) {
                oBinding.filter([]);
            } else {
                 // Filter on ProductName or ProductID
                var oFilter = new Filter({
                    filters: [
                        new Filter("OrderID", FilterOperator.Contains, sValue),
                        // new Filter("ProductID", FilterOperator.EQ, sValue) // Use EQ for ID if needed
                    ],
                    and: false // OR condition
                });
                oBinding.filter([oFilter]);
            }
        },

        onDocumentNumberhandleClose: function(oEvent) {
             var oSelectedItem = oEvent.getParameter("selectedItem");
            var oSourceInput = this._oValueHelpSource; // Use the stored source input

            if (oSelectedItem && oSourceInput) {
                 // Assuming title is ProductName, description is ProductID
                // Set the input field value - choose title or description as needed
                var sSelectedValue = oSelectedItem.getTitle(); // Example: using ProductID
                oSourceInput.setValue(sSelectedValue);
            }
            this._oValueHelpSource = null; // Clear the stored input field
        },

        /*
        // Updated Simulation button logic starts here
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
*/
        onSimulation: function() {
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            var errorRows = [];
            
            // Use map to create a new array with updated validation status
            var updatedItems = aItems.map(function(oItem, index) {
                // Validation check - ensure company code and amount are provided
                var isValid = oItem["Comp.Code"] && 
                            oItem["Amount Doc.Curr."] && 
                            !isNaN(parseFloat(oItem["Amount Doc.Curr."]));
                
                // Update validation status
                oItem.validationStatus = isValid ? "valid" : "invalid";
                
                if (!isValid) {
                    errorRows.push(index + 1);
                }
                
                return oItem;
            });
            
            // Update the model with modified items
            oResultModel.setProperty("/aResults", updatedItems);
            oResultModel.refresh(true);
            
            // Show error message if needed
            if (errorRows.length > 0) {
                MessageBox.error("Missing mandatory fields in rows: " + errorRows.join(", "));
            } else {
                MessageToast.show("Simulation completed successfully.");
            }
        },

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
                this._addMessage("Error", "Add Row", "Please fill all mandatory fields");
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
            this._addMessage("Information", "New Row Added", "New row has been added to the table");
        },
        // Add button logic ends

        // Updated Download Template button logic starts
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
        //Download Template button logic ends
        
        // Updated upload button logic starts
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
        // Excel upload button logic starts
/*
        // Updated delete button logic starts
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
        */
        
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
            
            // Create a lookup set of selected indices for faster checking
            var selectedIndexSet = new Set(aSelectedIndices);
            
            // Filter out the selected rows - keeping only unselected rows
            var filteredItems = aItems.filter(function(item, index) {
                return !selectedIndexSet.has(index);
            });
            
            // Update the model with the filtered array
            oResultModel.setProperty("/aResults", filteredItems);
            
            // Clear selections
            oTable.clearSelection();
            
            // Show success message
            MessageToast.show("Selected row(s) deleted.");
            
            // Refresh the table binding
            oTable.getBinding().refresh(true);
        },

        /*
        // Updated Clear filters button logic starts here
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
        // Updated Clear filters button logic ends here
        */

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
                
                // Clear UI Table sorting - use map for cleaner transform
                if (oTable && oTable.getBinding("rows")) {
                    // Force remove all sorters from binding
                    oTable.getBinding("rows").sort([]);
                    
                    // Reset sort indicators on columns with map
                    var aColumns = oTable.getColumns();
                    aColumns.map(function(oColumn) {
                        oColumn.setSorted(false);
                        oColumn.setSortOrder("Ascending");
                        return oColumn;
                    });
                }
                
                // Reset filters on columns if any
                if (oTable && oTable.getColumns) {
                    var aColumns = oTable.getColumns();
                    // Use map for cleaner transform
                    aColumns.map(function(oColumn) {
                        oColumn.setFiltered(false);
                        oColumn.setFilterValue("");
                        return oColumn;
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

        /*
        // Post Button logic starts here
        onPost: function() {
            // Get date values from form fields
            var oDocDatePicker = this.byId("inputDocumentDate");
            var oPostDatePicker = this.byId("inputPostingDate");
            var oPostPeriodPicker = this.byId("inputPostingPeriod");
            var oFiscalYearPicker = this.byId("inputFiscalYear");
            
            // Convert DatePicker values to strings for logging
            var docDateValue = oDocDatePicker.getDateValue() ? 
                oDocDatePicker.getDateValue().toLocaleDateString() : "Not set";
            
            var postDateValue = oPostDatePicker.getDateValue() ? 
                oPostDatePicker.getDateValue().toLocaleDateString() : "Not set";
            
            var postPeriodValue = oPostPeriodPicker.getDateValue() ? 
                oPostPeriodPicker.getDateValue().toLocaleDateString() : "Not set";
            
            var fiscalYearValue = oFiscalYearPicker.getValue() || "Not set";
            
            // Log all date values
            console.log("Document Date:", docDateValue);
            console.log("Posting Date:", postDateValue);
            console.log("Posting Period:", postPeriodValue);
            console.log("Fiscal Year:", fiscalYearValue);
            
            // Get data from the table to prepare for posting
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            
            // Count valid and invalid items
            var validItems = aItems.filter(function(item) {
                return item.validationStatus === "valid";
            }).length;
            
            var pendingItems = aItems.filter(function(item) {
                return item.validationStatus === "pending";
            }).length;
            
            var invalidItems = aItems.filter(function(item) {
                return item.validationStatus === "invalid";
            }).length;
            
            console.log("Items Summary - Valid:", validItems, 
                        "Pending:", pendingItems, 
                        "Invalid:", invalidItems);
            
            // Show message based on validation status
            if (invalidItems > 0) {
                MessageBox.error("Cannot post - " + invalidItems + " items have validation errors.");
            } else if (pendingItems > 0) {
                MessageBox.warning("Some items have not been validated. Please run simulation first.");
            } else if (validItems > 0) {
                MessageToast.show("Posting successful for " + validItems + " items.");
            } else {
                MessageToast.show("No items to post. Please add line items.");
            }
        },
        // Post button logic ends here
        */

        onPost: function() {
            // Create a date formatter that uses UTC
            var oDateFormat = sap.ui.core.format.DateFormat.getDateInstance({
                pattern: "yyyy-MM-dd",
                UTC: true
            });
            
            // Get date controls from form
            var oDocDatePicker = this.byId("inputDocumentDate");
            var oPostDatePicker = this.byId("inputPostingDate");
            var oPostPeriodPicker = this.byId("inputPostingPeriod");
            var oFiscalYearPicker = this.byId("inputFiscalYear");
            
            
            // Function to safely format dates using UTC
            function formatDateSafely(dateControl) {
                if (!dateControl || !dateControl.getDateValue()) {
                    return "Not set";
                }
                
                var oDate = dateControl.getDateValue();
                // Use the UTC formatter to get consistent dates
                return oDateFormat.format(oDate);
            }
            
            // Get formatted dates
            var docDateFormatted = formatDateSafely(oDocDatePicker);
            var postDateFormatted = formatDateSafely(oPostDatePicker);
            var postPeriodFormatted = formatDateSafely(oPostPeriodPicker);
            var fiscalYearValue = oFiscalYearPicker.getValue() || "Not set";
            
            // Log the values
            console.log("Document Date (UTC):", docDateFormatted);
            console.log("Posting Date (UTC):", postDateFormatted);
            console.log("Posting Period (UTC):", postPeriodFormatted);
            console.log("Fiscal Year:", fiscalYearValue);
            
            
            // Get data from the table to prepare for posting
            var oResultModel = this.getView().getModel("oResultModel");
            var aItems = oResultModel.getProperty("/aResults");
            
            // Count valid and invalid items
            var validItems = aItems.filter(function(item) {
                return item.validationStatus === "valid";
            }).length;
            
            var pendingItems = aItems.filter(function(item) {
                return item.validationStatus === "pending";
            }).length;
            
            var invalidItems = aItems.filter(function(item) {
                return item.validationStatus === "invalid";
            }).length;
            
            console.log("Items Summary - Valid:", validItems, 
                        "Pending:", pendingItems, 
                        "Invalid:", invalidItems);
            
            // Show message based on validation status
            if (invalidItems > 0) {
                MessageBox.error("Cannot post - " + invalidItems + " items have validation errors.");
            } else if (pendingItems > 0) {
                MessageBox.warning("Some items have not been validated. Please run simulation first.");
            } else if (validItems > 0) {
                MessageToast.show("Posting successful for " + validItems + " items.");
            } else {
                MessageToast.show("No items to post. Please add line items.");
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