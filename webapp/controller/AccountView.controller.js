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
            
            // Check if XLSX is globally available
            if (typeof XLSX === "undefined") {
                console.error("XLSX library not loaded. Check your index.html file.");
            };

            // Attach ONE handler to the entire table
            // var oTable = this.byId("accountTable");
            // oTable.attachCellClick(this.onTableCellClick, this);

            this._oRouter = sap.ui.core.UIComponent.getRouterFor(this);
            this._oRouter.attachRouteMatched(this._handleRouteMatched, this);
            // Define the mapping between Excel column names and model property names
            this.columnMapping = {
                "Comp.Code": "txtCompanyCode",
                "Company Code": "txtCompanyCode",
                "companyCode": "txtCompanyCode",
                
                "Amount Doc.Curr.": "txtAmountDocCurr",
                "Amount": "txtAmountDocCurr",
                "amountDocCurr": "txtAmountDocCurr",
                
                "G/L account": "txtGlAccount",
                "GL Account": "txtGlAccount",
                "glAccount": "txtGlAccount",
                
                "Vendor pos.": "txtVendorPos",
                "Vendor": "txtVendorPos",
                "vendorPos": "txtVendorPos",
                
                "Customer pos.": "txtCustomerPos",
                "Customer": "txtCustomerPos",
                "customerPos": "txtCustomerPos",
                
                "Cost Center": "txtCostCenter",
                "costCenter": "txtCostCenter",
                
                "Assignment Number": "txtAssignmentNumber",
                "Assignment": "txtAssignmentNumber",
                "assignmentNumber": "txtAssignmentNumber",
                
                "Profit Center": "txtProfitCenter",
                "profitCenter": "txtProfitCenter",
                
                "Item Text": "txtItemText",
                "Text": "txtItemText",
                "itemText": "txtItemText",
                
                "Order Number": "txtOrderNumber",
                "Order": "txtOrderNumber",
                "orderNumber": "txtOrderNumber",
                
                "Amount Loc.Curr.": "txtAmountLocCurr",
                "Local Amount": "txtAmountLocCurr",
                "amountLocCurr": "txtAmountLocCurr"
            };
            
            // Define the column IDs in the view that correspond to model properties
            this.columnIdMapping = {
                "txtCompanyCode": "colCompanyCode",
                "txtAmountDocCurr": "colAmountDocCurr",
                "txtGlAccount": "colGlAccount",
                "txtVendorPos": "colVendorPos",
                "txtCustomerPos": "colCustomerPos",
                "txtCostCenter": "colCostCenter",
                "txtAssignmentNumber": "colAssignmentNumber",
                "txtProfitCenter": "colProfitCenter",
                "txtItemText": "colItemText",
                "txtOrderNumber": "colOrderNumber",
                "txtAmountLocCurr": "colAmountLocCurr"
            };
            
            // Always show status column
            this.byId("colStatus").setVisible(true);
        },

        _handleRouteMatched: function (oEvent) {
            var that = this;
            // oEvent.getParameters().arguments.TableIndex
            var oParameters = oEvent.getParameters();
            if (oParameters.name === 'RouteAccountView') {
                this.onReadData();
                this._resetTableColumnsVisibility();

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

        onView2: function (oEvent) {
            var that = this;
            this._oRouter.navTo("AccountView2");
        },



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

        onCompanyCodeValueHelpRequest: function(oEvent) {
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
                    success: function(oData) {
                        sap.ui.core.BusyIndicator.hide();
                        oTableModel.setProperty("/aCompanyCode", oData.results);
                        that._oCompCodeDialog.open();
                    },
                    error: function(oError) {
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
/*
        // Simulation button logic starts here
        onSimulation: function() {
            var aItems = this.getView().getModel("oTableModel").getProperty("/items");
            let errorRows = [];
            
            aItems.forEach((oItem, index) => {
                // var isValid = oItem.txtCompanyCode &&  oItem.txtAmountDocCurr && !isNaN(oItem.txtAmountDocCurr);
                var isValid = oItem.txtCompanyCode &&  oItem.txtAmountDocCurr;
                
                oItem.validationStatus = isValid ? "valid" : "invalid";
                if (!isValid) errorRows.push(index + 1);
            });
            
            this.getView().getModel("oTableModel").refresh();
            
            if (errorRows.length > 0) {
                MessageBox.error(`Missing mandatory fields in rows: ${errorRows.join(", ")}`);
            }
        },
        // Simulation button logic ends here

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
        // Add button logic ends

        // Implement template download function
        onDownloadTemplate: function() {
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
        
        // delete button logic starts
        onDelete: function() {
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
            aSelectedItems.forEach(function(oSelectedItem) {
                var iIndex = oTable.indexOfItem(oSelectedItem);
                if (iIndex !== -1) {
                    aSelectedIndices.push(iIndex);
                }
            });
        
            // Create a new array without the selected rows
            var aNewItems = aItems.filter(function(item, index) {
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
        

/*// Helper method to reset all table columns to invisible
        _resetTableColumnsVisibility: function() {
            for (var property in this.columnIdMapping) {
                var columnId = this.columnIdMapping[property];
                var oColumn = this.byId(columnId);
                if (oColumn) {
                    oColumn.setVisible(false);
                }
            }
            // Always show status column
            this.byId("colStatus").setVisible(true);
        },
        
        // Helper method to show only columns that match Excel data
        _showRelevantColumns: function(excelHeaders) {
            // First reset all columns
            this._resetTableColumnsVisibility();
            
            // Track which model properties we need
            var usedProperties = [];
            
            // Map Excel headers to model properties and collect used properties
            excelHeaders.forEach(function(header) {
                var modelProperty = this.columnMapping[header];
                if (modelProperty) {
                    usedProperties.push(modelProperty);
                }
            }, this);
            
            // Make columns visible for used properties
            usedProperties.forEach(function(property) {
                var columnId = this.columnIdMapping[property];
                if (columnId) {
                    var oColumn = this.byId(columnId);
                    if (oColumn) {
                        oColumn.setVisible(true);
                    }
                }
            }, this);
            
            // Always show status column
            this.byId("colStatus").setVisible(true);
        },
        // // Helper method to show only columns that match Excel data
        // _showRelevantColumns: function(excelHeaders) {
        //     // First reset all columns to invisible
        //     this._resetTableColumnsVisibility();
            
        //     // Loop through Excel headers and make corresponding columns visible
        //     excelHeaders.forEach(function(header) {
        //         var modelProperty = this.columnMapping[header];
        //         if (modelProperty) {
        //             var columnId = this.columnIdMapping[modelProperty];
        //             if (columnId) {
        //                 var oColumn = this.byId(columnId);
        //                 if (oColumn) {
        //                     oColumn.setVisible(true);
        //                 }
        //             }
        //         }
        //     }, this);
            
        //     // Always show status column
        //     this.byId("colStatus").setVisible(true);
        // },

        // Simulation button logic 
        onSimulation: function() {
            var aItems = this.getView().getModel("oTableModel").getProperty("/items");
            let errorRows = [];
            
            aItems.forEach((oItem, index) => {
                // var isValid = oItem.txtCompanyCode &&  oItem.txtAmountDocCurr && !isNaN(oItem.txtAmountDocCurr);
                var isValid = oItem.txtCompanyCode &&  oItem.txtAmountDocCurr;
                
                oItem.validationStatus = isValid ? "valid" : "invalid";
                if (!isValid) errorRows.push(index + 1);
            });
            
            this.getView().getModel("oTableModel").refresh();
            
            if (errorRows.length > 0) {
                MessageBox.error(`Missing mandatory fields in rows: ${errorRows.join(", ")}`);
            }
        },

        // Add button logic
        onAdd: function () {
            // Create empty object with properties for all columns
            var obj = {
                "txtCompanyCode": "",
                "txtAmountDocCurr": "",
                "txtGlAccount": "",
                "txtVendorPos": "",
                "txtCustomerPos": "",
                "txtCostCenter": "",
                "txtAssignmentNumber": "",
                "txtProfitCenter": "",
                "txtItemText": "",
                "txtOrderNumber": "",
                "txtAmountLocCurr": "",
                "validationStatus": "pending"
            };

            this.getView().getModel("oTableModel").getData().items.unshift(obj);
            this.getView().getModel("oTableModel").updateBindings();
        },

        // Implement template download function
        onDownloadTemplate: function() {
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
                    "Item Text": "",
                    "Order Number": "",
                    "Amount Loc.Curr.": ""
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

        // Upload file change handler
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
                    
                    // First get the data with headers to identify column names
                    var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                    
                    if (excelData.length === 0) {
                        MessageToast.show("No data found in the Excel file.");
                        return;
                    }
                    
                    console.log(excelData);
                    console.log("First row of Excel data:", excelData[0]);
                    
                    // Extract headers from the first object's keys
                    var headers = Object.keys(excelData[0]);
                    
                    // Show only columns that match Excel headers
                    that._showRelevantColumns(headers);
                    
                    // Map Excel data to model properties based on headers
                    var tableItems = excelData.map(function(row) {
                        var item = {
                            "validationStatus": "pending" // Default status
                        };
                        
                        // Initialize all properties as empty strings
                        for (var prop in that.columnIdMapping) {
                            item[prop] = "";
                        }
                        
                        // Map Excel values to corresponding model properties
                        headers.forEach(function(header) {
                            var modelProp = that.columnMapping[header];
                            
                            if (modelProp && row[header] !== undefined) {
                                item[modelProp] = row[header].toString();
                            }
                        });
                        
                        return item;
                    });
                    
                    // Get the table model and update it
                    var oTableModel = that.getView().getModel("oTableModel");
                    oTableModel.setProperty("/items", tableItems);
                    
                    // Update the table title if element exists
                    var oTitle = that.getView().byId("tableTitle");
                    if (oTitle) {
                        oTitle.setText("Items (" + tableItems.length + ")");
                    }
                    
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
        
        // Delete button logic
        onDelete: function() {
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
            aSelectedItems.forEach(function(oSelectedItem) {
                var iIndex = oTable.indexOfItem(oSelectedItem);
                if (iIndex !== -1) {
                    aSelectedIndices.push(iIndex);
                }
            });
        
            // Create a new array without the selected rows
            var aNewItems = aItems.filter(function(item, index) {
                return aSelectedIndices.indexOf(index) === -1;
            });
        
            // Update the model
            oModel.setProperty("/items", aNewItems);
            
            // Clear selections
            oTable.removeSelections();
            
            sap.m.MessageToast.show("Selected row(s) deleted.");
        },
        
        // Clear filters logic
        onClearFilters: function() {
            // Implementation for clearing filters if needed
            MessageToast.show("Filters cleared");
        },
        
        // Post logic placeholder
        onPost: function() {
            // Implementation for posting data
            MessageToast.show("Post action triggered");
        },
        
        // Handle navigation to detail view
        onRowPress: function(oEvent) {
            var oItem = oEvent.getSource();
            var oContext = oItem.getBindingContext("oTableModel");
            var path = oContext.getPath();
            var index = path.split("/")[2];
            
            // Navigate to detail view if needed
            // this._oRouter.navTo("RouteDetailView", {
            //     TableIndex: index
            // });
            
            MessageToast.show("Row " + (parseInt(index) + 1) + " selected");
        },
        */
       // Helper method to reset all table columns to invisible
       _resetTableColumnsVisibility: function() {
        for (var property in this.columnIdMapping) {
            var columnId = this.columnIdMapping[property];
            var oColumn = this.byId(columnId);
            if (oColumn) {
                oColumn.setVisible(false);
            }
        }
        // Always show status column
        var statusColumn = this.byId("colStatus");
        if (statusColumn) {
            statusColumn.setVisible(true);
        }
    },
    
    // Log column visibility for debugging
    _logColumnVisibility: function() {
        console.log("--- Column Visibility Status ---");
        for (var property in this.columnIdMapping) {
            var columnId = this.columnIdMapping[property];
            var oColumn = this.byId(columnId);
            if (oColumn) {
                console.log(columnId + " visibility: " + oColumn.getVisible());
            } else {
                console.log(columnId + " not found");
            }
        }
        
        // Also check status column
        var statusColumn = this.byId("colStatus");
        if (statusColumn) {
            console.log("Status column visibility: " + statusColumn.getVisible());
        } else {
            console.log("Status column not found");
        }
    },
    
    // Helper method to show only columns that match Excel data
    _showRelevantColumns: function(excelHeaders) {
        // First reset all columns to invisible
        this._resetTableColumnsVisibility();
        
        console.log("Excel headers to map:", excelHeaders);
        console.log("Column mapping:", this.columnMapping);
        
        // Track which columns have been made visible
        var visibleColumns = [];
        
        // Loop through Excel headers and make corresponding columns visible
        excelHeaders.forEach(function(header) {
            var modelProperty = this.columnMapping[header];
            console.log("Header:", header, "maps to property:", modelProperty);
            
            if (modelProperty) {
                var columnId = this.columnIdMapping[modelProperty];
                if (columnId) {
                    var oColumn = this.byId(columnId);
                    if (oColumn) {
                        oColumn.setVisible(true);
                        visibleColumns.push(columnId);
                        console.log("Made column visible:", columnId);
                    } else {
                        console.error("Column not found:", columnId);
                    }
                } else {
                    console.error("No column mapping for property:", modelProperty);
                }
            } else {
                console.warn("No property mapping for header:", header);
            }
        }, this);
        
        // If no columns were made visible, show all columns (as a fallback)
        if (visibleColumns.length === 0) {
            console.warn("No columns mapped! Showing all columns as fallback.");
            for (var property in this.columnIdMapping) {
                var columnId = this.columnIdMapping[property];
                var oColumn = this.byId(columnId);
                if (oColumn) {
                    oColumn.setVisible(true);
                }
            }
        }
        
        // Always show status column
        var statusColumn = this.byId("colStatus");
        if (statusColumn) {
            statusColumn.setVisible(true);
        }
        
        // Log the final column visibility state
        this._logColumnVisibility();
    },

    // Simulation button logic 
    onSimulation: function() {
        var aItems = this.getView().getModel("oTableModel").getProperty("/items");
        let errorRows = [];
        
        aItems.forEach((oItem, index) => {
            var isValid = oItem.txtCompanyCode && oItem.txtAmountDocCurr;
            
            oItem.validationStatus = isValid ? "valid" : "invalid";
            if (!isValid) errorRows.push(index + 1);
        });
        
        this.getView().getModel("oTableModel").refresh();
        
        if (errorRows.length > 0) {
            MessageBox.error(`Missing mandatory fields in rows: ${errorRows.join(", ")}`);
        }
    },

    // Add button logic
    onAdd: function () {
        // Create empty object with properties for all columns
        var obj = {
            "txtCompanyCode": "",
            "txtAmountDocCurr": "",
            "txtGlAccount": "",
            "txtVendorPos": "",
            "txtCustomerPos": "",
            "txtCostCenter": "",
            "txtAssignmentNumber": "",
            "txtProfitCenter": "",
            "txtItemText": "",
            "txtOrderNumber": "",
            "txtAmountLocCurr": "",
            "validationStatus": "pending"
        };

        this.getView().getModel("oTableModel").getData().items.unshift(obj);
        this.getView().getModel("oTableModel").updateBindings();
    },

    // Implement template download function
    onDownloadTemplate: function() {
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
                "Item Text": "",
                "Order Number": "",
                "Amount Loc.Curr.": ""
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

    // Upload file change handler
    onFileChange: function(oEvent) {
        // This gets called when a file is selected
        var oFile = oEvent.getParameter("files")[0];
        if (!oFile) {
            MessageToast.show("No file selected");
            return;
        }
        
        // Verify file type
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
                
                // Get Excel data with headers
                var excelData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                
                if (excelData.length === 0) {
                    MessageToast.show("No data found in the Excel file.");
                    return;
                }
                
                console.log("Excel data:", excelData);
                console.log("First row of Excel data:", excelData[0]);
                
                // Extract headers from the first object's keys
                var headers = Object.keys(excelData[0]);
                console.log("Excel headers:", headers);
                
                // Show only columns that are present in the Excel file
                that._showRelevantColumns(headers);
                
                // Map Excel data to model properties based on headers
                var tableItems = excelData.map(function(row, index) {
                    var item = {
                        "validationStatus": "pending", // Default status
                        "rowNum": index + 1  // Add row number
                    };
                    
                    // Map Excel values to corresponding model properties
                    headers.forEach(function(header) {
                        var modelProp = that.columnMapping[header];
                        
                        if (modelProp) {
                            if (row[header] !== undefined) {
                                item[modelProp] = row[header].toString();
                            } else {
                                item[modelProp] = "";
                            }
                        }
                    });
                    
                    return item;
                });
                
                // For debugging, log the first table item
                console.log("First table item:", tableItems[0]);
                
                // Update the table model with only the mapped data from Excel
                var oTableModel = that.getView().getModel("oTableModel");
                oTableModel.setProperty("/items", tableItems);
                
                // Update the table title if element exists
                var oTitle = that.getView().byId("tableTitle");
                if (oTitle) {
                    oTitle.setText("Items (" + tableItems.length + ")");
                }
                
                MessageToast.show("File uploaded successfully! Loaded " + tableItems.length + " records.");
                
            } catch (error) {
                console.error("Error processing Excel file:", error);
                MessageToast.show("Error processing the Excel file: " + error.message);
            }
        };
        
        reader.onerror = function(error) {
            console.error("FileReader error:", error);
            MessageToast.show("Error reading the file.");
        };
        
        // Read the file as an ArrayBuffer
        reader.readAsArrayBuffer(oFile);
    },
    
    // Delete button logic
    onDelete: function() {
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
        aSelectedItems.forEach(function(oSelectedItem) {
            var iIndex = oTable.indexOfItem(oSelectedItem);
            if (iIndex !== -1) {
                aSelectedIndices.push(iIndex);
            }
        });
    
        // Create a new array without the selected rows
        var aNewItems = aItems.filter(function(item, index) {
            return aSelectedIndices.indexOf(index) === -1;
        });
    
        // Update the model
        oModel.setProperty("/items", aNewItems);
        
        // Clear selections
        oTable.removeSelections();
        
        sap.m.MessageToast.show("Selected row(s) deleted.");
    },
    
    // Clear filters logic
    onClearFilters: function() {
        // Implementation for clearing filters if needed
        MessageToast.show("Filters cleared");
    },
    
    // Post logic placeholder
    onPost: function() {
        // Implementation for posting data
        MessageToast.show("Post action triggered");
    },
    
    // Handle navigation to detail view
    onRowPress: function(oEvent) {
        var oItem = oEvent.getSource();
        var oContext = oItem.getBindingContext("oTableModel");
        var path = oContext.getPath();
        var index = path.split("/")[2];
        
        // Navigate to detail view if needed
        // this._oRouter.navTo("RouteDetailView", {
        //     TableIndex: index
        // });
        
        MessageToast.show("Row " + (parseInt(index) + 1) + " selected");
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