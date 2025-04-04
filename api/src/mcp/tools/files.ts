import type { Tool } from '@modelcontextprotocol/sdk/types.js';
import { FilesService } from '../../services/files.js';
import { useLogger } from '../../logger/index.js';
import { type IMCPToolHandler, MCPToolHandlerDecorator, MCPResponseUtils, type ToolMethodMap } from '../base.js';
import type { Query } from '@directus/types';

const logger = useLogger();

// File tool definitions
const FILE_TOOLS: Tool[] = [
	{
		name: 'get_files',
		description: 'Get a list of files in the Directus instance with optional filtering and pagination. For comprehensive documentation on file management, see mcp://docs/tools/files. For folder management, see the related get_folders tool. For filter syntax, see mcp://docs/filter-rules. Related to get_file tool for retrieving individual file details. Access is governed by permissions (see mcp://docs/access-control).',
		inputSchema: {
			type: 'object',
			properties: {
				limit: { type: 'number', description: 'Limit the number of files returned' },
				offset: { type: 'number', description: 'Offset for pagination' },
				filter: { type: 'object', description: 'Filter criteria' },
			},
		},
	},
	{
		name: 'get_file',
		description: 'Get details about a specific file. For comprehensive documentation on file management, see mcp://docs/tools/files. Related to get_files tool for listing multiple files. Files can be organized using folders (see get_folders, create_folder tools). Access is governed by permissions (see mcp://docs/access-control).',
		inputSchema: {
			type: 'object',
			properties: {
				id: { type: 'string', description: 'ID of the file to retrieve' },
			},
			required: ['id'],
		},
	},
];

// Define params types for better type safety
type GetFilesParams = {
	limit?: number;
	offset?: number;
	filter?: any;
};

type GetFileParams = {
	id: string;
};

// Define the tool method map for files
interface FileToolMethods extends ToolMethodMap {
	get_files: (params: GetFilesParams) => Promise<any>;
	get_file: (params: GetFileParams) => Promise<any>;
}

// Decorator for file operations
export class FileToolsDecorator extends MCPToolHandlerDecorator<FileToolMethods> {
	constructor(handler: IMCPToolHandler) {
		super(handler, FILE_TOOLS);
	}

	public override getTools(): Tool[] {
		// Combine existing tools with the file tools
		return [...FILE_TOOLS, ...super.getTools()];
	}

	// Tool methods with the same name as the tool will be automatically called by the decorator
	async get_files(params: GetFilesParams = {}) {
		try {
			const filesService = new FilesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const query: Query = {};
			if (params.limit !== undefined) query.limit = params.limit;
			if (params.offset !== undefined) query.offset = params.offset;
			if (params.filter !== undefined) query.filter = params.filter;

			const files = await filesService.readByQuery(query);
			return MCPResponseUtils.createSuccessResponse(files);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching files: ${error.message}`);
			} else {
				logger.error(`Error fetching files: ${String(error)}`);
			}
			
			return MCPResponseUtils.handleError(error, 'Error fetching files');
		}
	}

	async get_file(params: GetFileParams) {
		try {
			const filesService = new FilesService({
				accountability: this.wrappedHandler.getAccountability(),
				schema: this.wrappedHandler.getSchema(),
			});

			const file = await filesService.readOne(params.id);
			return MCPResponseUtils.createSuccessResponse(file);
		} catch (error) {
			if (error instanceof Error) {
				logger.error(`Error fetching file ${params.id}: ${error.message}`);
			} else {
				logger.error(`Error fetching file ${params.id}: ${String(error)}`);
			}

			return MCPResponseUtils.handleError(error, `Error fetching file ${params.id}`);
		}
	}
}
