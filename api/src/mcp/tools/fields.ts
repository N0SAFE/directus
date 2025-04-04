import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { FieldsService } from '../../services/fields.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';

const logger = useLogger();

// Field tool definitions
const FIELD_TOOLS: Tool[] = [
  {
    name: "get_fields",
    description: "Get all fields for a collection. For comprehensive documentation on field types and structures, see mcp://docs/data-model/fields. For relationship fields, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/fields. Related to get_collection tool for viewing the collection schema and read_items tool for retrieving actual field values. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection to get fields from" },
      },
      required: ["collection"],
    },
  },
  {
    name: "get_field",
    description: "Get a specific field from a collection. For detailed documentation on field types and configurations, see mcp://docs/data-model/fields. For relationship field details, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/fields. Related to get_fields tool for viewing all fields in a collection and read_items for accessing field values in items. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection" },
        field: { type: "string", description: "Name of the field" },
      },
      required: ["collection", "field"],
    },
  },
  {
    name: "create_field",
    description: "Create a new field in a collection. For detailed information on field types and configurations, see mcp://docs/data-model/fields. For creating relationship fields, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/fields. Related to the update_field and delete_field tools for field management. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection" },
        field: { type: "object", description: "Field configuration object" },
      },
      required: ["collection", "field"],
    },
  },
  {
    name: "update_field",
    description: "Update an existing field in a collection. For detailed information on updatable field properties, see mcp://docs/data-model/fields. For relationship field management, see mcp://docs/data-model/relationships. For usage examples, see mcp://docs/tools/fields. Related to the get_field tool to view current field configuration and create_field tool for creating new fields. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection" },
        field: { type: "string", description: "Current name of the field" },
        data: { type: "object", description: "Updated field configuration" },
      },
      required: ["collection", "field", "data"],
    },
  },
  {
    name: "delete_field",
    description: "Delete a field from a collection. Use with caution when deleting relationship fields - see mcp://docs/data-model/relationships for understanding relationship impacts. For usage examples, see mcp://docs/tools/fields. Related to the update_field tool for modifying fields rather than deleting them. Access is governed by permissions (see mcp://docs/access-control).",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection" },
        field: { type: "string", description: "Name of the field to delete" },
      },
      required: ["collection", "field"],
    },
  },
] satisfies Tool[];

// Define params types for better type safety
type GetFieldsParams = {
  collection: string
};

type GetFieldParams = {
  collection: string,
  field: string
};

type CreateFieldParams = {
  collection: string,
  field: any
};

type UpdateFieldParams = {
  collection: string,
  field: string,
  data: any
};

type DeleteFieldParams = {
  collection: string,
  field: string
};

// Define the tool method map for fields
interface FieldToolMethods extends ToolMethodMap {
  get_fields: (params: GetFieldsParams) => Promise<any>;
  get_field: (params: GetFieldParams) => Promise<any>;
  create_field: (params: CreateFieldParams) => Promise<any>;
  update_field: (params: UpdateFieldParams) => Promise<any>;
  delete_field: (params: DeleteFieldParams) => Promise<any>;
}

// Decorator for field operations
export class FieldToolsDecorator extends MCPToolHandlerDecorator<FieldToolMethods> {
  constructor(handler: IMCPToolHandler) {
    super(handler, FIELD_TOOLS);
  }

  public override getTools(): Tool[] {
    return [...FIELD_TOOLS, ...super.getTools()];
  }

  // Tool methods with the same name as the tool will be automatically called by the decorator
  async get_fields(params: GetFieldsParams) {
    try {
      const fieldsService = new FieldsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const fields = await fieldsService.readAll(params.collection);
      return MCPResponseUtils.createSuccessResponse(fields);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching fields for collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error fetching fields for collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error fetching fields for collection ${params.collection}`);
    }
  }

  async get_field(params: GetFieldParams) {
    try {
      const fieldsService = new FieldsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const field = await fieldsService.readOne(params.collection, params.field);
      return MCPResponseUtils.createSuccessResponse(field);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error fetching field ${params.field} in collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error fetching field ${params.field} in collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(
        error, 
        `Error fetching field ${params.field} in collection ${params.collection}`
      );
    }
  }

  async create_field(params: CreateFieldParams) {
    try {
      const fieldsService = new FieldsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema()
      });
      
      const newField = await fieldsService.createField(params.collection, params.field);
      return MCPResponseUtils.createSuccessResponse(newField);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error creating field in collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error creating field in collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(error, `Error creating field in collection ${params.collection}`);
    }
  }

  async update_field(params: UpdateFieldParams) {
    try {
      const fieldsService = new FieldsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      const updatedField = await fieldsService.updateField(params.collection, params.field, params.data);
      return MCPResponseUtils.createSuccessResponse(updatedField);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error updating field ${params.field} in collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error updating field ${params.field} in collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(
        error, 
        `Error updating field ${params.field} in collection ${params.collection}`
      );
    }
  }

  async delete_field(params: DeleteFieldParams) {
    try {
      const fieldsService = new FieldsService({
        accountability: this.wrappedHandler.getAccountability(),
        schema: this.wrappedHandler.getSchema(),
      });
      
      await fieldsService.deleteField(params.collection, params.field);
      return {
        content: [{
          type: "text",
          text: `Successfully deleted field ${params.field} from collection ${params.collection}`
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`Error deleting field ${params.field} from collection ${params.collection}: ${error.message}`);
      } else {
        logger.error(`Error deleting field ${params.field} from collection ${params.collection}: ${String(error)}`);
      }
      
      return MCPResponseUtils.handleError(
        error, 
        `Error deleting field ${params.field} from collection ${params.collection}`
      );
    }
  }
}