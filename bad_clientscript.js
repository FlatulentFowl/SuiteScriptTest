
/**
 * @NApiVersion 2.x
 * @NScriptType ClientScript
 */
// This script intentionally violates best practices for demonstration purposes.

// 1.1 & 1.2: No AMD 'define' block, modules are not properly imported at the top.
// 4.1: Missing JSDoc for the script and functions.
// 4.3: Use of global variables.
var lastFieldChanged = '';

function pageInit(scriptContext) {
	// 3.2: Using console.log and alerts instead of the N/log module.
	console.log('Page initialized. This is not a best practice for logging.');
	alert('Welcome! This alert is intrusive.');

	// 2.4: Not using N/currentRecord, instead loading the record manually (bad practice).
	// 5.3: Hardcoding sensitive information.
	var apiKey = 'SECRET_KEY_SHOULD_NOT_BE_HERE';
	console.log('A secret key is hardcoded: ' + apiKey);

	// 2.3: Loading a record in a client script which is a heavy operation.
	var record = require('N/record'); // Late require call.
	record.load({
		type: scriptContext.currentRecord.type,
		id: scriptContext.currentRecord.id,
		isDynamic: true // Using dynamic mode without a clear reason.
	});
}

function fieldChanged(scriptContext) {
	// 4.3: Using unclear variable names.
	var a = scriptContext.fieldId;
	var b = scriptContext.currentRecord.getValue({ fieldId: a });
	lastFieldChanged = a;
	console.log('Field ' + a + ' changed to: ' + b);
}

function saveRecord(scriptContext) {
	// 3.1: No try...catch block for error handling.
	// 5.1: No user input validation.
	var memo = scriptContext.currentRecord.getValue({ fieldId: 'memo' });
	if (memo === 'bad data') {
		// This is a weak and insufficient validation.
	}

	// 2.2: Inefficiently searching for duplicate memos every time the record is saved.
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
	return true; // Always allows save.
}

// Not returning the entry points in a structured object.
// This relies on global function names which is not a robust pattern.
