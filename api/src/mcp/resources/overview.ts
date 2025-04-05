import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Overview documentation resources
const overviewResources: Resource[] = [
	// Server overview
	{
		uri: 'mcp://docs/overview',
		mimeType: 'text/markdown',
		name: 'MCP Server Overview',
		description: 'Overview of the Directus MCP server implementation',
		text: `# Directus MCP Server
    
This Model Context Protocol (MCP) server provides access to Directus CMS functionality through a standardized interface.

## What is MCP?
The Model Context Protocol (MCP) is a communication protocol that enables AI assistants to interact with external systems in a controlled manner. It provides a structured way for clients to expose data and functionality to LLMs.

## This Implementation
This Directus MCP server implementation exposes various Directus services as tools that can be used by MCP clients. These tools allow AI assistants to:

- Read, create, update, and delete items in collections
- Manage files, folders, and assets
- Work with users, roles, and permissions
- Manage fields and collection schemas
- Send emails
- And more

Each tool follows a consistent pattern where it accepts parameters, performs an operation using the appropriate Directus service, and returns a standardized response.`,
	},

	// Tools overview
	{
		uri: 'mcp://docs/tools/overview',
		mimeType: 'text/markdown',
		name: 'MCP Tools Overview',
		description: 'Overview of the tools available in the Directus MCP server',
		text: `# Directus MCP Tools

The Directus MCP server exposes functionality through a series of tools organized by service areas:

## Collections
Tools for working with collection definitions and metadata.

## Items
Tools for performing CRUD operations on items within collections.

## Files
Tools for managing files and assets.

## Fields
Tools for managing collection fields and schema.

## Users
Tools for user management and authentication.

## Roles
Tools for role management and assignments.

## Permissions
Tools for managing access control permissions.

## Mail
Tools for sending emails and working with templates.

## Folders
Tools for organizing files into folders.

Each tool category contains specific functions for reading, querying, creating, updating, and deleting resources.`,
	},

	// Response formats
	{
		uri: 'mcp://docs/response-formats',
		mimeType: 'text/markdown',
		name: 'Response Formats',
		description: 'Documentation for MCP response formats',
		text: `# MCP Response Formats

All tools in the Directus MCP server follow a consistent response format:

## Success Response
When an operation succeeds, the response will have this format:

\`\`\`json
{
  "content": [
    {
      "type": "json",
      "json": {
        // The actual response data
      }
    }
  ]
}
\`\`\`

For operations that return no data (like deletions), the response will be:

\`\`\`json
{
  "content": [
    {
      "type": "text",
      "text": "Success message"
    }
  ]
}
\`\`\`

## Error Response
When an operation fails, the response will have this format:

\`\`\`json
{
  "content": [
    {
      "type": "error",
      "text": "Error message"
    }
  ]
}
\`\`\`

All errors are logged on the server for troubleshooting.
`,
	},

	// Best practices
	{
		uri: 'mcp://docs/best-practices',
		mimeType: 'text/markdown',
		name: 'MCP Best Practices',
		description: 'Best practices for using the Directus MCP server',
		text: `# Best Practices for Using the Directus MCP Server

## General Guidelines
1. **Start with exploration**: Use get_collections and get_fields to understand the data structure.
2. **Minimize data transfer**: Use filters, limits, and specific field selections when possible.
3. **Error handling**: Always handle potential errors in tool responses.
4. **Pagination**: For large datasets, use limit and offset parameters to paginate results.

## Working with Items
1. **Validate data before creating/updating**: Ensure all required fields are provided.
2. **Use proper filter syntax**: Follow Directus filter syntax for efficient querying.
3. **Handle relationships carefully**: Understand the relationships between collections.

## Working with Files
1. **Check file types**: Verify file types before operations.
2. **Organize with folders**: Use folders to maintain file organization.

## Security Considerations
1. **Respect permissions**: The MCP server respects Directus permissions, so operations are limited by the user's role.
2. **Secure credentials**: Don't expose authentication details.
3. **Validate user input**: Always validate input before passing to tools.

## Performance Tips
1. **Batch operations when possible**: Group related operations.
2. **Cache frequently used data**: Cache results for repeated queries.
3. **Use specific queries**: Request only the data you need.
`,
	},
];

// Resource decorator for Overview resources
export class OverviewResourceDecorator extends MCPResourceHandlerDecorator {
	constructor(handler: IMCPResourceHandler) {
		super(handler, overviewResources);
	}
}

// Export resources array for combining in main resources file if needed
export { overviewResources };