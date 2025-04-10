/*sap.ui.define([
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

    return Controller.extend("y4cr2r020e249.controller.AccountView", {

        onInit: function () {
            var oData = {
                items: []
            };

            // Create a new JSON model with the empty data
            var oModel = new JSONModel(oData);
            this.getView().setModel(oModel);

            var oTableModel = new JSONModel(oData);
            this.getView().setModel(oTableModel, "oTableModel");
            
            // Check if XLSX is globally available
            if (typeof XLSX === "undefined") {
                console.error("XLSX library not loaded. Check your index.html file.");
            }

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
                "txtCompanyCode": "av2colCompanyCode",
                "txtAmountDocCurr": "av2colAmountDocCurr",
                "txtGlAccount": "av2colGlAccount",
                "txtVendorPos": "av2colVendorPos",
                "txtCustomerPos": "av2colCustomerPos",
                "txtCostCenter": "av2colCostCenter",
                "txtAssignmentNumber": "av2colAssignmentNumber",
                "txtProfitCenter": "av2colProfitCenter",
                "txtItemText": "av2colItemText",
                "txtOrderNumber": "av2colOrderNumber",
                "txtAmountLocCurr": "av2colAmountLocCurr"
            };
            
            // Always show status column
            this.byId("av2colStatus").setVisible(true);
        },

        _handleRouteMatched: function (oEvent) {
            var that = this;
            var oParameters = oEvent.getParameters();
            if (oParameters.name === 'AccountView2') {
                // Reset table columns visibility
                this._resetTableColumnsVisibility();
            }
        },
        
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
            this.byId("av2colStatus").setVisible(true);
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
            this.byId("av2colStatus").setVisible(true);
        },

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
                    var oTitle = that.getView().byId("av2tableTitle");
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
            var oTable = this.byId("av2accountTable");
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
        }
    });
});*/