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

    var XLSX = window.XLSX;

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
                    }
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

        // onCurrencyValueHelpRequest: function(oEvent) {
        //     var aCurrencies = [
        //         { code: "USD", name: "US Dollar" },
        //         { code: "EUR", name: "Euro" },
        //         { code: "GBP", name: "British Pound" },
        //         { code: "JPY", name: "Japanese Yen" }
        //     ];
            
        //     var oCurrencyModel = new JSONModel({
        //         currencies: aCurrencies
        //     });
            
        //     if (!this._oDialog) {
        //         this._oDialog = new sap.m.SelectDialog({
        //             title: "Select Currency",
        //             items: {
        //                 path: "/currencies",
        //                 template: new sap.m.StandardListItem({
        //                     title: "{code}",
        //                     description: "{name}"
        //                 })
        //             },
        //             search: function(oEvent) {
        //                 var sValue = oEvent.getParameter("value");
        //                 var oFilter = new Filter("code", FilterOperator.Contains, sValue);
        //                 oEvent.getSource().getBinding("items").filter([oFilter]);
        //             },
        //             confirm: function(oEvent) {
        //                 var oSelectedItem = oEvent.getParameter("selectedItem");
        //                 if (oSelectedItem) {
        //                     var sCode = oSelectedItem.getTitle();
        //                     // Set the selected currency code to your model
        //                     this.getView().getModel("oModel").setProperty("/currencyCode", sCode);
        //                 }
        //             }.bind(this)
        //         });
                
        //         this._oDialog.setModel(oCurrencyModel);
        //     }
            
        //     this._oDialog.open();
        // },

        // onCurrencyValueHelpRequest: function () {
        //     if (!this._oCurrencyValueHelpDialog) {
        //         Fragment.load({
        //             id: this.getView().getId(),
        //             name: "y4cr2r020e249.fragment.CurrencyValueHelp",
        //             controller: this
        //         }).then(function (oDialog) {
        //             this._oCurrencyValueHelpDialog = oDialog;
        //             this.getView().addDependent(this._oCurrencyValueHelpDialog);
        //             this._oCurrencyValueHelpDialog.open();
        //         }.bind(this));
        //     } else {
        //         this._oCurrencyValueHelpDialog.open();
        //     }
        // },

        // onCurrencyValueHelpCancel: function () {
        //     this._oCurrencyValueHelpDialog.close();
        // },

        // onCurrencyListSelect: function (oEvent) {
        //     var oSelectedItem = oEvent.getParameter("listItem");
        //     var sCurrency = oSelectedItem.getTitle();
        //     this.getView().getModel().setProperty("/selectedCurrency", sCurrency);
        //     this._oCurrencyValueHelpDialog.close();
        // },

        onCurrencyValueHelpRequest: function (oEvent) {
            var that = this;
            var oView = this.getView();

            if (!this._oCurrencyValueHelpDialog) {
                this._oCurrencyValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "y4cr2r020e249.fragment.CurrencyValueHelp",
                    controller: this
                }).then(function (oCurrencyDialog) {
                    oView.addDependent(oCurrencyDialog);
                    this.getView().addDependent(this._oCurrencyValueHelpDialog);
                    return oCurrencyDialog;
                });
            }
            this._oCurrencyValueHelpDialog.then(function(oCurrencyDialog){
				oCurrencyDialog.open();
			}.bind(this));
        },

        onCurrencyhandleSearch: function (oEvent) {
            var that = this;
            var sValue = oEvent.getParameter("value");
            var oBinding = oEvent.getParameter("itemsBinding");
            if (!sValue) {
                oBinding.filter([]);
            } else {
                var oFilter = new Filter("code", FilterOperator.Contains, sValue);
                oBinding.filter([oFilter]);
            }
        },

        onCurrencyListSelect: function (oEvent) {
            var oSelectedItem = oEvent.getParameter("listItem");
            var sCurrency = oSelectedItem.getTitle();
            this.getView().getModel().setProperty("/selectedCurrency", sCurrency);
            this._oCurrencyValueHelpDialog.close();
        },

        // onHeaderTextValueHelpRequest: function () {
        //     var that = this;
        //     // Only load data if it hasn't been loaded yet
        //     var oTableModel = this.getView().getModel("oTableModel");
        //     var aTerritoriesData = oTableModel.getProperty("/aTerritories");
            
        //     if (!this._oHeaderTextDialog) {
        //         this._oHeaderTextDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.HeaderTextDialog", this);
        //         this.getView().addDependent(this._oHeaderTextDialog);
                
        //         this._oHeaderTextDialog.attachSearch(this.onHeaderTextSearchFilter, this);
        //         this._oHeaderTextDialog.attachLiveChange(this.onHeaderTextSearchFilter, this);
        //     }
            
        //     if (!aTerritoriesData || aTerritoriesData.length === 0) {
        //         sap.ui.core.BusyIndicator.show(0);
        //         var oModel = this.getView().getModel("oModel");
        //         var oParams = "TerritoryDescription"
                
        //         oModel.read("/Territories", {
        //             urlParameters: oParams,
        //             success: function (oData) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 oTableModel.setProperty("/aTerritories", oData.results);
        //                 that._oHeaderTextDialog.open();
        //             },
        //             error: function (oError) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 console.error("Error reading data:", oError);
        //                 // Show error message to user
        //                 sap.m.MessageToast.show("Error loading company data");
        //             }
        //         });
        //     } else {
        //         this._oHeaderTextDialog.open();
        //     }

        // },

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


        // onReferenceValueHelpRequest: function() {
        //     var that = this;
        //     var oTableModel = this.getView().getModel("oTableModel");

        //     if(!that.pRefDialog) {
        //         that.pRefDialog = sap.ui.xmlfragment("y4cr2r020e249.fragment.ReferenceDiaglog", this);
        //         that.getView().addDependent(that.pRefDialog);
        //     }
        //     if (!this.aSuppliersData || this.aSuppliersData.length === 0) {
        //         sap.ui.core.BusyIndicator.show(0);
        //         var oModel = this.getView().getModel("oModel");
        //         var oParams = "Address";
        //         // this.aSuppliersData = oTableModel.getProperty("/aSuppliers");
        //         oModel.read("/Suppliers", {
        //             urlParameters: oParams,
        //             success: function(oData){
        //                 sap.ui.core.BusyIndicator.hide();
        //                 that.aSuppliersData = oData.results;
        //                 oTableModel.setProperty("/aSuppliers", oData.results);
        //                 that.pRefDialog.open();
        //             },
        //             error: function(oError) {
        //                 sap.ui.core.BusyIndicator.hide();
        //                 console.error("Error reading data:", oError);
        //                 sap.m.MessageToast.show("Error loading company data");
        //             }
        //         });

        //     }
        //     else {
        //         that.pRefDialog.open();
        //     }
            
        // },

        // ReferencehandleClose: function(oEvent) {
        //     var that = this;
        //     var oSelectedItem = oEvent.getParameter("selectedItem");
        //     if (oSelectedItem) {
        //         var sAddress = oSelectedItem.getCells()[0].getText().trim();;
        //         this.byId("inputReference").setValue(sAddress);
        //     };
        // },

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

            aItems.unshift({
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
            // aItems.unshift(oNewRow);
            oModel.setProperty("/items", aItems);
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

        // onUpload: function (oEvent) {
        //     var oFileUploader = this.byId("fileUploader");
        //     var oFile = oFileUploader.oFileUpload.files[0]; // Access the selected file
        
        //     if (!oFile) {
        //         MessageToast.show("Please select an Excel file first.");
        //         return;
        //     }
        
        //     var reader = new FileReader();
        //     reader.onload = function (e) {
        //         var data = e.target.result;
        //         var workbook = XLSX.read(data, { type: "binary" });
        //         var sheetName = workbook.SheetNames[0]; // Get the first sheet
        //         var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
        
        //         var oTableModel = this.getView().getModel("oTableModel");
        //         oTableModel.setProperty("/items", excelData);
        //         MessageToast.show("File uploaded successfully!");
        //     }.bind(this);
        
        //     reader.onerror = function () {
        //         MessageToast.show("Error reading the file.");
        //     };
        
        //     reader.readAsBinaryString(oFile);
        // },


        // onUploadPress: function() {
        //     // This will trigger the hidden file uploader when Upload button is clicked
        //     // this.byId("fileUploader").openValueStateMessage();\
        //      // This directly triggers the FileUploader to open
        //      var oFileUploader = this.byId("fileUploader");
        //      if (oFileUploader) {
        //          // This is the correct way to programmatically trigger file selection
        //          jQuery(oFileUploader.getFocusDomRef()).click();
        //      }
        // },
        
        // onFileChange: function(oEvent) {
        //     // This will be called when a file is selected
        //     var oFile = oEvent.getParameter("files")[0];
        //     if (!oFile) {
        //         MessageToast.show("No file selected");
        //         return;
        //     }
            
        //     this.processExcelFile(oFile);
        // },
        
        // processExcelFile: function(oFile) {
        //     var reader = new FileReader();
            
        //     reader.onload = function(e) {
        //         var data = e.target.result;
        //         var workbook = XLSX.read(data, { type: "binary" });
        //         var sheetName = workbook.SheetNames[0]; // Get the first sheet
        //         var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                
        //         // Map Excel data to your table model structure
        //         var tableItems = excelData.map(function(item) {
        //             return {
        //                 "txtCompanyCode": item["Comp.Code"] || "",
        //                 "txtAmountDocCurr": item["Amount Doc.Curr."] || "",
        //                 "txtAmountLocCurr": item["Amount Loc.Curr."] || "",
        //                 "txtGlAccount": item["G/L account"] || "",
        //                 "txtVendorPos": item["Vendor pos."] || "",
        //                 "txtCustomerPos": item["Customer pos."] || "",
        //                 "txtCostCenter": item["Cost Center"] || "",
        //                 "txtOrderNumber": item["Order Number"] || "",
        //                 "txtAssignmentNumber": item["Assignment Number"] || "",
        //                 "txtItemText": item["Item Text"] || "",
        //                 "txtProfitCenter": item["Profit Center"] || ""
        //             };
        //         });
                
        //         var oModel = this.getView().getModel();
        //         oModel.setProperty("/items", tableItems);
        //         MessageToast.show("File uploaded successfully!");
        //     }.bind(this);
            
        //     reader.onerror = function() {
        //         MessageToast.show("Error reading the file.");
        //     };
            
        //     reader.readAsBinaryString(oFile);
        // },

        onFileChange: function(oEvent) {
            // This gets called when a file is selected
            var oFile = oEvent.getParameter("files")[0];
            if (!oFile) {
                MessageToast.show("No file selected");
                return;
            }
            
            this.processExcelFile(oFile);
        },
        
        // Process the Excel file
        processExcelFile: function(oFile) {
            
            if (!XLSX) {
                MessageToast.show("XLSX library not loaded. Please check your index.html file.");
                return;
            }
            
            var reader = new FileReader();
            
            reader.onload = function(e) {
                try {
                    // Use the modern approach instead of readAsBinaryString
                    var data = new Uint8Array(e.target.result);
                    var workbook = XLSX.read(data, { type: "array" });
                    var sheetName = workbook.SheetNames[0]; // Get the first sheet
                    var excelData = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
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
                            "txtAmountLocCurr": item["Amount Loc.Curr."] || "",
                            "txtGlAccount": item["G/L account"] || "",
                            "txtVendorPos": item["Vendor pos."] || "",
                            "txtCustomerPos": item["Customer pos."] || "",
                            "txtCostCenter": item["Cost Center"] || "",
                            "txtOrderNumber": item["Order Number"] || "",
                            "txtAssignmentNumber": item["Assignment Number"] || "",
                            "txtItemText": item["Item Text"] || "",
                            "txtProfitCenter": item["Profit Center"] || ""
                        };
                    });
                    
                    var oModel = this.getView().getModel();
                    oModel.setProperty("/items", tableItems);
                    MessageToast.show("File uploaded successfully! Loaded " + tableItems.length + " records.");
                } catch (error) {
                    console.error("Error processing Excel file:", error);
                    MessageToast.show("Error processing the Excel file. See console for details.");
                }
            }.bind(this);
            
            reader.onerror = function(error) {
                console.error("FileReader error:", error);
                MessageToast.show("Error reading the file.");
            };
            
            // Using the modern approach instead of readAsBinaryString
            reader.readAsArrayBuffer(oFile);
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