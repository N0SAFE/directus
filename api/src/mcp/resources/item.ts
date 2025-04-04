import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Item-related documentation resources
const itemResources: Resource[] = [
	// Items tools
	{
		uri: 'mcp://docs/tools/items',
		mimeType: 'text/markdown',
		name: 'Items Tools',
		description: 'Documentation for item management tools',
		text: `# Item Management Tools

## read_items
Read multiple items from a collection with optional filtering, sorting, and pagination.

**Parameters**:
- collection: string (Required - Name of the collection to read items from)
- limit: number (Optional - Maximum number of items to return)
- offset: number (Optional - Number of items to skip for pagination)
- filter: object (Optional - Filter criteria)
- sort: string (Optional - Sorting criteria, comma-separated fields with optional -prefix for descending)

**Returns**: Array of items matching the criteria

**Related Tools**: 
- [read_item](#read_item) - For retrieving a single item by ID
- [create_item](#create_item) - For creating new items
- [update_item](#update_item) - For updating existing items
- [delete_item](#delete_item) - For deleting items

**Related Resources**:
- [Collections Tools](mcp://docs/tools/collections) - For managing the collections that contain items
- [Fields Tools](mcp://docs/tools/fields) - For managing the fields that define item structure
- [Access Control System](mcp://docs/access-control) - For understanding how permissions affect item operations

**Example**:
\`\`\`json
{
  "collection": "articles",
  "limit": 10,
  "offset": 0,
  "filter": {
    "status": {
      "_eq": "published"
    }
  },
  "sort": "date_published,-title"
}
\`\`\`

For more information on filtering options, see [Filter Rules](mcp://docs/filter-rules).

## read_item
Read a single item from a collection by ID.

**Parameters**:
- collection: string (Required - Name of the collection to read from)
- id: string (Required - ID of the item to read)

**Returns**: Single item object

**Related Tools**: 
- [read_items](#read_items) - For retrieving multiple items with filtering
- [update_item](#update_item) - For updating the retrieved item
- [delete_item](#delete_item) - For deleting the retrieved item

**Related Resources**:
- [Collections Tools](mcp://docs/tools/collections) - For managing the collections that contain items
- [Access Control System](mcp://docs/access-control) - For understanding how permissions affect item operations

**Example**:
\`\`\`json
{
  "collection": "articles",
  "id": "123"
}
\`\`\`

## create_item
Create a new item in a collection.

**Parameters**:
- collection: string (Required - Name of the collection to create an item in)
- data: object (Required - Item data to create)

**Returns**: The created item object

**Related Tools**: 
- [read_items](#read_items) - For retrieving multiple items
- [read_item](#read_item) - For retrieving the created item by ID
- [update_item](#update_item) - For updating the created item

**Related Resources**:
- [Collections Tools](mcp://docs/tools/collections) - For managing the collections that contain items
- [Fields Tools](mcp://docs/tools/fields) - For understanding the field structure for the data object
- [Access Control System](mcp://docs/access-control) - For understanding how permissions affect item creation

**Example**:
\`\`\`json
{
  "collection": "articles",
  "data": {
    "title": "New Article",
    "content": "This is the article content",
    "status": "draft"
  }
}
\`\`\`

## update_item
Update an existing item in a collection.

**Parameters**:
- collection: string (Required - Name of the collection containing the item)
- id: string (Required - ID of the item to update)
- data: object (Required - Updated item data)

**Returns**: The updated item object

**Related Tools**: 
- [read_items](#read_items) - For retrieving multiple items
- [read_item](#read_item) - For retrieving the updated item by ID
- [create_item](#create_item) - For creating new items
- [delete_item](#delete_item) - For deleting the item

**Related Resources**:
- [Collections Tools](mcp://docs/tools/collections) - For managing the collections that contain items
- [Fields Tools](mcp://docs/tools/fields) - For understanding the field structure for the data object
- [Access Control System](mcp://docs/access-control) - For understanding how permissions affect item updates

**Example**:
\`\`\`json
{
  "collection": "articles",
  "id": "123",
  "data": {
    "title": "Updated Article Title",
    "status": "published"
  }
}
\`\`\`

## delete_item
Delete an item from a collection.

**Parameters**:
- collection: string (Required - Name of the collection containing the item)
- id: string (Required - ID of the item to delete)

**Returns**: Confirmation message

**Related Tools**: 
- [read_items](#read_items) - For retrieving multiple items
- [read_item](#read_item) - For retrieving an item before deletion
- [create_item](#create_item) - For creating new items to replace deleted ones

**Related Resources**:
- [Collections Tools](mcp://docs/tools/collections) - For managing the collections that contain items
- [Access Control System](mcp://docs/access-control) - For understanding how permissions affect item deletion

**Example**:
\`\`\`json
{
  "collection": "articles",
  "id": "123"
}
\`\`\`
`,
	},
];

// Resource decorator for Item resources
export class ItemResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, itemResources);
  }
}

// Export resources array for combining in main resources file if needed
export { itemResources };