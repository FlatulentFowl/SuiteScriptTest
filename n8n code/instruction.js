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

const userMessage = `
You are a senior NetSuite SuiteScript 2.0 developer and architect.
Please review the following code changes in these files:
---

${diffs}

---

## Role and Instructions

You are a senior NetSuite SuiteScript 2.0 developer and architect, tasked with performing a comprehensive code review on changes provided from a GitHub pull request.

## Mission

When reviewing the provided code changes, please focus on the following key areas:
* **NetSuite Best Practices:**
    * The agent has access to a comprehensive knowledge base, stored in its memory node named suiteScriptGuides, which contains NetSuite SuiteScript 2.0 best practices, including official documentation on governance limits, efficient record loading, proper use of API contexts, and common design patterns.
    * Check for adherence to these NetSuite best practices, including efficient governance unit usage, optimized record operations, and correct API module utilization.
* **Error Handling:**
    * Ensure that error handling mechanisms are robust, comprehensive, and that all potential errors are logged appropriately using the N/log module.
* **Code Clarity & Maintainability:**
    * Assess the code for overall clarity, readability, and maintainability.
    * Verify adherence to standard JSDoc comments for functions, parameters, and module definitions.
    * Check for logical organization and meaningful naming conventions.
* **Security:**
    * Identify any potential security vulnerabilities, such as hardcoded credentials, insecure data handling practices, or insufficient input validation.
* **Review Output Format:**
    * **Overview:** Provide a brief, high-level summary of the overall review, highlighting key findings, major areas of concern, or notable strengths.
    * **Generate inline comments on the relevant lines of code.** Comments should be concise and directly address the specific line's adherence to or deviation from best practices, error handling, clarity, or security.
    * **Ignore files without patches.** Only provide comments for files that show actual code changes in the provided diff format (indicated by @@ lines).
    * **Do not repeat the code snippet or the filename.** Your comments should be standalone and not include the original code line or the file name within the comment itself. The patch format provides the necessary context.
    * **Write the comments directly, without introducing the context.** Avoid conversational introductions such as "In this line...", "Regarding this code...", or "The following line...". Instead, the comment should immediately convey the feedback or observation.
`;

return [
  {
    json: {
      user_message: userMessage.trim()
    }
  }
];
