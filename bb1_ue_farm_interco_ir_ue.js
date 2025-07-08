/**Project: United Exports
 *
 * Buttons on Purchase Orders
 * Update fields on lot and PO
 *
 * Date            Author			    Purpose
 * 10/08/2022      Hanlie Steynberg    Initial Release
 *
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 */
define(['N/url','N/ui/serverWidget','N/search','N/record'],

function(urlMod,serverWidget,search, record) {
   
    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {string} scriptContext.type - Trigger type
     * @param {Form} scriptContext.form - Current form
     * @Since 2015.2
     */
    function beforeLoad(scriptContext) {
			 var currentForm = scriptContext.form;	
      		 log.debug("CurrentForm", currentForm);
      		 var currentRecord = scriptContext.newRecord;
      		 var poId = currentRecord.id;
      		 var isBulkFruit = currentRecord.getValue('custbody_bb1_ue_farm_bulk');
      		 var isExternal = currentRecord.getValue('custbody_bb1_ue_farm_ext');
      		 var isInterCo = currentRecord.getValue('intercotransaction');
      		 var isPackVerify = currentRecord.getValue('custbody_ue_packout_verified_');
             var isManualIntakes = currentRecord.getValue('custbody_is_maual_intake_fin');
             log.debug("POID", poId);
             if ((isManualIntakes == true) && (poId))
             {
                
                var checkIfPalletIds = checkPalletIDs(poId);
                if (checkIfPalletIds == true)
                {  
                var suiteleturl = urlMod.resolveScript({
					scriptId : 'customscript_bb1_ue_mi_pallet_id_su',
					deploymentId : 'customdeploy_bb1_ue_mi_pallet_id_su',
					returnExternalUrl : false,
					params : {
						custparam_poid: poId,
                        custparam_stage : 0
            		}
				});
              	suiteleturl = "window.open('"+suiteleturl+"');"
              
                currentForm.addButton({
    	      		id : 'custpage_palletid',
    	      		label : 'Create Pallet IDs',
    	      		functionName: suiteleturl
    	    	});
                }
             }  
             var poId = currentRecord.id;
             var status = currentRecord.getValue("status");
      		 log.debug("stats",currentRecord.getValue("status"));
      		 if ((scriptContext.type != scriptContext.UserEventType.EDIT)&&(poId)&&(currentRecord.getValue("status")!="Cancelled")&&(currentRecord.getValue("status")!="Closed")&&(currentRecord.getValue("status")!="Billed")&&((currentRecord.getValue('intercotransaction'))||(currentRecord.getValue('intercostatus')==2)))			
      		{
    	    	var suiteleturl = urlMod.resolveScript({
					scriptId : 'customscript_bb1_ue_farm_interco_po_su',
					deploymentId : 'customdeploy_bb1_ue_farm_interco_po_su',
					returnExternalUrl : false,
					params : {
						custparam_poid: poId
            		}
				});
              
              	suiteleturl = "window.open('"+suiteleturl+"','_self');"
              	log.debug("suiteleturl", suiteleturl);
              
              	currentForm.addButton({
    	      		id : 'custpage_copy_lots',
    	      		label : 'Copy Lots from SO',
    	      		functionName: suiteleturl
    	    	});
      		}
      
      		 if ((isBulkFruit!=true)&&(isBulkFruit!=false)) return;
             var isBulkFruitCheck = true;
             if ((isBulkFruit!=true)&&(isBulkFruit!=false))
      				isBulkFruitCheck = false;
      		 var status = currentRecord.getValue('status');
      		 var isExternalCheck = true;
      		 log.debug("isExternal", isExternal);
             if ((isExternal!=true)&&(isExternal!=false))
      				isExternalCheck = false;
      		 log.debug("isExternalCheck", isExternalCheck);	
      		 var hideFld = currentForm.addField({
					id : 'custpage_hide',
					label : 'not shown - hidden',
					type : serverWidget.FieldType.INLINEHTML
				});
	    	var scr = "";
			scr += 'jQuery("#tbl_receive").hide();';
      		scr += 'jQuery("#tbl_secondaryreceive").hide();';
			hideFld.defaultValue = "<script>jQuery(function($){require([], function(){"
						+ scr + ";})})</script>"

            
          
      		
      		if (((isInterCo)&&(poId)&&(status.indexOf("Receipt")>0))||((isExternalCheck)&&(poId)&&(status.indexOf("Receipt")>0)))			
      		{
    	    	var suiteleturl = urlMod.resolveScript({
					scriptId : 'customscript_bb1_ue_farm_interco_ir_su',
					deploymentId : 'customdeploy_bb1_ue_farm_interco_ir_su',
					returnExternalUrl : false,
					params : {
						custparam_poid: poId
            		}
				});
              	suiteleturl = "window.open('"+suiteleturl+"');"
              
                  currentForm.addButton({
    	      		id : 'custpage_receive',
    	      		label : 'Receive',
    	      		functionName: suiteleturl
    	    	});
              	}
              	var suiteleturl2 = urlMod.resolveScript({
					scriptId : 'customscript_bb1_ue_farm_po_print_su',
					deploymentId : 'customdeploy_bb1_ue_farm_po_print_su',
					returnExternalUrl : false,
					params : {
						custparam_poid: poId
            		}
				});
              	suiteleturl2 = "window.open('"+suiteleturl2+"');"
              	
             
              	currentForm.addButton({
    	      		id : 'custpage_receive',
    	      		label : 'Print Pallet Labels',
    	      		functionName: suiteleturl2
    	    	});

            if (((isExternalCheck)||(isBulkFruitCheck))&&(isPackVerify))			
      		{
    	    	var suiteleturl = urlMod.resolveScript({
					scriptId : 'customscript_bb1_ue_comb_ss',
					deploymentId : 'customdeploy_bb1_ue_comb_ss',
					returnExternalUrl : false,
					params : {
						custparam_poid: poId
            		}
				});
              	suiteleturl = "window.open('"+suiteleturl+"');"
              
                  currentForm.addButton({
    	      		id : 'custpage_combpack',
    	      		label : 'Combined Packout Report',
    	      		functionName: suiteleturl
    	    	});
              	}
      	   var isBusyToProcess = currentRecord.getValue("custbody_bb1_proc_adj");
           if ((isBulkFruitCheck == true)&&(status)&&(status.indexOf("Pending Bill")>=0)&&(isBusyToProcess==false))	
           {	
    	    		
             	
                var inventoryadjustmentSearchObj = search.create({	
   type: "inventoryadjustment",	
   filters:	
   [	
      ["type","anyof","InvAdjst"], 	
      "AND", 	
      ["custbody_bb1_po_link_adj","anyof",poId]
   ],	
   columns:	
   [	
      search.createColumn({	
         name: "inventorynumber",	
         join: "inventoryDetail",	
         label: " Number"	
      })	
   ]	
});	
var searchResultCount = inventoryadjustmentSearchObj.runPaged().count;	
                if (searchResultCount > 0)	
                    return;	
                var suiteleturl = urlMod.resolveScript({	
					scriptId : 'customscript_bb1_ue_imp_auto_su',	
					deploymentId : 'customdeploy_bb1_ue_imp_auto_su',	
					returnExternalUrl : false,	
					params : {	
						custparam_poid: poId	
            		}	
				});	
              	suiteleturl = "var button = document.getElementById('tbl_custpage_autoadj');button.style.display = 'none';window.open('"+suiteleturl+"','_self');"	
              	
                  currentForm.addButton({	
    	      		id : 'custpage_autoadj',	
    	      		label : 'Create Auto Adjustment',	
    	      		functionName: suiteleturl	
    	    	});	
           }	
        	
    
        
    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function beforeSubmit(scriptContext) {

    }

    /**
     * Function definition to be triggered before record is loaded.
     *
     * @param {Object} scriptContext
     * @param {Record} scriptContext.newRecord - New record
     * @param {Record} scriptContext.oldRecord - Old record
     * @param {string} scriptContext.type - Trigger type
     * @Since 2015.2
     */
    function afterSubmit(scriptContext) {
      		log.debug("AfterSubmit");
      		var lots = [];
			var currentRecord = scriptContext.newRecord;
      		var purchaseorderSearchObj = search.create({
   				type: "purchaseorder",
   				filters:
   				[
      				["type","anyof","PurchOrd"], 
      				"AND", 
      				["mainline","is","F"], 
      				"AND", 
      				["taxline","is","F"], 
      				"AND", 
      				["internalid","is",currentRecord.id]
   				],
   				columns:
   				[
      				search.createColumn({
         				name: "inventorynumber",
         				join: "inventoryDetail"
      				}),
      				"custcol_bb1_unit_conversion_rate",
      				search.createColumn({
         				name: "formulanumeric1",
         				formula: "round((({custcolue_ph_gross_weight}-{custcol_bb1_pak_pallet_weight}-(({quantity}/{custcol_bb1_conversionrate})*{custcol_bb1_pak_lug_weight}))/({quantity}/{custcol_bb1_conversionrate}))/1,3)"
      				}),
      				search.createColumn({
         				name: "formulanumeric2",
         				formula: "round((({custcolue_ph_gross_weight}-{custcol_bb1_pak_pallet_weight}-(({quantity}/{custcol_bb1_conversionrate})*{custcol_bb1_pak_lug_weight}))/({quantity}/{custcol_bb1_conversionrate}))-({custcol_bb1_unit_conversion_rate})/1,3)"
      				}),
                    "custcol_bb1_fo_grade",
                  	"custcol_qc_brix_reading",
                  	"custcol_qc_durofel_reading",
                  	"custcol_receiving_size_under_12mm",
                  	"custcol_rec_size_12mm",
                  	"custcol_rec_size_14mm",
                  	"custcol_rec_size_16mm",
                  	"custcol_rec_size_18mm",
                  	"custcol_bb1_pak_comments",
                  	"custcol_bb1_ph_ave_bin",
                  	"custcol_bb1_rec_var_ave_bin"
   				]
				});
				
				purchaseorderSearchObj.run().each(function(result){
                  	var internalid = result.getValue({
         				name: "inventorynumber",
         				join: "inventoryDetail"
      				});
                    if (internalid)
                    	lots.push(internalid);
                    log.debug("LOTS", internalid);
                  	var farmAve = result.getValue("custcol_bb1_unit_conversion_rate");
                  	
                  	var grade = result.getValue("custcol_bb1_fo_grade");
                  	var brix = result.getValue("custcol_qc_brix_reading");
                  	var durofel = result.getValue("custcol_qc_durofel_reading");
                  	var sizeunder = result.getValue("custcol_receiving_size_under_12mm");
                  	var s12 = result.getValue("custcol_rec_size_12mm");
                  	var s14 = result.getValue("custcol_rec_size_14mm");
                  	var s16 = result.getValue("custcol_rec_size_16mm");	
                  	var s18 = result.getValue("custcol_rec_size_18mm");
                  	var comm = result.getValue("custcol_bb1_pak_comments");
                  	if (!grade){grade = ""};
                  	if (!brix){brix = 0};
                  	if (!durofel){durofel = 0};
                  	if (!sizeunder){sizeunder = 0};
                  	if (!s12){s12 = 0};
                  	if (!s14){s14 = 0};
                  	if (!s16){s16 = 0};
                  	if (!s18){s18 = 0};
                  	if (!comm){comm = ""};
                  
                    var phAvgBin =  result.getValue("custcol_bb1_ph_ave_bin");
                    var phAvgVar =  result.getValue("custcol_bb1_rec_var_ave_bin");
                  	if (!phAvgBin){phAvgBin = 0};
                  	if (!phAvgVar){phAvgVar = 0};
                  	log.debug("CHECKS", internalid + "|" + farmAve  + "|" + farmAve + "|" + phAvgVar);
                  	if (internalid && phAvgBin && farmAve && phAvgVar)
                    {
                    record.submitFields({				
	        			type: record.Type.INVENTORY_NUMBER,	
	        			id: internalid,	
	        			values: { 'custitemnumber_bb1_unit_conversion_rate': farmAve,
                                  'custitemnumber_bb1_grade_inf': grade,
                                  /*'custitemnumber_qc_brix_reading': brix,
                                  'custitemnumber_qc_durofel_reading': durofel,
                                  'custitemnumber_receiving_size_under_12mm': sizeunder,
                                  'custitemnumber_rec_size_12mm': s12,
                                  'custitemnumber_rec_size_14mm': s14,
                                  'custitemnumber_rec_size_16mm': s16,	
                                  'custitemnumber_rec_size_18mm': s18,
                                  'custitemnumber_bb1_pak_qc_comments': comm, */		
                               	  'custitemnumber_bb1_ph_ave_bin': phAvgBin, 
                                  'custitemnumber_bb1_receiving_variance': phAvgVar,  
                                },	
	        			options: {	
	        				enableSourcing: true,
	        				ignoreMandatoryFields : true
	        			}	
	        		});	
                      
                    }
                  	else
                    {
                      
                      
                      
                      log.debug("THIS IS INTERNAL ID", internalid + "|" + grade+ "|" + brix);
                      if (internalid)
                      {
                        log.debug("in Update QC Fields", internalid);
                        record.submitFields({				
	        			type: record.Type.INVENTORY_NUMBER,	
	        			id: internalid,	
	        			values: { 'custitemnumber_bb1_grade_inf': grade /*,
                                  'custitemnumber_qc_brix_reading': brix,
                                  'custitemnumber_qc_durofel_reading': durofel,
                                  'custitemnumber_receiving_size_under_12mm': sizeunder,
                                  'custitemnumber_rec_size_12mm': s12,
                                  'custitemnumber_rec_size_14mm': s14,
                                  'custitemnumber_rec_size_16mm': s16,	
                                  'custitemnumber_rec_size_18mm': s18,
                                  'custitemnumber_bb1_pak_qc_comments': comm	*/	
                               
                                },	
	        			options: {	
	        				enableSourcing: true,
	        				ignoreMandatoryFields : true
	        			}	
	        			});
                      }		
                    }  
                  

   					
   					return true;
				});
      
      			var poObj = search.lookupFields({ type: search.Type.PURCHASE_ORDER,						
					id: currentRecord.id,	
					columns: ['status','memo']	
						});
				var status = poObj.status[0].text;		
	
      			var dispRecord = currentRecord.getValue('custbody_bb1_dispatch_summary');
      			
      			var closed = poObj.memo;
      			log.debug("STATUSES", poObj);
                log.debug("STATUS", status + "|" + closed+"|"+lots.length);
      			if ((status == 'Closed')&&(closed == 'VOID'))
                  		{
                          	record.submitFields({				
	        					type: 'customrecord_bb1_ue_farm_disp_main',	
	        					id: dispRecord,	
	        					values: { 
                                  			'custrecord_bb1_ue_f_disp_m_status': 1,
                                  			'custrecord__bb1_ue_f_disp_m_po' : null	
                                        },	
			        			options: {	
			        				enableSourcing: true,
			        				ignoreMandatoryFields : true
			        			}	
			        		});	
                          var inventorynumberSearchObj = search.create({
   							type: "inventorynumber",
   							filters:
   							[
      							["custitemnumber_bb1_po_delivery_number","anyof",currentRecord.id]
   							],
   							columns:
   							[
      							"internalid",
      						]
							});
							var searchResultCount = inventorynumberSearchObj.runPaged().count;
							log.debug("inventorynumberSearchObj result count",searchResultCount);
							inventorynumberSearchObj.run().each(function(result){
   								
                              	var lotid = result.getValue("internalid");
                              	log.debug("THIS IS THE LOT WE MUST CLEAR", lotid);
                                record.submitFields({				
	        						type: record.Type.INVENTORY_NUMBER,	
	        						id: lotid,	
	        						values: { 
                                  			
                                  			'custitemnumber_bb1_po_delivery_number' : null	
                                    	    },	
			        				options: {	
				        				enableSourcing: true,
				        				ignoreMandatoryFields : true
				        			}	
				        		});	
   								return true;
								});
                          
                          
                        }
      
    		}

    function checkPalletIDs(poId)
      {
            var transactionSearchObj = search.create({
   type: "transaction",
   filters:
   [
      ["mainline","is","F"], 
      "AND", 
      ["internalid","anyof",poId], 
      "AND", 
      [["custcol_bb1_trd_pallet_id","isnotempty",""],"OR",["custcol_ue_add_to_pallet_id_mi","noneof","@NONE@"]]
   ],
   columns:
   [
      "line"
   ]
});
        var searchResultCount = transactionSearchObj.runPaged().count;
        if (searchResultCount == 0)
             return true;
        else
             return false;
        
      }
    return {
        beforeLoad: beforeLoad,
        beforeSubmit: beforeSubmit,
        afterSubmit: afterSubmit
    };
    
});
