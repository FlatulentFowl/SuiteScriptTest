// This code is used as part of an n8n code block.
// It receives input from a N8N http request node called getPullRequest.
// The output is represented in the file getPullRequest.json
// The script reviews the input and finds differences in the Pull Request.
// It will then pass a set of instructions to an AI Agent to perform a code review on the difference.
const files = $input.all().map(item => item.json);

const diffs = files.map(file => {
  if (!file.patch) {
    return `### File: ${file.filename}\n\n_No patch available (likely a binary file)._`;
  }
  // The patch content is wrapped in a fenced code block.
  // No need to escape backticks inside it.
  return `### File: ${file.filename}\n\n\`\`\`diff\n${file.patch}\n\`\`\``;
}).join('\n\n---\n\n');

const BESTPRACTICES = $input.first().json.result;

const userMessage = `
You are a senior NetSuite SuiteScript 2.0 developer and architect.
Please review the following code changes in these files:
${diffs}

---

When reviewing, please focus on the following:
* **NetSuite Best Practices:**
  * Check for adherence to NetSuite best practices, including governance limits (usage units), efficient record loading, and proper use of API contexts.
  * Refer to this information for best practices:
  ${BESTPRACTICES}
* **Error Handling:**
  * Ensure that error handling is robust and that errors are logged appropriately.
* **Code Clarity & Maintainability:**
  * Assess the code for clarity, readability, and maintainability.
  * Check for adherence to standard JSDoc comments for functions and parameters.
* **Security:**
  * Look for any potential security vulnerabilities, such as hardcoded credentials or insecure data handling.
`;

return [
  {
    json: {
      user_message: userMessage.trim()
    }
  }
];
