import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Collection-related documentation resources
const collectionResources: Resource[] = [
	// Collections tools
	{
		uri: 'mcp://docs/tools/collections',
		mimeType: 'text/markdown',
		name: 'Collections Tools',
		description: 'Documentation for collection management tools',
		text: `# Collection Management Tools

## get_collections
Returns a list of all collections in the Directus instance.

**Parameters**: None

**Returns**: Array of collection objects with metadata

## read_collection
Returns details about a specific collection.

**Parameters**:
- collection: string (Name of the collection to read)

**Returns**: Collection object with metadata

**Example**:
\`\`\`json
{
  "collection": "articles"
}
\`\`\`
`,
	},

	// Fields tools
	{
		uri: 'mcp://docs/tools/fields',
		mimeType: 'text/markdown',
		name: 'Fields Tools',
		description: 'Documentation for field management tools',
		text: `# Field Management Tools

## get_fields
Get all fields for a collection.

**Parameters**:
- collection: string (Required - Name of the collection to get fields from)

**Returns**: Array of field objects with metadata

**Example**:
\`\`\`json
{
  "collection": "articles"
}
\`\`\`

## get_field
Get a specific field from a collection.

**Parameters**:
- collection: string (Required - Name of the collection)
- field: string (Required - Name of the field)

**Returns**: Field object with metadata

**Example**:
\`\`\`json
{
  "collection": "articles",
  "field": "title"
}
\`\`\`

## create_field
Create a new field in a collection.

**Parameters**:
- collection: string (Required - Name of the collection)
- field: object (Required - Field configuration object)

**Returns**: The created field object

**Example**:
\`\`\`json
{
  "collection": "articles",
  "field": {
    "field": "subtitle",
    "type": "string",
    "schema": {
      "is_nullable": true
    },
    "meta": {
      "interface": "input",
      "width": "full"
    }
  }
}
\`\`\`

## update_field
Update an existing field in a collection.

**Parameters**:
- collection: string (Required - Name of the collection)
- field: string (Required - Current name of the field)
- data: object (Required - Updated field configuration)

**Returns**: The updated field object

**Example**:
\`\`\`json
{
  "collection": "articles",
  "field": "subtitle",
  "data": {
    "meta": {
      "width": "half",
      "note": "Secondary headline for the article"
    }
  }
}
\`\`\`

## delete_field
Delete a field from a collection.

**Parameters**:
- collection: string (Required - Name of the collection)
- field: string (Required - Name of the field to delete)

**Returns**: Confirmation message

**Example**:
\`\`\`json
{
  "collection": "articles",
  "field": "subtitle"
}
\`\`\`
`,
	},
];

// Resource decorator for Collection resources
export class CollectionResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, collectionResources);
  }
}

// Export resources array for combining in main resources file if needed
export { collectionResources };