// This code is used as part of an n8n code block.  
// It receives input from a N8N http request node called getPullRequest.  
// The output is represtntd in the file getPullRequest.json   
// The script reviews the input and finds differneces in the Pull Request.
// It will then pass a set of instructions to an AI Agent to perform a code review on the differenc
const files = $input.all().map(item => item.json);

const backticks = '```';
const diffs = files.map(file => {
  if (!file.patch) {
    return `
### File: ${file.filename}

_No patch available (likely a binary file)._

---
`;
  }
  return `
### File: ${file.filename}

${backticks}diff
${file.patch}
${backticks}

---
`;
}).join('\n');

const userMessage = `
You are a senior NetSuite SuiteScript 2.0 developer and architect.
Please review the following code changes in these files:
${diffs}

---

Your mission is to act as a code reviewer. Please follow these instructions:
- Review the proposed code changes file by file.
- Generate inline comments on the relevant lines of code, suggesting improvements or pointing out issues.
- Do not repeat the code snippet or the filename in your review. Write the comments directly.
- Ignore files without patches.
`;

return [
  {
    json: {
      user_message: userMessage.trim()
    }
  }
];
