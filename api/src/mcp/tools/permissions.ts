import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { PermissionsService } from '../../services/permissions.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from '@directus/types';

const logger = useLogger();

// Permission tool definitions
const PERMISSION_TOOLS: Tool[] = [
	{
		name: 'get_permissions',
		description: 'Get a list of permissions with optional filtering and pagination. For comprehensive documentation on permission management, see mcp://docs/tools/permissions. For understanding the access control system, see mcp://docs/access-control. Related to get_roles and get_users tools. Filter syntax follows standard query parameters (see mcp://docs/query-parameters and mcp://docs/filter-rules).',
		inputSchema: {
			type: 'object',
			properties: {
				filter: { type: 'object', description: 'Filter criteria for permissions' },
				limit: { type: 'number', description: 'Limit the number of permissions returned' },
				offset: { type: 'number', description: 'Offset for pagination' },
				sort: { type: 'array', description: 'Sort criteria', items: { type: 'string' } },
			},
		},
	},
	{
		name: 'get_permission',
		description: 'Get details about a specific permission. For comprehensive documentation on permission management, see mcp://docs/tools/permissions. For understanding the access control system, see mcp://docs/access-control. Related to get_permissions tool for listing multiple permissions and create_permission, update_permission, and delete_permission tools for permission management.',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the permission to get' },
			},
			required: ['id'],
		},
	},
	{
		name: 'create_permission',
		description: 'Create a new permission. For comprehensive documentation on permission management, see mcp://docs/tools/permissions. For understanding the access control system, see mcp://docs/access-control. Related to get_roles tool for role management and read_collections tool for collection information. Permissions control access to collections and their items (see read_items tool).',
		inputSchema: {
			type: 'object',
			properties: {
				data: {
					type: 'object',
					description: 'Permission data including collection, action, role, fields, etc.',
				},
			},
			required: ['data'],
		},
	},
	{
		name: 'update_permission',
		description: 'Update an existing permission. For comprehensive documentation on permission management, see mcp://docs/tools/permissions. For understanding the access control system, see mcp://docs/access-control. Related to get_permission tool for checking current values and create_permission for creating new permissions.',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the permission to update' },
				data: { type: 'object', description: 'Permission data to update' },
			},
			required: ['id', 'data'],
		},
	},
	{
		name: 'delete_permission',
		description: 'Delete a permission. For comprehensive documentation on permission management, see mcp://docs/tools/permissions. For understanding the access control system, see mcp://docs/access-control. Related to get_permission tool for checking permissions before deletion. Removing permissions may affect users with associated roles.',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the permission to delete' },
			},
			required: ['id'],
		},
	},
];

// Define params types for better type safety
type GetPermissionsParams = { 
	filter?: any; 
	limit?: number; 
	offset?: number; 
	sort?: string[] 
};

type GetPermissionParams = { 
	id: string 
};

type CreatePermissionParams = { 
	data: any 
};

type UpdatePermissionParams = { 
	id: string; 
	data: any 
};

type DeletePermissionParams = { 
	id: string 
};

// Define the tool method map for permissions
interface PermissionToolMethods extends ToolMethodMap {
	get_permissions: (params: GetPermissionsParams) => Promise<any>;
	get_permission: (params: GetPermissionParams) => Promise<any>;
	create_permission: (params: CreatePermissionParams) => Promise<any>;
	update_permission: (params: UpdatePermissionParams) => Promise<any>;
	delete_permission: (params: DeletePermissionParams) => Promise<any>;
}

// Decorator for permission operations
export class PermissionToolsDecorator extends MCPToolHandlerDecorator<PermissionToolMethods> {
	constructor(handler: IMCPToolHandler) {
		super(handler, PERMISSION_TOOLS);
	}

	public override getTools(): Tool[] {
		return [...PERMISSION_TOOLS, ...super.getTools()];
	}

	// Tool methods with the same name as the tool will be automatically called by the decorator
	async get_permissions(params: GetPermissionsParams = {}) {
		try {
			const permissionsService = new PermissionsService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const query: Query = {};
			if (params.filter) query.filter = params.filter;
			if (params.limit) query.limit = params.limit;
			if (params.offset) query.offset = params.offset;
			if (params.sort) query.sort = params.sort;

			const permissions = await permissionsService.readByQuery(query);
			return MCPResponseUtils.createSuccessResponse(permissions);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching permissions: ${error.message}`);
			} else {
				logger.error(`Error fetching permissions: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error fetching permissions');
		}
	}

	async get_permission(params: GetPermissionParams) {
		try {
			const permissionsService = new PermissionsService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const permission = await permissionsService.readOne(params.id);
			return MCPResponseUtils.createSuccessResponse(permission);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching permission ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error fetching permission ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error fetching permission ${params.id}`);
		}
	}

	async create_permission(params: CreatePermissionParams) {
		try {
			const permissionsService = new PermissionsService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const permissionId = await permissionsService.createOne(params.data);
			const permission = await permissionsService.readOne(permissionId);

			return MCPResponseUtils.createSuccessResponse(permission);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error creating permission: ${error.message}`);
			} else {
				logger.error(`Error creating permission: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error creating permission');
		}
	}

	async update_permission(params: UpdatePermissionParams) {
		try {
			const permissionsService = new PermissionsService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await permissionsService.updateOne(params.id, params.data);
			const permission = await permissionsService.readOne(params.id);

			return MCPResponseUtils.createSuccessResponse(permission);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error updating permission ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error updating permission ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error updating permission ${params.id}`);
		}
	}

	async delete_permission(params: DeletePermissionParams) {
		try {
			const permissionsService = new PermissionsService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await permissionsService.deleteOne(params.id);

			return {
				content: [
					{
						type: 'text',
						text: `Successfully deleted permission ${params.id}`,
					},
				],
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error deleting permission ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error deleting permission ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error deleting permission ${params.id}`);
		}
	}
}
