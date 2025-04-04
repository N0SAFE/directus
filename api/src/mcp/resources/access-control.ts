import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Access control related resources
const accessControlResources: Resource[] = [
	// Access Control resource
	{
		uri: 'mcp://docs/access-control',
		mimeType: 'text/markdown',
		name: 'Access Control System',
		description: 'Documentation for Directus access control system and how it affects MCP tool usage',
		text: `# Access Control in Directus

## Overview
Access control is a critical part of managing data in Directus - determining what different users in their various roles should be able to create, read, update, delete, and share. This document explains how the access control system works and how it affects the MCP tools you can use.

## Core Components

### Users
A user is an item in the \`directus_users\` collection, typically representing a person, application, or service that needs access to a Directus project. The currently authenticated user determines what operations are allowed through the MCP server.

### Permissions
A permission is a single access rule for a specific collection and action. The available actions in Directus are:
- create
- read
- update
- delete
- share

Permissions can be set to:
- **All Access**: Complete access to the action
- **No Access**: No access to perform the action
- **Custom Permissions**: Granular rules defining specific access conditions

### Custom Permissions

Custom permissions provide fine-grained control through four components:

1. **Item Permissions**: Filter rules that define which items in a collection a user can access
   \`\`\`json
   {
     "user_created": {
       "_eq": "$CURRENT_USER"
     }
   }
   \`\`\`

2. **Field Permissions**: Define which fields are included in the permission scope
   - Different sets of fields can be specified for different actions
   - E.g., allowing update access only to the "content" field but read access to all fields

3. **Field Validation**: Filter rules to validate field values during create/update operations
   \`\`\`json
   {
     "title": {
       "_ncontains": "forbidden word"
     }
   }
   \`\`\`

4. **Field Presets**: Default field values applied during create/update operations
   \`\`\`json
   {
     "status": "draft",
     "user_created": "$CURRENT_USER"
   }
   \`\`\`

### Policies
Policies are groups of permissions that can be applied to users or roles. They provide a way to organize and reuse sets of permissions.

- Users start with no permissions by default
- Multiple policies can apply to the same user/role
- Policies are additive - they can only add permissions, not remove them

Common policy examples:
- Read Public Data
- Read All Data
- Create and Manage Own Posts
- Delete Any Posts
- Edit All Posts

### Roles
Roles define a user's position within a project. A role can have:
- Any number of policies attributed to it
- Any number of users assigned to it
- Child roles in a hierarchical structure

Special roles:
- **Administrator Role**: Complete unrestricted access to everything
- **Public Role**: Defines permissions for unauthenticated requests

## User Statuses
Only users with "Active" status can authenticate. Other statuses include:
- **Draft**: Incomplete user record
- **Invited**: User with pending invitation
- **Unverified**: Registered but not verified
- **Suspended**: Temporarily disabled
- **Archived**: Soft-deleted user

## How Access Control Affects MCP Tools

### Tool Access
The access control system determines which MCP tools you can use based on your permissions:

1. **Collection tools**: Require appropriate collection-level permissions
   - \`read_collections\` requires admin access or read access to at least one collection
   - \`read_collection\` requires read access to the specified collection

2. **Item tools**: Require corresponding CRUD permissions
   - \`read_items\` requires read permission for the collection
   - \`create_item\` requires create permission
   - \`update_item\` requires update permission
   - \`delete_item\` requires delete permission

3. **User/Role/Permission tools**: Generally require admin access
   - Non-admins can typically only view their own user information

### Data Filtering
When using tools like \`read_items\`, results are automatically filtered based on:
- Item-level permissions (e.g., only returning items created by the current user)
- Field-level permissions (e.g., excluding sensitive fields)

### Data Validation
When using \`create_item\` or \`update_item\`, the data is validated against:
- Field validation rules in your permissions
- Automatic application of field presets

### Conflicting Permissions
When multiple permissions apply to the same collection/action:
- For the API, fields with conflicting permissions are returned as \`null\`
- You must treat \`null\` as both a potential value and an indication of restricted permissions

## Example: Permission-Aware Tool Usage

### Restricted Read Example:
A user with permission to read posts only where \`status = "published"\`:

\`\`\`json
{
  "collection": "posts",
  "filter": {
    "title": {
      "_contains": "search term"
    }
  }
}
\`\`\`

Even though no status filter is explicitly provided, the results will automatically only include published posts due to permission filtering.

### Field-Limited Update Example:
A user with permission to update only the "content" field of their own posts:

\`\`\`json
{
  "collection": "posts",
  "id": "123",
  "data": {
    "title": "New Title",
    "content": "New content"
  }
}
\`\`\`

In this case, only the "content" field would be updated, and the operation would fail if the post with ID "123" wasn't created by the current user.

## Best Practices for MCP Tool Usage with Permissions

1. **Start with minimal data**: Request only what you need to minimize permission issues
2. **Handle null values**: Always handle null values properly as they may indicate permission restrictions
3. **Use filter parameters**: Specify filters explicitly to work with your permission context
4. **Check tool responses**: Always check for errors that may indicate permission issues
5. **Use dynamic variables**: Use \`$CURRENT_USER\`, \`$CURRENT_ROLE\`, etc. in filters to respect the user context

## Additional Resources
For more information on filtering and query parameters that can be used with permission-aware tools:
- [Filter Rules](mcp://docs/filter-rules)
- [Query Parameters](mcp://docs/query-parameters)
`,
	},
];

// Resource decorator for Access Control resources
export class AccessControlResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, accessControlResources);
  }
}

// Export resources array for combining in main resources file if needed
export { accessControlResources };