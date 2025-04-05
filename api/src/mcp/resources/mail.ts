import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Mail-related resources
const mailResources: Resource[] = [
	// Mail tools
	{
		uri: 'mcp://docs/tools/mail',
		mimeType: 'text/markdown',
		name: 'Mail Tools',
		description: 'Documentation for email tools',
		text: `# Email Management Tools

## send_email
Send an email through the system.

**Parameters**:
- to: string (Required - Email address or addresses of recipients)
- subject: string (Required - Subject line of the email)
- text: string (Optional - Plain text content of the email)
- html: string (Optional - HTML content of the email)
- from: string (Optional - Email address of the sender)
- cc: string (Optional - Email address or addresses for CC)
- bcc: string (Optional - Email address or addresses for BCC)

**Note**: Either text or html must be provided.

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "to": "recipient@example.com",
  "subject": "Important Update",
  "text": "This is a plain text email content.",
  "cc": "manager@example.com"
}
\`\`\`

## send_email_with_template
Send an email using a template.

**Parameters**:
- to: string (Required - Email address or addresses of recipients)
- subject: string (Required - Subject line of the email)
- template: object (Required - Template configuration with name and data)
  - name: string (Required - Name of the template to use)
  - data: object (Required - Template data)
- from: string (Optional - Email address of the sender)
- cc: string (Optional - Email address or addresses for CC)
- bcc: string (Optional - Email address or addresses for BCC)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "to": "recipient@example.com",
  "subject": "Password Reset",
  "template": {
    "name": "password-reset",
    "data": {
      "url": "https://example.com/reset?token=xyz",
      "user_name": "John Doe"
    }
  }
}
\`\`\`

**Available Templates**:
- user-invitation: For inviting users to the platform
- password-reset: For password reset emails
- user-registration: For new user registrations
`,
	},
];

// Resource decorator for Mail resources
export class MailResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, mailResources);
  }
}

// Export resources array for combining in main resources file if needed
export { mailResources };