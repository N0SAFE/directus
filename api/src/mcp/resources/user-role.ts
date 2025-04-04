import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// User, role, and permission resources
const userRoleResources: Resource[] = [
	// Users tools
	{
		uri: 'mcp://docs/tools/users',
		mimeType: 'text/markdown',
		name: 'Users Tools',
		description: 'Documentation for user management tools',
		text: `# User Management Tools

## get_users
Get a list of users with optional filtering and pagination.

**Parameters**:
- filter: object (Optional - Filter criteria for users)
- limit: number (Optional - Maximum number of users to return)
- offset: number (Optional - Number of users to skip for pagination)
- sort: array (Optional - Sort criteria)

**Returns**: Array of user objects

**Example**:
\`\`\`json
{
  "limit": 10,
  "filter": {
    "role": {
      "_eq": "editor"
    }
  }
}
\`\`\`

## get_user
Get details about a specific user.

**Parameters**:
- id: string (Required - ID of the user to get)

**Returns**: User object

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`

## create_user
Create a new user.

**Parameters**:
- data: object (Required - User data including email, password, role, etc.)

**Returns**: The created user object

**Example**:
\`\`\`json
{
  "data": {
    "email": "user@example.com",
    "password": "password123",
    "role": "editor",
    "first_name": "John",
    "last_name": "Doe"
  }
}
\`\`\`

## update_user
Update an existing user.

**Parameters**:
- id: string (Required - ID of the user to update)
- data: object (Required - User data to update)

**Returns**: The updated user object

**Example**:
\`\`\`json
{
  "id": "123",
  "data": {
    "role": "admin",
    "title": "Chief Editor"
  }
}
\`\`\`

## delete_user
Delete a user.

**Parameters**:
- id: string (Required - ID of the user to delete)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`

## invite_user
Invite a user to the platform.

**Parameters**:
- email: string (Required - Email address of the user to invite)
- role: string (Required - Role ID to assign to the user)
- invite_url: string (Optional - Custom invite URL)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "email": "newuser@example.com",
  "role": "editor"
}
\`\`\`

## get_current_user
Get information about the current user.

**Parameters**: None

**Returns**: Current user object
`,
	},

	// Roles tools
	{
		uri: 'mcp://docs/tools/roles',
		mimeType: 'text/markdown',
		name: 'Roles Tools',
		description: 'Documentation for role management tools',
		text: `# Role Management Tools

## get_roles
Get a list of all roles with optional filtering and pagination.

**Parameters**:
- filter: object (Optional - Filter criteria for roles)
- limit: number (Optional - Maximum number of roles to return)
- offset: number (Optional - Number of roles to skip for pagination)
- sort: array (Optional - Sort criteria)

**Returns**: Array of role objects

**Example**:
\`\`\`json
{
  "limit": 10,
  "filter": {
    "admin_access": {
      "_eq": true
    }
  }
}
\`\`\`

## get_role
Get details about a specific role.

**Parameters**:
- id: string (Required - ID of the role to get)

**Returns**: Role object

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`

## create_role
Create a new role.

**Parameters**:
- data: object (Required - Role data including name, admin_access, app_access, etc.)

**Returns**: The created role object

**Example**:
\`\`\`json
{
  "data": {
    "name": "Content Reviewer",
    "admin_access": false,
    "app_access": true,
    "description": "Can review but not publish content"
  }
}
\`\`\`

## update_role
Update an existing role.

**Parameters**:
- id: string (Required - ID of the role to update)
- data: object (Required - Role data to update)

**Returns**: The updated role object

**Example**:
\`\`\`json
{
  "id": "123",
  "data": {
    "description": "Updated role description",
    "enforce_tfa": true
  }
}
\`\`\`

## delete_role
Delete a role.

**Parameters**:
- id: string (Required - ID of the role to delete)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`
`,
	},

	// Permissions tools
	{
		uri: 'mcp://docs/tools/permissions',
		mimeType: 'text/markdown',
		name: 'Permissions Tools',
		description: 'Documentation for permission management tools',
		text: `# Permission Management Tools

## get_permissions
Get a list of permissions with optional filtering and pagination.

**Parameters**:
- filter: object (Optional - Filter criteria for permissions)
- limit: number (Optional - Maximum number of permissions to return)
- offset: number (Optional - Number of permissions to skip for pagination)
- sort: array (Optional - Sort criteria)

**Returns**: Array of permission objects

**Example**:
\`\`\`json
{
  "filter": {
    "collection": {
      "_eq": "articles"
    }
  }
}
\`\`\`

## get_permission
Get details about a specific permission.

**Parameters**:
- id: string (Required - ID of the permission to get)

**Returns**: Permission object

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`

## create_permission
Create a new permission.

**Parameters**:
- data: object (Required - Permission data including collection, action, role, fields, etc.)

**Returns**: The created permission object

**Example**:
\`\`\`json
{
  "data": {
    "collection": "articles",
    "action": "read",
    "role": "editor",
    "fields": ["id", "title", "content", "status"]
  }
}
\`\`\`

## update_permission
Update an existing permission.

**Parameters**:
- id: string (Required - ID of the permission to update)
- data: object (Required - Permission data to update)

**Returns**: The updated permission object

**Example**:
\`\`\`json
{
  "id": "123",
  "data": {
    "fields": ["id", "title", "content", "status", "author"],
    "validation": {}
  }
}
\`\`\`

## delete_permission
Delete a permission.

**Parameters**:
- id: string (Required - ID of the permission to delete)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`
`,
	},
];

// Resource decorator for User, Role and Permission resources
export class UserRoleResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, userRoleResources);
  }
}

// Export resources array for combining in main resources file if needed
export { userRoleResources };