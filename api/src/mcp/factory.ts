import type { Accountability, SchemaOverview } from '@directus/types';
import { 
  BaseMCPResourceHandler, 
  BaseMCPToolHandler, 
  MCPResponseUtils, 
  type IMCPToolHandler, 
  type IMCPResourceHandler,
  type ToolDecoratorConstructor,
  type ResourceDecoratorConstructor
} from './base.js';
import { CollectionToolsDecorator } from './tools/collections.js';
import { ItemToolsDecorator } from './tools/items.js';
import { FileToolsDecorator } from './tools/files.js';
import { FieldToolsDecorator } from './tools/fields.js';
import { UserToolsDecorator } from './tools/users.js';
import { RoleToolsDecorator } from './tools/roles.js';
import { PermissionToolsDecorator } from './tools/permissions.js';
import { MailToolsDecorator } from './tools/mail.js';
import { FolderToolsDecorator } from './tools/folders.js';
import { AccessControlResourceDecorator } from './resources/access-control.js';
import { CollectionResourceDecorator } from './resources/collection.js';
import { FileResourceDecorator } from './resources/file.js';
import { ItemResourceDecorator } from './resources/item.js';
import { MailResourceDecorator } from './resources/mail.js';
import { OverviewResourceDecorator } from './resources/overview.js';
import { QueryResourceDecorator } from './resources/query.js';
import { UserRoleResourceDecorator } from './resources/user-role.js';
import { RelationalDataResourceDecorator } from './resources/relational-data.js';
import { ErrorHandlingResourceDecorator } from './resources/error-handling.js';
import { DataModelResourceDecorator } from './resources/data-model.js';

/**
 * Concrete implementation of the base handler 
 * This is the innermost component of the decorator pattern
 */
export class CoreMCPToolHandler extends BaseMCPToolHandler {
  constructor(accountability: Accountability, schema: SchemaOverview) {
    super(accountability, schema, []);
  }

  public override async handleToolCall(toolName: string): Promise<any> {
    // This is the fallback handler for any tools not handled by other decorators
    return MCPResponseUtils.createErrorResponse(`Tool "${toolName}" not implemented`);
  }
}

/**
 * Factory to create a fully decorated MCP tool handler with all available decorators
 */
export function createFullyDecoratedToolHandler(accountability: Accountability, schema: SchemaOverview): IMCPToolHandler {
  // Create the base handler and decorate it with all available decorators
  return new CoreMCPToolHandler(accountability, schema).decorate([
    CollectionToolsDecorator,
    ItemToolsDecorator,
    FileToolsDecorator,
    FieldToolsDecorator,
    UserToolsDecorator,
    RoleToolsDecorator,
    PermissionToolsDecorator,
    MailToolsDecorator,
    FolderToolsDecorator
  ]);
}

/**
 * Factory to create a custom decorated MCP tool handler with selected decorators
 */
export function createCustomToolHandler(
  accountability: Accountability, 
  schema: SchemaOverview,
  options: {
    useCollections?: boolean;
    useItems?: boolean;
    useFiles?: boolean;
    useFields?: boolean;
    useUsers?: boolean;
    useRoles?: boolean;
    usePermissions?: boolean;
    useMail?: boolean;
    useFolders?: boolean;
  } = {
    useCollections: true,
    useItems: true,
    useFiles: true,
    useFields: true,
    useUsers: true,
    useRoles: true,
    usePermissions: true,
    useMail: true,
    useFolders: true
  }
): IMCPToolHandler {
  // Create the base handler
  const handler = new CoreMCPToolHandler(accountability, schema);
  const decorators: ToolDecoratorConstructor[] = [];
  
  // Add decorators based on options
  if (options.useCollections) decorators.push(CollectionToolsDecorator);
  if (options.useItems) decorators.push(ItemToolsDecorator);
  if (options.useFiles) decorators.push(FileToolsDecorator);
  if (options.useFields) decorators.push(FieldToolsDecorator);
  if (options.useUsers) decorators.push(UserToolsDecorator);
  if (options.useRoles) decorators.push(RoleToolsDecorator);
  if (options.usePermissions) decorators.push(PermissionToolsDecorator);
  if (options.useMail) decorators.push(MailToolsDecorator);
  if (options.useFolders) decorators.push(FolderToolsDecorator);
  
  // Apply all selected decorators at once
  return handler.decorate(decorators);
}

export class CoreMCPResourceHandler extends BaseMCPResourceHandler {
  constructor(accountability: Accountability, schema: SchemaOverview) {
    super(accountability, schema, []);
  }

  public override async handleResourceCall(resourceName: string): Promise<any> {
    // This is the fallback handler for any resources not handled by other decorators
    return MCPResponseUtils.createErrorResponse(`Resource "${resourceName}" not implemented`);
  }
}

/**
 * Factory to create a fully decorated MCP resource handler with all available decorators
 */
export function createFullyDecoratedResourceHandler(accountability: Accountability, schema: SchemaOverview): IMCPResourceHandler {
  // Create the base handler and decorate it with all available resource decorators
  return new CoreMCPResourceHandler(accountability, schema).decorate([
    OverviewResourceDecorator,
    CollectionResourceDecorator,
    ItemResourceDecorator,
    UserRoleResourceDecorator,
    FileResourceDecorator,
    MailResourceDecorator,
    AccessControlResourceDecorator,
    QueryResourceDecorator,
    RelationalDataResourceDecorator,
    ErrorHandlingResourceDecorator,
    DataModelResourceDecorator
  ]);
}

/**
 * Factory to create a custom decorated MCP resource handler with selected decorators
 */
export function createCustomResourceHandler(
  accountability: Accountability, 
  schema: SchemaOverview,
  options: {
    useOverview?: boolean;
    useCollections?: boolean;
    useItems?: boolean;
    useUserRole?: boolean;
    useFiles?: boolean;
    useMail?: boolean;
    useAccessControl?: boolean;
    useQueries?: boolean;
    useRelationalData?: boolean;
    useErrorHandling?: boolean;
    useDataModel?: boolean;
  } = {
    useOverview: true,
    useCollections: true,
    useItems: true,
    useUserRole: true,
    useFiles: true,
    useMail: true,
    useAccessControl: true,
    useQueries: true,
    useRelationalData: true,
    useErrorHandling: true,
    useDataModel: true
  }
): IMCPResourceHandler {
  // Create the base handler
  const handler = new CoreMCPResourceHandler(accountability, schema);
  const decorators: ResourceDecoratorConstructor[] = [];
  
  // Add decorators based on options
  if (options.useOverview) decorators.push(OverviewResourceDecorator);
  if (options.useCollections) decorators.push(CollectionResourceDecorator);
  if (options.useItems) decorators.push(ItemResourceDecorator);
  if (options.useUserRole) decorators.push(UserRoleResourceDecorator);
  if (options.useFiles) decorators.push(FileResourceDecorator);
  if (options.useMail) decorators.push(MailResourceDecorator);
  if (options.useAccessControl) decorators.push(AccessControlResourceDecorator);
  if (options.useQueries) decorators.push(QueryResourceDecorator);
  if (options.useRelationalData) decorators.push(RelationalDataResourceDecorator);
  if (options.useErrorHandling) decorators.push(ErrorHandlingResourceDecorator);
  if (options.useDataModel) decorators.push(DataModelResourceDecorator);
  
  // Apply all selected decorators at once
  return handler.decorate(decorators);
}