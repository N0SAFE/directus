import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { FoldersService } from '../../services/folders.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from "@directus/types";

const logger = useLogger();

// Folder tool definitions
const FOLDER_TOOLS: Tool[] = [
  {
    name: "get_folders",
    description: "Get a list of folders with optional filtering and pagination. For comprehensive documentation on folder management, see mcp://docs/tools/folders. For file management, see the related get_files tool. For filter syntax, see mcp://docs/filter-rules. Related to get_folder tool for retrieving individual folder details. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        filter: { type: "object", description: "Filter criteria for folders" },
        limit: { type: "number", description: "Limit the number of folders returned" },
        offset: { type: "number", description: "Offset for pagination" },
        sort: { type: "array", description: "Sort criteria", items: { type: "string" } },
      },
    },
  },
  {
    name: "get_folder",
    description: "Get details about a specific folder. For comprehensive documentation on folder management, see mcp://docs/tools/folders. Related to get_folders tool for listing multiple folders and create_folder, update_folder, and delete_folder tools for folder management. Files can be organized in folders (see get_files tool). Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the folder to get" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_folder",
    description: "Create a new folder. For comprehensive documentation on folder management, see mcp://docs/tools/folders. Related to update_folder and get_folder tools. Folders can have parent-child relationships for hierarchical organization. Files can be assigned to folders (see get_files tool). Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Name of the folder" },
        parent: { type: "string", description: "Parent folder ID (optional)" },
      },
      required: ["name"],
    },
  },
  {
    name: "update_folder",
    description: "Update an existing folder. For comprehensive documentation on folder management, see mcp://docs/tools/folders. Related to get_folder tool for checking current values and create_folder for creating new folders. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the folder to update" },
        data: { type: "object", description: "Folder data to update" },
      },
      required: ["id", "data"],
    },
  },
  {
    name: "delete_folder",
    description: "Delete a folder. For comprehensive documentation on folder management, see mcp://docs/tools/folders. Related to get_folder tool for checking folders before deletion. When deleting parent folders, be aware of the impact on child folders and contained files. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "string", description: "ID of the folder to delete" },
      },
      required: ["id"],
    },
  },
];

// Define params types for better type safety
type GetFoldersParams = {
  filter?: any, 
  limit?: number, 
  offset?: number, 
  sort?: string[]
};

type GetFolderParams = {
  id: string
};

type CreateFolderParams = {
  name: string, 
  parent?: string
};

type UpdateFolderParams = {
  id: string, 
  data: any
};

type DeleteFolderParams = {
  id: string
};

// Define the tool method map for folders
interface FolderToolMethods extends ToolMethodMap {
  get_folders: (params: GetFoldersParams) => Promise<any>;
  get_folder: (params: GetFolderParams) => Promise<any>;
  create_folder: (params: CreateFolderParams) => Promise<any>;
  update_folder: (params: UpdateFolderParams) => Promise<any>;
  delete_folder: (params: DeleteFolderParams) => Promise<any>;
}

// Decorator for folder operations
export class FolderToolsDecorator extends MCPToolHandlerDecorator<FolderToolMethods> {
  constructor(handler: IMCPToolHandler) {
    super(handler, FOLDER_TOOLS);
  }

  public override getTools(): Tool[] {
    return [...FOLDER_TOOLS, ...super.getTools()];
  }

  // Tool methods with the same name as the tool will be automatically called by the decorator
  async get_folders(params: GetFoldersParams = {}) {
    try {
      const foldersService = new FoldersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const query: Query = {};
      if (params.filter) query.filter = params.filter;
      if (params.limit) query.limit = params.limit;
      if (params.offset) query.offset = params.offset;
      if (params.sort) query.sort = params.sort;
      
      const folders = await foldersService.readByQuery(query);
      return MCPResponseUtils.createSuccessResponse(folders);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching folders: ${error.message}`);
      } else {
        logger.error(`Error fetching folders: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error fetching folders");
    }
  }

  async get_folder(params: GetFolderParams) {
    try {
      const foldersService = new FoldersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const folder = await foldersService.readOne(params.id);
      return MCPResponseUtils.createSuccessResponse(folder);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching folder ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error fetching folder ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error fetching folder ${params.id}`);
    }
  }

  async create_folder(params: CreateFolderParams) {
    try {
      const foldersService = new FoldersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const data: any = { name: params.name };
      if (params.parent) data.parent = params.parent;
      
      const folderId = await foldersService.createOne(data);
      const folder = await foldersService.readOne(folderId);
      
      return MCPResponseUtils.createSuccessResponse(folder);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating folder: ${error.message}`);
      } else {
        logger.error(`Error creating folder: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error creating folder");
    }
  }

  async update_folder(params: UpdateFolderParams) {
    try {
      const foldersService = new FoldersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await foldersService.updateOne(params.id, params.data);
      const folder = await foldersService.readOne(params.id);
      
      return MCPResponseUtils.createSuccessResponse(folder);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating folder ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error updating folder ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error updating folder ${params.id}`);
    }
  }

  async delete_folder(params: DeleteFolderParams) {
    try {
      const foldersService = new FoldersService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await foldersService.deleteOne(params.id);
      
      return {
        content: [{
          type: "text",
          text: `Successfully deleted folder ${params.id}`
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting folder ${params.id}: ${error.message}`);
      } else {
        logger.error(`Error deleting folder ${params.id}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error deleting folder ${params.id}`);
    }
  }
}