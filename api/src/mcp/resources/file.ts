import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// File and folder related resources
const fileResources: Resource[] = [
	// Files tools
	{
		uri: 'mcp://docs/tools/files',
		mimeType: 'text/markdown',
		name: 'Files Tools',
		description: 'Documentation for file management tools',
		text: `# File Management Tools

## get_files
Get a list of files in the Directus instance with optional filtering and pagination.

**Parameters**:
- limit: number (Optional - Maximum number of files to return)
- offset: number (Optional - Number of files to skip for pagination)
- filter: object (Optional - Filter criteria)

**Returns**: Array of file objects

**Example**:
\`\`\`json
{
  "limit": 10,
  "offset": 0,
  "filter": {
    "type": {
      "_contains": "image"
    }
  }
}
\`\`\`

## get_file
Get details about a specific file.

**Parameters**:
- id: string (Required - ID of the file to retrieve)

**Returns**: File object with metadata

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`
`,
	},

	// Folders tools
	{
		uri: 'mcp://docs/tools/folders',
		mimeType: 'text/markdown',
		name: 'Folders Tools',
		description: 'Documentation for folder management tools',
		text: `# Folder Management Tools

## get_folders
Get a list of folders with optional filtering and pagination.

**Parameters**:
- filter: object (Optional - Filter criteria for folders)
- limit: number (Optional - Maximum number of folders to return)
- offset: number (Optional - Number of folders to skip for pagination)
- sort: array (Optional - Sort criteria)

**Returns**: Array of folder objects

**Example**:
\`\`\`json
{
  "filter": {
    "parent": {
      "_null": true
    }
  }
}
\`\`\`

## get_folder
Get details about a specific folder.

**Parameters**:
- id: string (Required - ID of the folder to get)

**Returns**: Folder object

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`

## create_folder
Create a new folder.

**Parameters**:
- name: string (Required - Name of the folder)
- parent: string (Optional - Parent folder ID)

**Returns**: The created folder object

**Example**:
\`\`\`json
{
  "name": "Marketing Materials",
  "parent": "456"
}
\`\`\`

## update_folder
Update an existing folder.

**Parameters**:
- id: string (Required - ID of the folder to update)
- data: object (Required - Folder data to update)

**Returns**: The updated folder object

**Example**:
\`\`\`json
{
  "id": "123",
  "data": {
    "name": "Updated Folder Name"
  }
}
\`\`\`

## delete_folder
Delete a folder.

**Parameters**:
- id: string (Required - ID of the folder to delete)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "id": "123"
}
\`\`\`
`,
	},
];

// Resource decorator for File resources
export class FileResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, fileResources);
  }
}

// Export resources array for combining in main resources file if needed
export { fileResources };