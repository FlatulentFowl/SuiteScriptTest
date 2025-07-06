# SuiteScript 2.0 Best Practices
## 1\. Module Management
### 1.1 Use AMD Syntax for Module Loading
Always use the Asynchronous Module Definition (AMD) syntax (`define` and `require`) to load SuiteScript 2.0 modules. This ensures modules are loaded asynchronously, improving script performance and maintainability.

```javascript
/**
 * @NApiVersion 2.x
 * @NModuleScope SameAccount
 */
define(['N/record', 'N/search', 'N/log'],
function(record, search, log) {
    // Script logic here
});
```

### 1.2 Declare All Required Modules
Explicitly declare all modules your script will use in the `define` function. This makes dependencies clear and allows the NetSuite runtime to optimize module loading.

### 1.3 Use Module Aliases Consistently
Use clear and consistent aliases for modules (e.g., `record` for `N/record`, `log` for `N/log`).

## 2\. Governance and Performance
### 2.1 Understand and Monitor Governance Usage
Be aware of NetSuite's governance limits for script execution. Monitor script execution logs for "Usage" to identify potential bottlenecks and optimize code.

### 2.2 Optimize Saved Searches
When performing searches, use `N/search` module efficiently:
  * **Specify Columns and Filters:** Only retrieve the columns and apply the filters that are absolutely necessary. Avoid `search.create` without specific columns and filters if possible, as it can be resource-intensive.
  * **Iterate Efficiently:** Use the `search.run().each()` method for iterating over search results, as it is designed for efficient handling of large result sets and respects governance limits by processing results in batches.

    ```javascript
    search.create({
        type: search.Type.TRANSACTION,
        filters: [['type', 'anyof', 'SalesOrd'], 'and', ['status', 'anyof', 'SalesOrd:A']],
        columns: ['tranid', 'entity', 'amount']
    }).run().each(function(result) {
        var transactionId = result.getValue('tranid');
        var customerName = result.getText('entity'); // Use getText for display values
        var amount = result.getValue('amount');
        return true; // Return true to continue the iteration
    });
    ```

### 2.3 Minimize Record Loads
Loading records (using `record.load`) is a governance-heavy operation.
  * **Load Only When Necessary:** Avoid loading records repeatedly within loops if only a few fields are needed. Consider using `search` to retrieve necessary field values directly.
  * **Use `isDynamic` Judiciously:** The `isDynamic` parameter in `record.load` and `record.create` affects how the record behaves.
      * `isDynamic: true`: Simulates the UI, performing field sourcing and validation. Use when replicating UI-like behavior, such as for client scripts or when complex sourcing logic is required. It consumes more governance.
      * `isDynamic: false`: Direct manipulation of record fields without UI-like behavior. This is generally more performant and consumes less governance. Use for backend processing where field sourcing and validation are not critical or are handled explicitly.

### 2.4 Use `N/currentRecord` in Client Scripts
For client scripts, always use the `N/currentRecord` module to interact with the record currently open in the UI. This is more efficient and aligned with the client-side context than loading the record with `N/record`.

### 2.5 Avoid Nested Loops Where Possible
Nested loops, especially those involving record loads or complex calculations, can quickly consume governance. Refactor logic to reduce nesting or to use alternative approaches like `N/search` result processing.

## 3\. Error Handling and Logging
### 3.1 Implement Robust Error Handling
Always wrap code that can throw exceptions (e.g., record operations, external calls) in `try...catch` blocks. This allows for graceful error handling and prevents unexpected script termination.

```javascript
try {
    var newRecord = record.create({ type: record.Type.INVOICE, isDynamic: false });
    newRecord.setValue('entity', 100);
    newRecord.save();
} catch (e) {
    log.error({
        title: 'RECORD_SAVE_ERROR',
        details: e.message
    });
    // Further error handling, e.g., send notification
}
```
### 3.2 Use `N/log` Module for Debugging and Monitoring
The `N/log` module is the standard for logging in SuiteScript 2.0. Use different log levels appropriately:

  * `log.debug()`: For general debugging information during development. These logs are often disabled in production.
  * `log.audit()`: For important events or milestones in the script's execution.
  * `log.error()`: For capturing and reporting errors.
  * `log.emergency()`: For critical errors that require immediate attention.

<!-- end list -->

```javascript
log.debug({
    title: 'Script Started',
    details: 'User Event script beforeSubmit triggered.'
});

log.audit({
    title: 'Record Saved',
    details: 'Invoice ' + newRecordId + ' saved successfully.'
});
```

### 3.3 Log Important Data Points
When logging, include relevant data such as record IDs, transaction numbers, and specific error messages to facilitate debugging and problem resolution.

## 4\. Script Structure and Readability
### 4.1 Use JSDoc for Documentation
Properly document your scripts using JSDoc comments. This improves code readability and maintainability, especially for other developers or LLM-based code reviewers.

```javascript
/**
 * @NApiVersion 2.x
 * @NScriptType UserEventScript
 * @NModuleScope SameAccount
 * @Author Your Name
 * @Description This script handles logic for a custom record.
 */
define(['N/record', 'N/log'], function(record, log) {

    /**
     * Function to be executed before record submit.
     * @param {Object} context
     * @param {Record} context.newRecord - The new record object.
     * @param {Record} context.oldRecord - The old record object.
     * @param {string} context.type - The context type.
     */
    function beforeSubmit(context) {
        if (context.type === context.UserEventType.CREATE) {
            log.debug('Before Submit - Create', 'New record created.');
        }
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
```

### 4.2 Organize Code Logically
Group related functions and logic. Use helper functions to break down complex tasks into smaller, manageable units.

### 4.3 Use Meaningful Variable and Function Names
Use descriptive names for variables, functions, and parameters. Avoid single-letter variable names unless their context is abundantly clear (e.g., in a simple loop counter).
### 4.4 Adhere to Consistent Code Formatting
Maintain consistent indentation, spacing, and brace styles throughout your codebase.

## 5\. Security and Data Integrity
### 5.1 Validate User Input (Client Scripts)
In client scripts, always validate user input before submitting it to the server. This prevents invalid data from being saved and reduces the load on server-side validation.

### 5.2 Use Appropriate Permissions for Script Deployments
Ensure that the script deployment is configured with the least privileged role necessary to perform its required operations. Avoid using "Administrator" role if a custom role with fewer permissions suffices.

### 5.3 Handle Sensitive Data Securely
Avoid hardcoding sensitive information directly in scripts. Utilize secure methods for storing and retrieving credentials or confidential data if necessary (though generally, NetSuite's built-in permissions and roles should mitigate most needs for this).

## 6\. Development Lifecycle
### 6.1 Version Control
Utilize a version control system (e.g., Git) to track changes to your SuiteScript files. This allows for collaboration, rollbacks, and a clear history of development.

### 6.2 Thorough Testing
Test scripts thoroughly in a Sandbox or Release Preview environment before deploying to production. Test all possible scenarios, including edge cases and error conditions.

### 6.3 Modular Development
Develop scripts in a modular fashion where possible. This means creating reusable libraries (`N/module`) for common functionalities that can be shared across multiple scripts.

```javascript
// myReusableLibrary.js
define([], function() {
    function calculateTax(amount, taxRate) {
        return amount * taxRate;
    }

    return {
        calculateTax: calculateTax
    };
});

// MyUserEventScript.js
define(['N/record', 'N/log', './myReusableLibrary'],
function(record, log, myReusableLibrary) {
    function beforeSubmit(context) {
        var itemAmount = context.newRecord.getValue('itemamount');
        var tax = myReusableLibrary.calculateTax(itemAmount, 0.05);
        log.debug('Calculated Tax', tax);
    }

    return {
        beforeSubmit: beforeSubmit
    };
});
```

### 6.4 Clean Up Old Scripts and Deployments
Deactivate or delete old, unused scripts and script deployments to keep your NetSuite environment clean and organized.

## 7\. Specific Considerations
### 7.1 Client Script Execution Order
Be aware of the execution order of client script entry points (e.g., `pageInit`, `fieldChanged`, `saveRecord`). Design your logic to fit this flow.

### 7.2 User Event Script Contexts
Understand the different contexts (create, edit, view, xedit, delete) in which User Event scripts execute and tailor your logic accordingly. Use `context.type` to differentiate.

### 7.3 Scheduled Script Retries
For scheduled scripts, consider implementing retry mechanisms or robust error handling to account for transient issues or governance limitations.

### 7.4 Map/Reduce Script Phases
Understand the distinct phases of a Map/Reduce script (`getInputData`, `map`, `shuffle`, `reduce`, `summarize`) and design your processing logic to fit these phases for optimal performance on large datasets.

### 7.5 Suitelet Security
When developing Suitelets, always validate user input and implement appropriate security measures to prevent unauthorized access or malicious activities. Consider the use of `N/url` and `N/redirect` for secure navigation.
