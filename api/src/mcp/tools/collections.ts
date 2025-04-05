import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { CollectionsService } from '../../services/collections.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';

const logger = useLogger();

// Collection tool definitions
const COLLECTION_TOOLS: Tool[] = [
  {
    name: "read_collections",
    description: "Get a list of all collections in the Directus instance. For detailed documentation on collections, see mcp://docs/data-model/collections. For usage examples, see mcp://docs/tools/collections. Related to get_fields tool for viewing fields within collections and read_items tool for accessing collection data. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {},
    }
  },
  {
    name: "get_collection",
    description: "Get details about a specific collection. For comprehensive documentation on collection structure, see mcp://docs/data-model/collections. For usage examples, see mcp://docs/tools/collections. Related to read_collections tool for listing all collections, get_fields tool for viewing fields within this collection, and read_items for accessing items in this collection. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection to read" },
      },
      required: ["collection"],
    },
  },
] satisfies Tool[];

// Define params types for better type safety
type ReadCollectionsParams = Record<string, never>;

type GetCollectionParams = {
  collection: string
};

// Define the tool method map for collections
interface CollectionToolMethods extends ToolMethodMap {
  read_collections: (params: ReadCollectionsParams) => Promise<any>;
  get_collection: (params: GetCollectionParams) => Promise<any>;
}

// Decorator for collection operations
export class CollectionToolsDecorator extends MCPToolHandlerDecorator<CollectionToolMethods> {
  constructor(handler: IMCPToolHandler) {
    super(handler, COLLECTION_TOOLS);
  }

  public override getTools(): Tool[] {
    // Combine existing tools with the collection tools
    return [...COLLECTION_TOOLS, ...super.getTools()];
  }

  // Tool methods with the same name as the tool will be automatically called by the decorator
  async read_collections(params: ReadCollectionsParams) {
    try {
      const collectionsService = new CollectionsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const collections = await collectionsService.readByQuery();
      return MCPResponseUtils.createSuccessResponse(collections);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching collections: ${error.message}`);
      } else {
        logger.error(`Error fetching collections: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, "Error fetching collections");
    }
  }

  async get_collection(params: GetCollectionParams) {
    try {
      const collectionsService = new CollectionsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const collection = await collectionsService.readOne(params.collection);
      return MCPResponseUtils.createSuccessResponse(collection);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error fetching collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error fetching collection ${params.collection}`);
    }
  }
}