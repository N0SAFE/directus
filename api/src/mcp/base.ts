import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import type { Accountability, SchemaOverview } from '@directus/types';

export type ResourceContent =
	| {
			text: string;
	  }
	| {
			blob: string;
	  };

export type ResourceURI =
	| {
			uri: string;
	  }
	| {
			uriTemplate: string;
	  };

export type ResourceBase = {
	name: string; // Human-readable name for this type
	description?: string; // Optional description
	mimeType?: string; // Optional MIME type for all matching resources
};

export type Resource = ResourceBase & ResourceURI & ResourceContent;

export type ListResource = ResourceURI & ResourceBase;

export type ReadResource = {
	uri: string;
	mimeType?: string;
} & ResourceContent;

// Type for mapping tool names to handler methods
export type ToolMethodMap = {
  [toolName: string]: (params: any) => Promise<any>;
};

// Type for decorator constructors to be used with decorate method
export type ToolDecoratorConstructor<T extends IMCPToolHandler = IMCPToolHandler> = new (handler: IMCPToolHandler) => T;
export type ResourceDecoratorConstructor<T extends IMCPResourceHandler = IMCPResourceHandler> = new (handler: IMCPResourceHandler) => T;

// Interface for tool handlers
export interface IMCPToolHandler {
  getTools(): Tool[];
  handleToolCall(toolName: string, params: unknown): Promise<any>;
  getAccountability(): Accountability;
  getSchema(): SchemaOverview;
  decorate<T extends IMCPToolHandler>(decorators: ToolDecoratorConstructor<T>[]): IMCPToolHandler;
}

// Interface for resource handlers
export interface IMCPResourceHandler {
  listResources(): ListResource[];
  getResources(): Resource[];
  handleResourceCall(uri: string): Promise<any>;
  getAccountability(): Accountability;
  getSchema(): SchemaOverview;
  decorate<T extends IMCPResourceHandler>(decorators: ResourceDecoratorConstructor<T>[]): IMCPResourceHandler;
}

// Base handler with common functionality
export class BaseMCPHandler {
	constructor(protected accountability: Accountability, protected schema: SchemaOverview) {
		this.accountability = accountability;
		this.schema = schema;
	}

	public getAccountability(): Accountability {
		return this.accountability;
	}

	public getSchema(): SchemaOverview {
		return this.schema;
	}
}

// Base component that will be decorated
export class BaseMCPToolHandler extends BaseMCPHandler implements IMCPToolHandler {
	protected tools: Tool[];

	constructor(accountability: Accountability, schema: SchemaOverview, defaultTools: Tool[] = []) {
		super(accountability, schema);
		this.tools = defaultTools;
	}

	public getTools(): Tool[] {
		return this.tools;
	}

	public async handleToolCall(toolName: string, params: unknown): Promise<any> {
		throw new Error(`Tool ${toolName} not implemented in base handler: ${String(params)}`);
	}

	/**
	 * Decorates the current handler with the provided decorators
	 * @param decorators Array of decorator constructors to apply
	 * @returns Decorated handler
	 */
	public decorate<T extends IMCPToolHandler>(decorators: NoInfer<ToolDecoratorConstructor<T>[]>): IMCPToolHandler {
		if (decorators.length === 0) {
			return this;
		}
		
		if (decorators.length === 1) {
			return new decorators[0]!(this);
		}
		
		let handler: IMCPToolHandler = new (decorators.shift()!)(this);
		
		for (const Decorator of decorators) {
			handler = new Decorator(handler);
		}
		
		return handler;
	}
}

// Abstract decorator class following the decorator pattern
export abstract class MCPToolHandlerDecorator<
  TToolMethods extends ToolMethodMap = ToolMethodMap
> extends BaseMCPToolHandler implements IMCPToolHandler {
	constructor(protected wrappedHandler: IMCPToolHandler, tools: Tool[] = []) {
		super(wrappedHandler.getAccountability(), wrappedHandler.getSchema(), tools);
		this.wrappedHandler = wrappedHandler;
	}
	
	public override getTools(): Tool[] {
		return [...this.tools, ...this.wrappedHandler.getTools()];
	}
	
	public override async handleToolCall(toolName: string, params: unknown): Promise<any> {
		// First check if this decorator handles the tool
		const tool = this.tools.find(t => t.name === toolName);
		
		if (tool) {
			// Check if there's a matching method on this class
			const methodName = toolName as keyof TToolMethods;
			const method = (this as any)[methodName] as ((params: unknown) => Promise<any>);
			
			if (typeof method === 'function') {
				return method.call(this, params);
			}
		}
		
		// If no matching method found, delegate to the wrapped handler
		return this.wrappedHandler.handleToolCall(toolName, params);
	}

	/**
	 * Decorates the current handler with the provided decorators
	 * @param decorators Array of decorator constructors to apply
	 * @returns Decorated handler
	 */
	public override decorate<T extends IMCPToolHandler>(decorators: NoInfer<ToolDecoratorConstructor<T>[]>): IMCPToolHandler {
		if (decorators.length === 0) {
			return this;
		}
		
		if (decorators.length === 1) {
			return new decorators[0]!(this);
		}
		
		let handler: IMCPToolHandler = new (decorators.shift()!)(this);
		
		for (const Decorator of decorators) {
			handler = new Decorator(handler);
		}
		
		return handler;
	}
}

// Base component that will be decorated
export class BaseMCPResourceHandler extends BaseMCPHandler implements IMCPResourceHandler {
	protected resources: Resource[];

	constructor(
		accountability: Accountability,
		schema: SchemaOverview,
		defaultResources: Resource[] = [],
	) {
		super(accountability, schema);
		this.resources = defaultResources;
	}

	public static resourceToRead(uri: string, resource: Resource): ReadResource {
		return {
			uri,
			mimeType: resource.mimeType!,
			blob: 'blob' in resource ? resource.blob : '',
			text: 'text' in resource ? resource.text : '',
		};
	}

	public static resourceToList(uri: string, resource: Resource): ListResource {
		return {
			uri: uri,
			name: resource.name!,
			description: resource.description!,
			mimeType: resource.mimeType!,
		};
	}

	public listResources(): ListResource[] {
		return this.resources.map((resource) =>
			BaseMCPResourceHandler.resourceToList('uri' in resource ? resource.uri : resource.uriTemplate, resource),
		);
	}

	public getResources(): Resource[] {
		return this.resources;
	}

	protected getResource(uri: string): Resource {
		const resource = this.getResources().find((r) => 'uri' in r && r.uri === uri);

		if (!resource) {
			throw MCPResponseUtils.createErrorResponse(`Resource with URI ${uri} not found`);
		}

		return resource;
	}

	public handleResourceCall(uri: string): Promise<any> {
		throw new Error(`Resource ${uri} not implemented in base handler`);
	}

	/**
	 * Decorates the current handler with the provided decorators
	 * @param decorators Array of decorator constructors to apply
	 * @returns Decorated handler
	 */
	public decorate<T extends IMCPResourceHandler>(decorators: NoInfer<ResourceDecoratorConstructor<T>[]>): IMCPResourceHandler {
		if (decorators.length === 0) {
			return this;
		}
		
		if (decorators.length === 1) {
			return new decorators[0]!(this);
		}
		
		let handler: IMCPResourceHandler = new (decorators.shift()!)(this);
		
		for (const Decorator of decorators) {
			handler = new Decorator(handler);
		}
		
		return handler;
	}
}

// Type for mapping resource URIs to handler methods
export type ResourceMethodMap = {
  [uri: string]: () => Promise<any>;
};

// Abstract decorator class for MCPResourceHandler
export abstract class MCPResourceHandlerDecorator<
  TResourceMethods extends ResourceMethodMap = ResourceMethodMap
> extends BaseMCPResourceHandler implements IMCPResourceHandler {
	constructor(
		protected wrappedHandler: IMCPResourceHandler,
		resources: Resource[] = [],
	) {
		super(wrappedHandler.getAccountability(), wrappedHandler.getSchema(), resources);
		this.wrappedHandler = wrappedHandler;
	}

	public override listResources(): ListResource[] {
		return [...this.resources.map((resource) =>
			BaseMCPResourceHandler.resourceToList('uri' in resource ? resource.uri : resource.uriTemplate, resource)
		), ...this.wrappedHandler.listResources()];
	}

	public override getResources(): Resource[] {
		return [...this.resources, ...this.wrappedHandler.getResources()];
	}

	public override async handleResourceCall(uri: string): Promise<any> {
		// First check if this decorator has the resource
		const hasResource = this.resources.some(r => 'uri' in r && r.uri === uri);
		
		if (hasResource) {
			// Check if there's a matching method on this class
			// Convert URI to a valid method name
			const methodName = uri.replace(/[^\w]/g, '_') as keyof TResourceMethods;
			const method = (this as any)[methodName] as (() => Promise<any>);
			
			if (typeof method === 'function') {
				return method.call(this);
			}
			
			// If resource exists but no method, return the resource content
			const resource = this.resources.find(r => 'uri' in r && r.uri === uri);
			
			if (resource) {
				return {
					content: [
						{
							type: resource.mimeType?.split('/')[0] || 'text',
							text: 'text' in resource ? resource.text : '',
							blob: 'blob' in resource ? resource.blob : '',
						},
					],
				};
			}
		}
		
		// If no matching resource found, delegate to the wrapped handler
		return this.wrappedHandler.handleResourceCall(uri);
	}

	/**
	 * Decorates the current handler with the provided decorators
	 * @param decorators Array of decorator constructors to apply
	 * @returns Decorated handler
	 */
	public override decorate<T extends IMCPResourceHandler>(decorators: NoInfer<ResourceDecoratorConstructor<T>[]>): IMCPResourceHandler {
		if (decorators.length === 0) {
			return this;
		}
		
		if (decorators.length === 1) {
			return new decorators[0]!(this);
		}
		
		let handler: IMCPResourceHandler = new (decorators.shift()!)(this);
		
		for (const Decorator of decorators) {
			handler = new Decorator(handler);
		}
		
		return handler;
	}
}

// Utility class for standardized response handling
export class MCPResponseUtils {
	public static createSuccessResponse(data: any) {
		return {
			content: [
				{
					type: 'text',
					text: JSON.stringify(data, null, 2),
				},
			],
		};
	}

	public static createErrorResponse(message: string) {
		return {
			isError: true,
			content: [
				{
					type: 'text',
					text: message,
				},
			],
		};
	}

	public static handleError(error: unknown, fallbackMessage: string) {
		if (error instanceof Error) {
			return MCPResponseUtils.createErrorResponse(error.message);
		} else {
			return MCPResponseUtils.createErrorResponse(fallbackMessage);
		}
	}
}
