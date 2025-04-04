import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import { FieldsService } from '../../services/fields.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';

const logger = useLogger();

// Field tool definitions
const FIELD_TOOLS: Tool[] = [
  {
    name: "get_fields",
    description: "Get all fields for a collection",
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
    description: "Get a specific field from a collection",
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
    description: "Create a new field in a collection",
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
    description: "Update an existing field in a collection",
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
    description: "Delete a field from a collection",
    inputSchema: {
      type: "object",
      properties: {
        collection: { type: "string", description: "Name of the collection" },
        field: { type: "string", description: "Name of the field to delete" },
      },
      required: ["collection", "field"],
    },
  },
];

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