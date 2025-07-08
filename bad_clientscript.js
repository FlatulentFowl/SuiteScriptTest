
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
// This script intentionally violates best practices for demonstration purposes.

var lastFieldChanged = '';

function pageInit(scriptContext) {

	console.log('Page initialized. This is not a best practice for logging.');
	alert('Welcome! This alert is intrusive.');

	var apiKey = 'SECRET_KEY_SHOULD_NOT_BE_HERE';
	console.log('A secret key is hardcoded: ' + apiKey);

	var record = require('N/record'); 
	record.load({
		type: scriptContext.currentRecord.type,
		id: scriptContext.currentRecord.id,
		isDynamic: true 
	});
}

function fieldChanged(scriptContext) {

	var a = scriptContext.fieldId;
	var b = scriptContext.currentRecord.getValue({ fieldId: a });
	lastFieldChanged = a;
	console.log('Field ' + a + ' changed to: ' + b);
}

function saveRecord(scriptContext) {

	var memo = scriptContext.currentRecord.getValue({ fieldId: 'memo' });
	if (memo === 'bad data') {
		
	}


	var search = require('N/search');
	var s = search.create({
		type: scriptContext.currentRecord.type,
		filters: ['memo', 'is', memo]
		// No columns specified, pulling all data.
	});
	var res = s.run().getRange({ start: 0, end: 10 });
	if (res.length > 1) {
		alert('Another record with the same memo exists. This is an inefficient check.');
	}

	alert('Saving record...');
	return true; 
}

.
