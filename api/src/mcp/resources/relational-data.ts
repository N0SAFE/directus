import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Relational data resources
const relationalDataResources: Resource[] = [
	// Relational Data Overview
	{
		uri: 'mcp://docs/relational-data',
		mimeType: 'text/markdown',
		name: 'Relational Data',
		description: 'Documentation for working with relational data in Directus',
		text: `# Working with Relational Data in Directus

## Overview
Directus provides powerful capabilities for managing relational data across collections. This guide explains how to work with different types of relationships when creating, updating, fetching, and deleting related items.

## Types of Relationships

Directus supports several relationship types:

1. **Many-to-One (M2O)**: Many items in one collection can relate to a single item in another collection
   - Example: Many articles can have the same author

2. **One-to-Many (O2M)**: One item in a collection can relate to many items in another collection
   - Example: One author can have many articles

3. **Many-to-Many (M2M)**: Many items in one collection can relate to many items in another collection
   - Example: Many articles can have many categories, and many categories can have many articles

4. **Many-to-Any (M2A)**: Many items in one collection can relate to many items across multiple different collections
   - Example: A page can have many sections, where each section could be a heading, paragraph, image, etc.

## Fetching Relational Data

By default, Directus only retrieves the primary key of related items when you fetch data. To retrieve the complete related item data, you need to use the \`fields\` parameter:

**Example**: Fetching an article with its author details
\`\`\`json
{
  "collection": "articles",
  "id": "15",
  "fields": ["id", "title", "content", "author.*"]
}
\`\`\`

**Example**: Fetching articles with specific fields from author
\`\`\`json
{
  "collection": "articles",
  "fields": ["id", "title", "author.id", "author.name", "author.email"]
}
\`\`\`

## Creating and Updating Relational Data

### Many-to-One Relationships

For Many-to-One relationships, you can create or update the related item directly by providing an object under the relational field key:

**Creating a new related item**:
\`\`\`json
{
  "collection": "pages",
  "data": {
    "title": "Homepage",
    "featured_article": {
      "title": "This is my new article!"
    }
  }
}
\`\`\`

**Updating an existing related item**:
\`\`\`json
{
  "collection": "pages",
  "id": "1",
  "data": {
    "featured_article": {
      "id": 15,
      "title": "This is an updated title for my article!"
    }
  }
}
\`\`\`

**Removing a relation**:
\`\`\`json
{
  "collection": "pages",
  "id": "1",
  "data": {
    "featured_article": null
  }
}
\`\`\`

### One-to-Many and Many-to-Many Relationships

For these relationship types, Directus offers two approaches: Basic and Detailed.

#### Basic Approach

The Basic approach uses arrays to manage the related items:

**Setting related items by IDs**:
\`\`\`json
{
  "collection": "countries",
  "id": "1",
  "data": {
    "cities": [2, 7, 149]
  }
}
\`\`\`

**Creating and updating nested items**:
\`\`\`json
{
  "collection": "countries",
  "id": "1",
  "data": {
    "cities": [
      2, 
      {
        "name": "A new nested city"
      },
      {
        "id": 149,
        "name": "Updated city name"
      }
    ]
  }
}
\`\`\`

**Removing items from a relationship**:
Simply omit the items from the array that you want to remove:
\`\`\`json
{
  "collection": "countries",
  "id": "1",
  "data": {
    "cities": [2, 149]  // city with ID 7 will be removed from the relationship
  }
}
\`\`\`

#### Detailed Approach

The Detailed approach gives you more explicit control over what operations take place:

\`\`\`json
{
  "collection": "countries",
  "id": "1",
  "data": {
    "cities": {
      "create": [{ "name": "A new city" }],
      "update": [{ "id": 149, "name": "Update an existing city" }],
      "delete": [7]
    }
  }
}
\`\`\`

This approach is particularly useful for:
- Working with large relational datasets
- When you need more control over staging changes
- Making multiple distinct operations in a single request

### Many-to-Any Relationships

Many-to-Any (M2A) relationships are similar to Many-to-Many, but allow relating to items across different collections:

\`\`\`json
{
  "collection": "pages",
  "id": "1",
  "data": {
    "sections": [
      {
        "collection": "headings",
        "item": {
          "text": "Welcome to Our Website",
          "level": 1
        }
      },
      {
        "collection": "paragraphs",
        "item": {
          "content": "This is an introduction paragraph for our website."
        }
      },
      {
        "collection": "images",
        "item": {
          "id": 42
        }
      }
    ]
  }
}
\`\`\`

## Best Practices for Working with Relational Data

1. **Limit Nested Levels**: While you can nest relationships deeply, limiting to 2-3 levels helps maintain performance

2. **Use Sparse Fieldsets**: Only request the fields you need to reduce payload size and improve performance

3. **Batch Operations**: Use the Detailed approach for many-to-many relationships when making multiple changes at once

4. **Consider Performance**: Creating/updating many related items in a single request can be resource-intensive; consider breaking up very large operations

5. **Validate Before Updating**: Check that relationships exist before attempting updates to avoid unexpected results

6. **Handle Errors**: Relationship operations can fail if the target collections have validation rules or hooks; implement proper error handling

7. **Use Transactions**: For critical operations, consider using the API's transaction support to ensure all-or-nothing operations

## Common Patterns and Examples

### Creating an Article with Tags
\`\`\`json
{
  "collection": "articles",
  "data": {
    "title": "New Article",
    "content": "Article content...",
    "tags": [
      { "name": "New Tag" },
      5,
      { "id": 12, "name": "Updated Tag" }
    ]
  }
}
\`\`\`

### Creating a Page with Various Content Blocks
\`\`\`json
{
  "collection": "pages",
  "data": {
    "title": "About Us",
    "slug": "about-us",
    "content_blocks": [
      {
        "collection": "text_blocks",
        "item": {
          "content": "Our company was founded in 2023..."
        }
      },
      {
        "collection": "image_blocks",
        "item": {
          "image": 15,
          "alt_text": "Company headquarters"
        }
      }
    ]
  }
}
\`\`\`

### Updating a Product with Categories
\`\`\`json
{
  "collection": "products",
  "id": "42",
  "data": {
    "name": "Updated Product Name",
    "categories": {
      "create": [{ "name": "New Category" }],
      "update": [{ "id": 5, "name": "Renamed Category" }],
      "delete": [12]
    }
  }
}
\`\`\`
`,
	},
	
	// Relationship Types
	{
		uri: 'mcp://docs/relationship-types',
		mimeType: 'text/markdown',
		name: 'Relationship Types',
		description: 'Detailed explanation of relationship types in Directus',
		text: `# Directus Relationship Types

## Many-to-One (M2O)

### Description
Many-to-One relationships allow many items in one collection to point to a single item in another collection.

### Database Structure
- Implemented with a foreign key column in the "many" side collection
- The foreign key points to the primary key of the "one" side collection

### Example Use Cases
- Articles pointing to an author (many articles can have the same author)
- Products belonging to a category (many products in one category)
- Employees assigned to a department (many employees in one department)

### Configuration
When creating a Many-to-One field in Directus:
- Choose the "Many-to-One" field type
- Select the related collection
- Specify the foreign key field name

### API Usage
\`\`\`json
// Reading with related data
{
  "collection": "articles",
  "fields": ["id", "title", "author.id", "author.name"]
}

// Creating with a new related item
{
  "collection": "articles",
  "data": {
    "title": "New Article",
    "author": {
      "name": "New Author",
      "email": "author@example.com"
    }
  }
}

// Creating with an existing related item
{
  "collection": "articles",
  "data": {
    "title": "New Article",
    "author": 5
  }
}

// Updating a related item
{
  "collection": "articles",
  "id": 3,
  "data": {
    "author": {
      "id": 5,
      "name": "Updated Name"
    }
  }
}

// Removing a relation
{
  "collection": "articles",
  "id": 3,
  "data": {
    "author": null
  }
}
\`\`\`

## One-to-Many (O2M)

### Description
One-to-Many relationships allow a single item in one collection to be related to multiple items in another collection.

### Database Structure
- Actually implemented as a Many-to-One relationship in the database
- The "many" side has a foreign key pointing to the "one" side
- Directus creates a virtual field on the "one" side to access the related "many" items

### Example Use Cases
- Author with many articles
- Category containing many products
- Department with many employees

### Configuration
When creating a One-to-Many field in Directus:
- Choose the "One-to-Many" field type
- Select the related collection
- Specify which field on the related collection points back to this collection

### API Usage
\`\`\`json
// Reading with related data
{
  "collection": "authors",
  "fields": ["id", "name", "articles.*"]
}

// Creating parent with children
{
  "collection": "authors",
  "data": {
    "name": "New Author",
    "articles": [
      { "title": "First Article" },
      { "title": "Second Article" }
    ]
  }
}

// Updating children
{
  "collection": "authors",
  "id": 5,
  "data": {
    "articles": [
      1, 
      { "title": "New Article" },
      { "id": 3, "title": "Updated Article" }
    ]
  }
}

// Detailed approach for updates
{
  "collection": "authors",
  "id": 5,
  "data": {
    "articles": {
      "create": [{ "title": "New Article" }],
      "update": [{ "id": 3, "title": "Updated Article" }],
      "delete": [1]
    }
  }
}
\`\`\`

## Many-to-Many (M2M)

### Description
Many-to-Many relationships allow items in one collection to be related to multiple items in another collection, and vice versa.

### Database Structure
- Implemented using a junction table that contains foreign keys to both collections
- Each row in the junction table represents a relationship between two items

### Example Use Cases
- Articles having multiple tags, and tags applied to multiple articles
- Products belonging to multiple categories, and categories containing multiple products
- Students enrolled in multiple courses, and courses having multiple students

### Configuration
When creating a Many-to-Many field in Directus:
- Choose the "Many-to-Many" field type
- Select the related collection
- Specify the junction collection name or use the auto-generated one
- Configure the foreign key field names

### API Usage
\`\`\`json
// Reading with related data
{
  "collection": "articles",
  "fields": ["id", "title", "tags.id", "tags.name"]
}

// Setting related items by ID
{
  "collection": "articles",
  "id": 3,
  "data": {
    "tags": [1, 5, 7]
  }
}

// Creating and updating related items
{
  "collection": "articles",
  "id": 3,
  "data": {
    "tags": [
      1,
      { "name": "New Tag" },
      { "id": 5, "name": "Updated Tag" }
    ]
  }
}

// Detailed approach
{
  "collection": "articles",
  "id": 3,
  "data": {
    "tags": {
      "create": [{ "name": "New Tag" }],
      "update": [{ "id": 5, "name": "Updated Tag" }],
      "delete": [1]
    }
  }
}
\`\`\`

## Many-to-Any (M2A / Union Types)

### Description
Many-to-Any relationships allow items in one collection to be related to multiple items across different collections.

### Database Structure
- Implemented with a specialized junction table that includes:
  - Foreign key to the "many" side
  - A collection field to track which collection the related item belongs to
  - Foreign key to the item in the specified collection

### Example Use Cases
- Page builder with different types of content blocks (headings, paragraphs, images)
- Product features that can reference different types of specifications
- Notification system where notifications can link to different types of entities

### Configuration
When creating a Many-to-Any field in Directus:
- Choose the "Many-to-Any" field type
- Select the collections that can be related
- Configure the junction collection settings

### API Usage
\`\`\`json
// Reading with related data
{
  "collection": "pages",
  "fields": [
    "id", 
    "title", 
    "blocks.item:headings.text",
    "blocks.item:paragraphs.content",
    "blocks.item:images.id"
  ]
}

// Creating with mixed related items
{
  "collection": "pages",
  "data": {
    "title": "New Page",
    "blocks": [
      {
        "collection": "headings",
        "item": {
          "text": "Welcome",
          "level": 1
        }
      },
      {
        "collection": "paragraphs",
        "item": {
          "content": "This is a paragraph."
        }
      }
    ]
  }
}

// Updating mixed related items
{
  "collection": "pages",
  "id": 2,
  "data": {
    "blocks": [
      {
        "collection": "headings",
        "item": {
          "id": 5,
          "text": "Updated Heading"
        }
      },
      {
        "collection": "images",
        "item": 42
      }
    ]
  }
}
\`\`\`

## Self-Referencing Relationships

Directus supports self-referencing relationships, where items in a collection relate to other items in the same collection.

### Example Use Cases
- Hierarchical categories (parent/child categories)
- Organizational structure (employees and their managers)
- Comment threads (replies to comments)

### API Usage
\`\`\`json
// Fetching employees with their manager
{
  "collection": "employees",
  "fields": ["id", "name", "manager.id", "manager.name"]
}

// Setting a parent category
{
  "collection": "categories",
  "id": 5,
  "data": {
    "parent_category": 2
  }
}

// Fetching a category with its children
{
  "collection": "categories",
  "fields": ["id", "name", "subcategories.*"]
}
\`\`\`

## Advanced Relationship Tips

### Accessing Deeply Nested Relations
You can access deeply nested relationships by using dot notation in the fields parameter:

\`\`\`json
{
  "collection": "articles",
  "fields": [
    "id", 
    "title", 
    "author.id", 
    "author.name", 
    "author.department.name",
    "author.department.manager.name"
  ]
}
\`\`\`

### Handling Junction Collection Data
In Many-to-Many relationships, you might want to store additional data in the junction table:

\`\`\`json
// Reading junction data
{
  "collection": "courses",
  "fields": [
    "id", 
    "name", 
    "students.student_id.name",
    "students.enrollment_date"
  ]
}

// Setting junction data
{
  "collection": "courses",
  "id": 3,
  "data": {
    "students": [
      {
        "student_id": 5,
        "enrollment_date": "2023-01-15"
      },
      {
        "student_id": 8,
        "enrollment_date": "2023-01-20"
      }
    ]
  }
}
\`\`\`

### Conditional Relationship Loading
Use the filter and deep parameters to conditionally load related items:

\`\`\`json
{
  "collection": "authors",
  "id": 5,
  "fields": ["id", "name", "articles.*"],
  "deep": {
    "articles": {
      "_filter": {
        "status": {
          "_eq": "published"
        }
      }
    }
  }
}
\`\`\`
`,
	},
];

// Resource decorator for Relational Data resources
export class RelationalDataResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, relationalDataResources);
  }
}

// Export resources array for combining in main resources file if needed
export { relationalDataResources };