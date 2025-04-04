import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Query-related resources
const queryResources: Resource[] = [
	// Query Parameters
	{
		uri: 'mcp://docs/query-parameters',
		mimeType: 'text/markdown',
		name: 'Query Parameters',
		description: 'Documentation for Directus query parameters',
		text: `# Directus Query Parameters

Most Directus API endpoints can use global query parameters to customize the data that is returned. These parameters are available in the \`read_items\` tool and other tools that support querying.

*Related tools:* [read_items](mcp://docs/tools/items), [get_files](mcp://docs/tools/files), [get_folders](mcp://docs/tools/folders)

*Related resources:* [Filter Rules](mcp://docs/filter-rules), [Access Control](mcp://docs/access-control)

## Fields
Specify which fields are returned. This parameter also supports dot notation to request nested relational fields, and wildcards (*) to include all fields at a specific depth.

**Examples**:
- \`fields=first_name,last_name\` - Return only the first_name and last_name fields
- \`fields=title,author.name\` - Return title and the related author item's name field
- \`fields=*\` - Return all fields
- \`fields=*.*\` - Return all fields and all immediately related fields
- \`fields=*,images.*\` - Return all fields and all fields within the images relationship

**Note on performance**: While wildcards are very useful, it's recommended to only request specific fields in production. This speeds up the request and reduces the output size.

### Many to Any Fields
For Many to Any (M2A) fields with nested data from multiple collections, use this syntax to specify fields from specific related collections:

\`fields=m2a-field:collection-scope.field\`

**Example**:
In a posts collection with a Many to Any field called 'sections' that points to headings, paragraphs, and videos:

\`\`\`
fields[]=title
fields[]=sections.item:headings.title
fields[]=sections.item:headings.level
fields[]=sections.item:paragraphs.body
fields[]=sections.item:videos.source
\`\`\`

## Filter
Specify which items are returned based on filter rules. 

**Syntax**:
\`\`\`json
{
  "field": {
    "operator": "value"
  }
}
\`\`\`

**Example**:
\`\`\`json
{
  "filter": {
    "title": {
      "_eq": "Hello World"
    }
  }
}
\`\`\`

See the detailed [Filter Rules](mcp://docs/filter-rules) documentation for more information on available operators and advanced filtering.

## Search
Search on all string and text type fields within a collection. It's a convenient way to search without complex filters, though less optimized.

**Example**:
\`search=Directus\`

## Sort
Specify which fields to sort results by. Sorting defaults to ascending, but appending a - reverses this. Fields are prioritized by their order.

**Example**:
\`sort=date_created,-title,author.name\`

## Limit
Set the maximum number of items to return. The default limit is 100. Use -1 to return all items (subject to server configuration).

**Example**:
\`limit=50\`

**Note on performance**: Large limits can result in degraded performance or timeouts.

## Offset
Skip the specified number of items in the response. Used for pagination.

**Example**:
\`offset=100\`

## Page
An alternative to offset for pagination. Page 1 is the first page.

**Example**:
\`page=2\`

## Aggregate
Perform calculations on a set of values, returning a single result.

**Available Functions**:
- count - Counts how many items there are
- countDistinct - Counts how many unique items there are
- sum - Adds together the values in the given field
- sumDistinct - Adds together the unique values in the given field
- avg - Get the average value of the given field
- avgDistinct - Get the average value of the unique values in the given field
- min - Return the lowest value in the field
- max - Return the highest value in the field

**Example**:
\`aggregate[count]=*\`

## GroupBy
Group aggregate functions based on a shared value. You can group by multiple fields simultaneously.

**Example**:
\`\`\`
aggregate[count]=views,comments
groupBy[]=author
groupBy[]=year(publish_date)
\`\`\`

## Deep
Apply query parameters on nested relational datasets. The nested parameters are prefixed with an underscore.

**Example**:
\`\`\`json
{
  "deep": {
    "related_posts": {
      "_limit": 3,
      "_filter": {
        "status": {
          "_eq": "published"
        }
      }
    }
  }
}
\`\`\`

## Alias
Rename fields for the request, and fetch the same nested data multiple times with different filters.

**Example**:
\`\`\`
alias[all_translations]=translations
alias[dutch_translations]=translations
deep[dutch_translations][_filter][code][_eq]=nl-NL
\`\`\`

## Functions
Functions accept a field and return a modified value. They can be used in field selection, aggregation, and filters.

**Syntax**: \`function(field)\`

**Available Functions**:
- year - Extract the year from a datetime field
- month - Extract the month from a datetime field
- week - Extract the week from a datetime field
- day - Extract the day from a datetime field
- weekday - Extract the weekday from a datetime field
- hour - Extract the hour from a datetime field
- minute - Extract the minute from a datetime field
- second - Extract the second from a datetime field
- count - Extract the number of items from a JSON array or relational field

**Example**:
\`\`\`json
{
  "filter": {
    "year(date_published)": {
      "_eq": 2023
    }
  }
}
\`\`\`
`,
	},

	// Filter Rules
	{
		uri: 'mcp://docs/filter-rules',
		mimeType: 'text/markdown',
		name: 'Filter Rules',
		description: 'Documentation for Directus filter rules',
		text: `# Directus Filter Rules

Filters are used throughout Directus to query specific data. They have a consistent syntax and a rich set of operators.

*Related tools:* [read_items](mcp://docs/tools/items), [get_files](mcp://docs/tools/files), [get_folders](mcp://docs/tools/folders), [get_users](mcp://docs/tools/users), [get_permissions](mcp://docs/tools/permissions), [get_roles](mcp://docs/tools/roles)

*Related resources:* [Query Parameters](mcp://docs/query-parameters), [Access Control](mcp://docs/access-control)

## Available Operators

| Operator | Description |
|----------|-------------|
| _eq | Equals |
| _neq | Doesn't equal |
| _lt | Less than |
| _lte | Less than or equal to |
| _gt | Greater than |
| _gte | Greater than or equal to |
| _in | Is one of the values in array |
| _nin | Is not one of the values in array |
| _null | Is null |
| _nnull | Is not null |
| _contains | Contains (case-sensitive) |
| _icontains | Contains (case-insensitive) |
| _ncontains | Doesn't contain |
| _starts_with | Starts with |
| _istarts_with | Starts with (case-insensitive) |
| _nstarts_with | Doesn't start with |
| _nistarts_with | Doesn't start with (case-insensitive) |
| _ends_with | Ends with |
| _iends_with | Ends with (case-insensitive) |
| _nends_with | Doesn't end with |
| _niends_with | Doesn't end with (case-insensitive) |
| _between | Is between two values (inclusive) |
| _nbetween | Is not between two values (inclusive) |
| _empty | Is empty (null or falsy) |
| _nempty | Is not empty (null or falsy) |

## Filter Syntax

The basic syntax for a filter rule is:

\`\`\`json
{
  "field": {
    "operator": "value"
  }
}
\`\`\`

**Example**:
\`\`\`json
{
  "title": {
    "_contains": "Directus"
  }
}
\`\`\`

## Filtering Relational Fields

### Many-to-One
You can filter items with Many-to-One relations by specifying values of their respective fields.

**Example**:
For an articles collection with a relational Many-to-One author field:

\`\`\`json
{
  "author": {
    "name": {
      "_eq": "John Doe"
    }
  }
}
\`\`\`

### Many-to-Many
For Many-to-Many relationships, filters apply to the junction table.

**Example**:
For a books collection with a Many-to-Many relationship to authors:

\`\`\`json
{
  "authors": {
    "authors_id": {
      "name": {
        "_eq": "John Doe"
      }
    }
  }
}
\`\`\`

### _some vs _none in Relational Fields
The _some operator matches items where at least one related item meets the condition (default behavior).

\`\`\`json
{
  "categories": {
    "_some": {
      "name": {
        "_eq": "Fiction"
      }
    }
  }
}
\`\`\`

The _none operator matches items where none of the related items meet the condition.

\`\`\`json
{
  "categories": {
    "_none": {
      "name": {
        "_eq": "Fiction"
      }
    }
  }
}
\`\`\`

## Dynamic Variables

| Variable | Description |
|----------|-------------|
| $CURRENT_USER | Primary key of the currently authenticated user |
| $CURRENT_ROLE | Primary key of the role for the current user |
| $NOW | Current timestamp |
| $NOW(<adjustment>) | Current timestamp with adjustment, e.g., $NOW(-1 year) |

**Example**:
\`\`\`json
{
  "user_created": {
    "_eq": "$CURRENT_USER"
  }
}
\`\`\`

## Logical Operators
Group multiple rules using _and or _or logical operators.

**Syntax**:
\`\`\`json
{
  "_and": [
    {
      "field1": {
        "operator": "value"
      }
    },
    {
      "field2": {
        "operator": "value"
      }
    }
  ]
}
\`\`\`

**Example**:
\`\`\`json
{
  "_or": [
    {
      "_and": [
        {
          "user_created": {
            "_eq": "$CURRENT_USER"
          }
        },
        {
          "status": {
            "_in": ["published", "draft"]
          }
        }
      ]
    },
    {
      "_and": [
        {
          "user_created": {
            "_neq": "$CURRENT_USER"
          }
        },
        {
          "status": {
            "_in": ["published"]
          }
        }
      ]
    }
  ]
}
\`\`\`

## Function Parameters
Functions in filters modify field values before comparison.

**Syntax**: \`function(field)\`

**Example**:
\`\`\`json
{
  "_and": [
    {
      "year(published_date)": {
        "_eq": 2023
      }
    },
    {
      "month(published_date)": {
        "_eq": 4
      }
    }
  ]
}
\`\`\`

## $FOLLOW Syntax
For querying indirect relations, use $FOLLOW(target-collection, relation-field).

**Example**:
If cities have an M2O relationship with countries via country_id:

\`\`\`json
{
  "filter": {
    "name": "Germany",
    "$FOLLOW(cities, country_id)": {
      "name": "Berlin"
    }
  }
}
\`\`\`
`,
	},
];

// Resource decorator for Query resources
export class QueryResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, queryResources);
  }
}

// Export resources array for combining in main resources file if needed
export { queryResources };