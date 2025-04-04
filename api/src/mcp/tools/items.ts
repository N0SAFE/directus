import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { ItemsService } from '../../services/items.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from "@directus/types";

const logger = useLogger();

// Item tool definitions
const ITEM_TOOLS: Tool[] = [
  {
    name: "read_items",
    description: "Read items from a collection with optional filtering, sorting, and pagination. For query parameter documentation, see mcp://docs/query-parameters. For filter syntax, see mcp://docs/filter-rules. For usage examples, see mcp://docs/tools/items. Related to read_item tool for getting individual items and get_fields tool for field information. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection to read items from" },
        limit: { type: "number", description: "Limit the number of items returned" },
        offset: { type: "number", description: "Offset for pagination" },
        filter: { type: "object", description: "Filter criteria" },
        sort: { type: "string", description: "Sorting criteria (field direction)" },
      },
      required: ["collection"],
    },
  },
  {
    name: "read_item",
    description: "Read a single item from a collection by ID. For usage examples, see mcp://docs/tools/items. Related to read_items tool for retrieving multiple items, update_item for modifying items, and delete_item for removing items. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection to read from" },
        id: { type: "string", description: "ID of the item to read" },
      },
      required: ["collection", "id"],
    },
  },
  {
    name: "create_item",
    description: "Create a new item in a collection. For managing item relationships, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/items. Related to update_item and read_item tools. For field requirements, reference the get_fields tool. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection to create an item in" },
        data: { type: "object", description: "Item data to create" },
      },
      required: ["collection", "data"],
    },
  },
  {
    name: "update_item",
    description: "Update an existing item in a collection. For managing relationship updates, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/items. Related to read_item for retrieving current values and create_item for creating new items. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection containing the item" },
        id: { type: "string", description: "ID of the item to update" },
        data: { type: "object", description: "Updated item data" },
      },
      required: ["collection", "id", "data"],
    },
  },
  {
    name: "delete_item",
    description: "Delete an item from a collection. For understanding how deletion affects relationships, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/items. Related to read_item for checking items before deletion and update_item for modifying instead of deleting. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection containing the item" },
        id: { type: "string", description: "ID of the item to delete" },
      },
      required: ["collection", "id"],
    },
  },
];

// Define params types for better type safety
type ReadItemsParams = {
  collection: string, 
  limit?: number, 
  offset?: number, 
  filter?: any, 
  sort?: string 
};

type ReadItemParams = {
  collection: string,
  id: string
};

type CreateItemParams = {
  collection: string,
  data: any
};

type UpdateItemParams = {
  collection: string,
  id: string,
  data: any
};

type DeleteItemParams = {
  collection: string,
  id: string
};

// Define the tool method map for items
interface ItemToolMethods extends ToolMethodMap {
  read_items: (params: ReadItemsParams) => Promise<any>;
  read_item: (params: ReadItemParams) => Promise<any>;
  create_item: (params: CreateItemParams) => Promise<any>;
  update_item: (params: UpdateItemParams) => Promise<any>;
  delete_item: (params: DeleteItemParams) => Promise<any>;
}

// Decorator for item operations
export class ItemToolsDecorator extends MCPToolHandlerDecorator<ItemToolMethods> {
  constructor(handler: IMCPToolHandler) {
    super(handler, ITEM_TOOLS);
  }

  public override getTools(): Tool[] {
    // Combine existing tools with the item tools
    return [...ITEM_TOOLS, ...super.getTools()];
  }

  // Tool methods with the same name as the tool will be automatically called by the decorator
  async read_items(params: ReadItemsParams) {
    try {
      const itemsService = new ItemsService(params.collection, {
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const query: Query = {};
      if (params.limit !== undefined) query.limit = params.limit;
      if (params.offset !== undefined) query.offset = params.offset;
      if (params.filter !== undefined) query.filter = params.filter;
      if (params.sort !== undefined) query.sort = params.sort.split(',');
      
      const items = await itemsService.readByQuery(query);
      return MCPResponseUtils.createSuccessResponse(items);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error reading items from ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error reading items from ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error reading items from ${params.collection}`);
    }
  }

  async read_item(params: ReadItemParams) {
    try {
      const itemsService = new ItemsService(params.collection, {
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const item = await itemsService.readOne(params.id);
      return MCPResponseUtils.createSuccessResponse(item);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error reading item ${params.id} from ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error reading item ${params.id} from ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error reading item ${params.id} from ${params.collection}`);
    }
  }

  async create_item(params: CreateItemParams) {
    try {
      const itemsService = new ItemsService(params.collection, {
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const key = await itemsService.createOne(params.data);
      const item = await itemsService.readOne(key);
      
      return MCPResponseUtils.createSuccessResponse(item);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating item in ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error creating item in ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error creating item in ${params.collection}`);
    }
  }

  async update_item(params: UpdateItemParams) {
    try {
      const itemsService = new ItemsService(params.collection, {
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await itemsService.updateOne(params.id, params.data);
      const item = await itemsService.readOne(params.id);
      
      return MCPResponseUtils.createSuccessResponse(item);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating item ${params.id} in ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error updating item ${params.id} in ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error updating item ${params.id} in ${params.collection}`);
    }
  }

  async delete_item(params: DeleteItemParams) {
    try {
      const itemsService = new ItemsService(params.collection, {
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await itemsService.deleteOne(params.id);
      
      return {
        content: [{
          type: "text",
          text: `Successfully deleted item ${params.id} from ${params.collection}`
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting item ${params.id} from ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error deleting item ${params.id} from ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error deleting item ${params.id} from ${params.collection}`);
    }
  }
}