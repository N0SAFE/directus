import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { MailService } from '../../services/mail/index.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';

const logger = useLogger();

// Mail tool definitions
const MAIL_TOOLS: Tool[] = [
	{
		name: 'send_email',
		description: 'Send an email through the system',
		inputSchema: {
			type: 'object',
			properties: {
				to: {
					type: 'string',
					description: 'Email address or addresses of recipients. Multiple addresses can be separated by commas.',
				},
				subject: {
					type: 'string',
					description: 'Subject line of the email',
				},
				text: {
					type: 'string',
					description: 'Plain text content of the email (either text or html is required)',
				},
				html: {
					type: 'string',
					description: 'HTML content of the email (either text or html is required)',
				},
				from: {
					type: 'string',
					description: 'Email address of the sender (optional, will use system default if not provided)',
				},
				cc: {
					type: 'string',
					description: 'Email address or addresses for CC. Multiple addresses can be separated by commas.',
				},
				bcc: {
					type: 'string',
					description: 'Email address or addresses for BCC. Multiple addresses can be separated by commas.',
				},
			},
			required: ['to', 'subject'],
		},
	},
	{
		name: 'send_email_with_template',
		description: 'Send an email using a template',
		inputSchema: {
			type: 'object',
			properties: {
				to: {
					type: 'string',
					description: 'Email address or addresses of recipients. Multiple addresses can be separated by commas.',
				},
				subject: {
					type: 'string',
					description: 'Subject line of the email',
				},
				template: {
					type: 'object',
					description: 'Template configuration',
					properties: {
						name: { type: 'string', description: 'Name of the template to use' },
						data: { type: 'object', description: 'Template data' },
					},
					required: ['name', 'data'],
				},
				from: {
					type: 'string',
					description: 'Email address of the sender (optional, will use system default if not provided)',
				},
				cc: {
					type: 'string',
					description: 'Email address or addresses for CC. Multiple addresses can be separated by commas.',
				},
				bcc: {
					type: 'string',
					description: 'Email address or addresses for BCC. Multiple addresses can be separated by commas.',
				},
			},
			required: ['to', 'subject', 'template'],
		},
	},
];

// Define params types for better type safety
type SendEmailParams = {
	to: string;
	subject: string;
	text?: string;
	html?: string;
	from?: string;
	cc?: string;
	bcc?: string;
};

type SendEmailWithTemplateParams = {
	to: string;
	subject: string;
	template: { 
		name: string; 
		data: Record<string, any> 
	};
	from?: string;
	cc?: string;
	bcc?: string;
};

// Define the tool method map for mail
interface MailToolMethods extends ToolMethodMap {
	send_email: (params: SendEmailParams) => Promise<any>;
	send_email_with_template: (params: SendEmailWithTemplateParams) => Promise<any>;
}

// Decorator for mail operations
export class MailToolsDecorator extends MCPToolHandlerDecorator<MailToolMethods> {
	constructor(handler: IMCPToolHandler) {
		super(handler, MAIL_TOOLS);
	}

	public override getTools(): Tool[] {
		return [...MAIL_TOOLS, ...super.getTools()];
	}

	// Tool methods with the same name as the tool will be automatically called by the decorator
	async send_email(params: SendEmailParams) {
		try {
			if (!params.text && !params.html) {
				return MCPResponseUtils.createErrorResponse('Either text or html content must be provided');
			}

			const mailService = new MailService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await mailService.send(
				params.from
					? {
							to: params.to,
							subject: params.subject,
							text: params.text,
							html: params.html,
							from: params.from,
							cc: params.cc,
							bcc: params.bcc,
					  }
					: {
							to: params.to,
							subject: params.subject,
							text: params.text,
							html: params.html,
							cc: params.cc,
							bcc: params.bcc,
					  },
			);

			return {
				content: [
					{
						type: 'text',
						text: `Email successfully sent to ${params.to}`,
					},
				],
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error sending email: ${error.message}`);
			} else {
				logger.error(`Error sending email: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error sending email');
		}
	}

	async send_email_with_template(params: SendEmailWithTemplateParams) {
		try {
			const mailService = new MailService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await mailService.send(
				params.from
					? {
							to: params.to,
							subject: params.subject,
							template: params.template,
							from: params.from,
							cc: params.cc,
							bcc: params.bcc,
					  }
					: {
							to: params.to,
							subject: params.subject,
							template: params.template,
							cc: params.cc,
							bcc: params.bcc,
					  },
			);

			return {
				content: [
					{
						type: 'text',
						text: `Email successfully sent to ${params.to} using template "${params.template.name}"`,
					},
				],
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error sending email with template: ${error.message}`);
			} else {
				logger.error(`Error sending email with template: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error sending email with template');
		}
	}
}
