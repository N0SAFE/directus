import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { UsersService } from '../../services/users.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from '@directus/types';

const logger = useLogger();

// User tool definitions
const USER_TOOLS: Tool[] = [
  {
    name: "get_users",
    description: "Get a list of users. For more information about user management, see mcp://docs/user-role and mcp://docs/access-control. Related to get_roles and get_permissions tools for understanding user access control.",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for users. See mcp://docs/query for filter syntax." },
        limit: { type: "number", description: "Limit the number of users returned" },
        offset: { type: "number", description: "Offset for pagination" },
        sort: { type: "array", description: "Sort criteria", items: { type: "string" } },
      },
    },
  },
  {
    name: "get_user",
    description: "Get details about a specific user. For more information about user data structure, see mcp://docs/user-role. Related to get_role tool for understanding user's role assignments.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the user to get" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_user",
    description: "Create a new user. For more information about user creation process, see mcp://docs/user-role. Related to create_role and assign_role tools for setting up proper user access.",
    inputSchema: {
      type: "object",
      properties: {
        data: { 
          type: "object", 
          description: "User data including email, password, role, etc. See mcp://docs/user-role for required fields.", 
        },
      },
      required: ["data"],
    },
  },
  {
    name: "update_user",
    description: "Update an existing user. For more information about user properties, see mcp://docs/user-role. Related to update_role and update_permissions tools for managing user access control.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the user to update" },
        data: { type: "object", description: "User data to update. See mcp://docs/user-role for possible fields." },
      },
      required: ["id", "data"],
    },
  },
  {
    name: "delete_user",
    description: "Delete a user. For more information about user lifecycle management, see mcp://docs/user-role. Related to delete_role and delete_permission tools for cleanup operations.",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the user to delete" },
      },
      required: ["id"],
    },
  },
  {
    name: "invite_user",
    description: "Invite a user to the platform. For more information about user invitation workflow, see mcp://docs/user-role. Related to mail tools (send_mail) for understanding invitation emails.",
    inputSchema: {
      type: "object",
      properties: {
        email: { type: "string", description: "Email address of the user to invite" },
        role: { type: "string", description: "Role ID to assign to the user. See get_roles tool to list available roles." },
        invite_url: { type: "string", description: "Custom invite URL (optional)" },
      },
      required: ["email", "role"],
    },
  },
  {
    name: "get_current_user",
    description: "Get information about the current user. For more information about authentication and current user context, see mcp://docs/access-control. Related to the authentication system described in mcp://docs/authentication.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
];

// Define params types for better type safety
type GetUsersParams = { 
  filter?: any; 
  limit?: number; 
  offset?: number; 
  sort?: string[] 
};

type GetUserParams = { 
  id: string 
};

type CreateUserParams = { 
  data: any 
};

type UpdateUserParams = { 
  id: string; 
  data: any 
};

type DeleteUserParams = { 
  id: string 
};

type InviteUserParams = { 
  email: string; 
  role: string; 
  invite_url?: string 
};

// Empty params for get_current_user
type GetCurrentUserParams = Record<string, never>;

// Define the tool method map for users
interface UserToolMethods extends ToolMethodMap {
  get_users: (params: GetUsersParams) => Promise<any>;
  get_user: (params: GetUserParams) => Promise<any>;
  create_user: (params: CreateUserParams) => Promise<any>;
  update_user: (params: UpdateUserParams) => Promise<any>;
  delete_user: (params: DeleteUserParams) => Promise<any>;
  invite_user: (params: InviteUserParams) => Promise<any>;
  get_current_user: (params: GetCurrentUserParams) => Promise<any>;
}

// Decorator for user operations
export class UserToolsDecorator extends MCPToolHandlerDecorator<UserToolMethods> {
  constructor(handler: IMCPToolHandler) {
    super(handler, USER_TOOLS);
  }

  public override getTools(): Tool[] {
    return [...USER_TOOLS, ...super.getTools()];
  }

  // Tool methods with the same name as the tool will be automatically called by the decorator
  async get_users(params: GetUsersParams = {}) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const query: Query = {};
      if (params.filter) query.filter = params.filter;
      if (params.limit) query.limit = params.limit;
      if (params.offset) query.offset = params.offset;
      if (params.sort) query.sort = params.sort;
      
      const users = await usersService.readByQuery(query);
      return MCPResponseUtils.createSuccessResponse(users);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching users: ${error.message}`);
      } else {
        logger.error(`Error fetching users: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error fetching users");
    }
  }

  async get_user(params: GetUserParams) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const user = await usersService.readOne(params.id);
      return MCPResponseUtils.createSuccessResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching user ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error fetching user ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error fetching user ${params.id}`);
    }
  }

  async create_user(params: CreateUserParams) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const userId = await usersService.createOne(params.data);
      const user = await usersService.readOne(userId);
      
      return MCPResponseUtils.createSuccessResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating user: ${error.message}`);
      } else {
        logger.error(`Error creating user: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error creating user");
    }
  }

  async update_user(params: UpdateUserParams) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await usersService.updateOne(params.id, params.data);
      const user = await usersService.readOne(params.id);
      
      return MCPResponseUtils.createSuccessResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating user ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error updating user ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error updating user ${params.id}`);
    }
  }

  async delete_user(params: DeleteUserParams) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await usersService.deleteOne(params.id);
      
      return {
        content: [{
          type: "text",
          text: `Successfully deleted user ${params.id}`
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting user ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error deleting user ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error deleting user ${params.id}`);
    }
  }

  async invite_user(params: InviteUserParams) {
    try {
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await usersService.inviteUser(params.email, params.role, params.invite_url ?? null);
      
      return {
        content: [{
          type: "text",
          text: `Successfully invited user ${params.email} with role ${params.role}`
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error inviting user ${params.email}: ${error.message}`);
      } else {
        logger.error(`Error inviting user ${params.email}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error inviting user ${params.email}`);
    }
  }

  async get_current_user(params: GetCurrentUserParams) {
    try {
      const accountability = this.wrappedHandler.getAccountability();
      
      if (!accountability?.user) {
        return MCPResponseUtils.createErrorResponse("No user is currently authenticated");
      }
      
      const usersService = new UsersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const user = await usersService.readOne(accountability.user);
      return MCPResponseUtils.createSuccessResponse(user);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching current user: ${error.message}`);
      } else {
        logger.error(`Error fetching current user: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error fetching current user");
    }
  }
}