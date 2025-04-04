import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { RolesService } from '../../services/roles.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from '@directus/types';

const logger = useLogger();

// Role tool definitions
const ROLE_TOOLS: Tool[] = [
	{
		name: 'get_roles',
		description: 'Get a list of all roles',
		inputSchema: {
			type: 'object',
			properties: {
				filter: { type: 'object', description: 'Filter criteria for roles' },
				limit: { type: 'number', description: 'Limit the number of roles returned' },
				offset: { type: 'number', description: 'Offset for pagination' },
				sort: { type: 'array', description: 'Sort criteria', items: { type: 'string' } },
			},
		},
	},
	{
		name: 'get_role',
		description: 'Get details about a specific role',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the role to get' },
			},
			required: ['id'],
		},
	},
	{
		name: 'create_role',
		description: 'Create a new role',
		inputSchema: {
			type: 'object',
			properties: {
				data: {
					type: 'object',
					description: 'Role data including name, admin_access, app_access, etc.',
				},
			},
			required: ['data'],
		},
	},
	{
		name: 'update_role',
		description: 'Update an existing role',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the role to update' },
				data: { type: 'object', description: 'Role data to update' },
			},
			required: ['id', 'data'],
		},
	},
	{
		name: 'delete_role',
		description: 'Delete a role',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the role to delete' },
			},
			required: ['id'],
		},
	},
];

// Define params types for better type safety
type GetRolesParams = { 
	filter?: any; 
	limit?: number; 
	offset?: number; 
	sort?: string[] 
};

type GetRoleParams = { 
	id: string 
};

type CreateRoleParams = { 
	data: any 
};

type UpdateRoleParams = { 
	id: string; 
	data: any 
};

type DeleteRoleParams = { 
	id: string 
};

// Define the tool method map for roles
interface RoleToolMethods extends ToolMethodMap {
	get_roles: (params: GetRolesParams) => Promise<any>;
	get_role: (params: GetRoleParams) => Promise<any>;
	create_role: (params: CreateRoleParams) => Promise<any>;
	update_role: (params: UpdateRoleParams) => Promise<any>;
	delete_role: (params: DeleteRoleParams) => Promise<any>;
}

// Decorator for role operations
export class RoleToolsDecorator extends MCPToolHandlerDecorator<RoleToolMethods> {
	constructor(handler: IMCPToolHandler) {
		super(handler, ROLE_TOOLS);
	}

	public override getTools(): Tool[] {
		return [...ROLE_TOOLS, ...super.getTools()];
	}

	// Tool methods with the same name as the tool will be automatically called by the decorator
	async get_roles(params: GetRolesParams = {}) {
		try {
			const rolesService = new RolesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const query: Query = {};
			if (params.filter) query.filter = params.filter;
			if (params.limit) query.limit = params.limit;
			if (params.offset) query.offset = params.offset;
			if (params.sort) query.sort = params.sort;

			const roles = await rolesService.readByQuery(query);
			return MCPResponseUtils.createSuccessResponse(roles);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching roles: ${error.message}`);
			} else {
				logger.error(`Error fetching roles: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error fetching roles');
		}
	}

	async get_role(params: GetRoleParams) {
		try {
			const rolesService = new RolesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const role = await rolesService.readOne(params.id);
			return MCPResponseUtils.createSuccessResponse(role);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching role ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error fetching role ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error fetching role ${params.id}`);
		}
	}

	async create_role(params: CreateRoleParams) {
		try {
			const rolesService = new RolesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const roleId = await rolesService.createOne(params.data);
			const role = await rolesService.readOne(roleId);

			return MCPResponseUtils.createSuccessResponse(role);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error creating role: ${error.message}`);
			} else {
				logger.error(`Error creating role: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error creating role');
		}
	}

	async update_role(params: UpdateRoleParams) {
		try {
			const rolesService = new RolesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await rolesService.updateOne(params.id, params.data);
			const role = await rolesService.readOne(params.id);

			return MCPResponseUtils.createSuccessResponse(role);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error updating role ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error updating role ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error updating role ${params.id}`);
		}
	}

	async delete_role(params: DeleteRoleParams) {
		try {
			const rolesService = new RolesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			await rolesService.deleteOne(params.id);

			return {
				content: [
					{
						type: 'text',
						text: `Successfully deleted role ${params.id}`,
					},
				],
			};
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error deleting role ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error deleting role ${params.id}: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, `Error deleting role ${params.id}`);
		}
	}
}
