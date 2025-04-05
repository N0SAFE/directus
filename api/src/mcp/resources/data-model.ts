import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Data model resources
const dataModelResources: Resource[] = [
	// Collections overview
	{
		uri: 'mcp://docs/data-model/collections',
		mimeType: 'text/markdown',
		name: 'Collections',
		description: 'Documentation for Directus collections and data model',
		text: `# Directus Collections

## Overview

Collections are database tables with additional metadata and configuration used by Directus. They serve as the foundation for organizing and managing your data within the platform.

All Directus-specific settings and data is held only in system collections prefixed with \`directus_\`. Should you wish to remove Directus, you can remove these collections with no proprietary data left behind.

## Types of Collections

### User Collections

User collections are created directly in your database or via Directus. They describe your specific data models and configurations and can be queried via APIs created by Connect or via Explore.

These collections represent your actual business data and can be fully customized to meet your specific needs.

### System Collections

System collections are the automatically-created collections required for Directus to operate. These collections are surfaced throughout Directus to power different parts of the system - like notifications, users, roles, and even collection configuration itself.

While fields that come with system collection fields cannot be altered, you can extend system collections with additional fields.

## Creating Collections

You can create collections from the Data Model settings in the Directus Data Studio, or using the Collections API.

### Collection Properties

When creating a collection, you'll need to specify several properties:

#### Name

The unique name for your collection must be set on creation, is case sensitive, and will be used throughout the Data Studio and Directus APIs.

> **Important**: The collection name cannot be modified after collection creation, which includes casing. However, you can override how it is displayed in the Data Studio with collection naming translations.

#### Primary Key

The primary key field contains a unique value for each item in the collection. This unique identifier is used in several places:

- When creating relationships between items across different collections
- When fetching or performing actions on data using the Items API

The primary key type defines the strategy for creating unique primary keys. Once selected, this cannot be modified.

**Supported Primary Key Types**:

- **Auto-Incremented Integer**: IDs increment from 1 to 2^31-1 (2,147,483,647)
- **Auto-Incremented Big Integer**: IDs increment from 1 to 2^63-1 (9,223,372,036,854,775,807). This is only available if using MySQL and PostgreSQL as your database.
- **Generated UUID**: Universally Unique Identifier. Creates a completely unique ID. IDs generated with this system (not just in your database, but anywhere this system is used) are so statistically unlikely to be repeated that for all practical purposes they are unique.
- **Manually Entered String**: You manually type out a unique string as the ID for each item. Directus will ensure they are unique by forbidding new item creation with a duplicate ID.

#### Optional Standard Fields

Additionally, Directus can create some common fields when you create a collection:

- **Status field**: For managing the publication status of items
- **Sort field**: For enabling manual sorting of items
- **User Created/Modified fields**: For tracking who created or last modified an item
- **Date Created/Modified fields**: For tracking when an item was created or last modified

## Configuring Collections

Once a collection is created, there are a number of configuration options available.

### Collection Setup

- **Note**: Set a helpful note that explains the collection's purpose. This is shown in the Data Model settings page.
- **Icon**: Icon used throughout the Data Studio when referencing this collection.
- **Color**: Color for the icon, shown in the navigation bar and page headers.
- **Display Template**: Display templates are used to represent an item in relationship fields - for example to show the value of the Name field when displaying a post's author.
- **Hidden**: Toggle whether the collection should be globally hidden in the Data Studio.
- **Singleton**: Toggle to bypass the collection page and take users to the single item details page. Useful for collections that will only ever have one item, like site settings.
- **Collection Naming Translations**: Translate the collection name across multiple languages. When the default language is changed, the relevant translation will be used throughout the Data Studio.

### Content Versioning

Content versioning allows teams to create and manage different versions of their content. This feature can be enabled for specific collections, and will be available for all items.

When enabled, item versions can be created, and later have some or all fields promoted to the main version, typically used for publishing.

### Live Preview

Live preview allows for your application to be shown in a pane next to your content, which can be used for previewing content before publishing.

You can use item field values to construct the URL used by the live preview, including unique identifiers and content version, allowing for previewing content versions before promoting them to the main version.

### Accountability

**Revisions** are created whenever an item is updated. This history of versions is tracked so that previous states can be recovered. Every change made to items in Directus is stored as a complete versioned snapshot and a set of specific changes made.

**Activity** is a log of all events that take place within the platform. Each activity record tracks the event type, user, timestamp, IP address, user-agent, and any associated revision data.

By default, your Directus project tracks all activity and revisions for collections. However, you can override this and choose to only track activity, or nothing.

> **Note**: Accountability is a log of who does what in your project. It is for your team's own use. This is different from telemetry, which is configured in environment variables.

### Sorting

The sort feature enables users to manually sort items in the Data Studio and via the API. If not selected as an optional field when creating a collection, you will need to create a new field with an integer type. It can then be selected as the sort field.

To configure manual sorting within a relational field (e.g., M2M, O2M, or M2A), also set the sort field within the relationship section of the field's configuration drawer.

Once configured, you can drag items by their handle in the Data Studio. You can also sort by the sort field when querying data via the Items API.

### Duplication

The Save as Copy option in Editor offers a way to effectively duplicate the current item. Duplication settings define which field values will be copied.

> **Note**: When you duplicate an item, any related items are not copied. You must create new relationships between the duplicated item and related items.

### Archive Settings

Archived items still exist in your collections, but are filtered within the Data Studio. If not selected as an optional field when creating a collection, you will need to create a new field.

To configure an archive field, set the following four input fields as desired:

- **Archive Field**: Selects the archive field.
- **Archive App Filter**: Can users filter for archived items.
- **Archive Value**: Assigned value to archive field when an item is archived.
- **Unarchive Value**: Assigned value to archive field when an item is unarchived.

> **Note**: Archived items are hidden in the app by default, but they are still returned normally via the API unless explicitly filtered out. This gives you the flexibility to manage archived items however you want when working with the API.

### Advanced Field Creation Mode

You can use advanced options to automatically set the values of fields at specific events by clicking on "Continue in Advanced Field Creation Mode".

For example, you can set the default value of a Many-to-One (M2O) relationship to be the current user, or you can set a datetime field to automatically update to the current time upon creation and updating.

## System Collections

System collections are required for Directus to operate. Here are the primary system collections:

| Collection | Purpose |
|------------|---------|
| directus_activity | Accountability logs for all events. |
| directus_collections | Additional collection configuration and metadata. |
| directus_dashboards | Dashboards within the Insights module. |
| directus_extensions | Configuration of extensions. |
| directus_fields | Additional field configuration and metadata. |
| directus_files | Metadata for all managed file assets. |
| directus_flows | Automation flows. |
| directus_folders | Provides virtual directories for files. |
| directus_migrations | What version of the database you're using. |
| directus_notifications | Notifications sent to users. |
| directus_operations | Operations that run in Flows. |
| directus_panels | Individual panels within Insights dashboards. |
| directus_permissions | Access permissions for each role. |
| directus_presets | Presets for collection defaults and bookmarks. |
| directus_relations | Relationship configuration and metadata. |
| directus_revisions | Data snapshots for all activity. |
| directus_roles | Permission groups for system users. |
| directus_sessions | User session information. |
| directus_settings | Project configuration options. |
| directus_shares | Tracks externally shared items. |
| directus_translations | Custom translations. |
| directus_users | System users for the platform. |
| directus_versions | Content Versions for items. |

## Working with Existing Database Tables

When Directus is connected to an existing database, it will introspect existing tables and relationships and collections will be made available to admins via the Items API.

To access the collection via the Data Studio, you must configure the collection with additional Directus-specific metadata, such as interfaces, displays, and icons.

To access the collection without an admin role, you must also configure access control as with any other collection.

Finally, any relationships not configured in the database must also be set up inside of Directus.

> **Limitation**: Directus does not currently support composite keys, or the creation of virtual tables via SQL views.
`,
	},
	
	// Fields overview
	{
		uri: 'mcp://docs/data-model/fields',
		mimeType: 'text/markdown',
		name: 'Fields',
		description: 'Documentation for Directus fields and data types',
		text: `# Directus Fields

## Overview

Fields are database columns with additional metadata and configuration used by Directus. Fields define how data is stored, displayed, validated, and edited throughout the system.

## Data Types

Directus supports various databases, each with their own native data types. To standardize these differences, Directus has a unified set of types that are mapped to the vendor-specific database types.

### Text Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| String | For short text content | VARCHAR, CHARACTER VARYING, etc. |
| Text | For longer text content | TEXT, TINYTEXT, MEDIUMTEXT, etc. |
| UUID | Universally Unique Identifier | UUID (PostgreSQL), CHAR(36) (MySQL), etc. |
| Hash | For storing secure hashes | VARCHAR, CHARACTER VARYING, etc. |
| Alias | Virtual field that doesn't store data | Not stored in database |

### Numeric Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| Integer | Whole numbers | INTEGER, INT, SMALLINT, etc. |
| Big Integer | Large whole numbers | BIGINT |
| Float | Numbers with decimal points (imprecise) | FLOAT, DOUBLE, REAL, etc. |
| Decimal | Precise decimal numbers | DECIMAL, NUMERIC |

### Boolean Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| Boolean | True/False values | BOOLEAN, TINYINT(1), BIT |

### Date and Time Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| Timestamp | Date and time with timezone | TIMESTAMP, TIMESTAMPTZ |
| DateTime | Date and time without timezone | DATETIME |
| Date | Date only | DATE |
| Time | Time only | TIME |

### Binary Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| Binary | Raw binary data | BLOB, BYTEA, BINARY, etc. |

### Structured Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| JSON | JSON structured data | JSON, JSONB |
| CSV | Comma-separated values | TEXT, VARCHAR |

### Geospatial Fields

| Type | Description | Database Mappings |
|------|-------------|-------------------|
| Point | Geographical point coordinate | POINT |
| LineString | Sequence of points forming a line | LINESTRING |
| Polygon | Sequence of points forming a closed shape | POLYGON |
| MultiPoint | Collection of points | MULTIPOINT |
| MultiLineString | Collection of linestrings | MULTILINESTRING |
| MultiPolygon | Collection of polygons | MULTIPOLYGON |

> **Note**: Geospatial fields are used to store data in GeoJSON format. These types are only supported if your database supports spatial extensions.

Fields that do not map directly to an actual database column are called "alias" fields, and include presentational fields and certain relational fields.

## Creating Fields

When creating a new field, you must first select an interface and provide some basic configuration. Basic configuration will depend on the interface selected, but all fields have some common characteristics.

### Key Elements

- **Interface**: Describes how users will create and edit data, as well as how it is displayed in Editor. There are many kinds of built-in interfaces, such as a text input, date selector, map, and relationship interfaces.

- **Key**: The unique name for a field within a collection. This value is used in both the Data Studio and via API. Within the Data Studio, the key is parsed through the title formatter to improve readability.

- **Type**: Defines the underlying data type configured in the database. When creating fields, the available types will correspond to the interface selected.

> **Important**: The field key and type cannot be modified after field creation, which includes casing. However, you can override how the key is displayed in the Data Studio with field name translations.

## Configuring Fields

There are a number of advanced configuration options available for fields. Some must be configured at the time of creation, while others can be edited after creation.

### Schema

This section defines the database column settings for the field:

- **Key**: The unique identifier for the field (immutable)
- **Type**: The data type of the field (immutable)
- **Length**: Maximum character length (for text types)
- **Default Value**: The value used when no value is provided
- **Allow Null**: Whether the field can be empty/null
- **Unique Values**: Whether values must be unique in the collection

### Field

This section sets details for the interface, which is displayed in the editor:

- **Required**: Whether a value must be provided when creating an item
- **Read-only**: Whether the field can be edited
- **Note**: Additional context or help text displayed to users
- **Field Name Translations**: Translations of the field label for different languages

### Interface

This section describes how the user will create, edit, and view data in the editor. Interfaces are effectively different form inputs. Each interface will have its own configuration options.

Examples of interfaces include:

- Text Input
- Date/Time Picker
- Dropdown
- Toggle
- Tags
- Map
- File Upload
- WYSIWYG Editor
- Color Picker
- Relationship interfaces (M2O, O2M, M2M, M2A)

### Display

This section describes how individual field values will be displayed throughout the Data Studio. You can always choose to display the raw value, but you can also display a formatted value. Each display option will have its own configuration.

Examples of display options include:

- Formatted Text
- Formatted Date/Time
- Color
- Image
- Progress Bar
- Tag
- Related Values

**Conditional Styles** allow for different colors, icons, and text values to be used when the field data meets configured criteria. For example:
- Show a red icon when status is "Rejected"
- Show a green background when a value is above a threshold
- Display custom formatting for specific value ranges

### Validation

This section allows for the configuration of rules to determine valid user input. If validation fails, you can also use this configuration section to write custom messages.

Examples of validation rules include:

- Text length (min/max)
- Numeric range
- Pattern (regex)
- Required formats (email, URL, etc.)
- Custom validation expressions

> **Note**: These validations apply to data added via Directus and are not database-level validations.

### Conditions

This section alters the current field's configuration based on the values of other fields in the item. Conditional configuration includes:

- Whether a field is read-only
- Whether a field is hidden
- Whether a field is required
- Interface-specific configuration changes

For example, you might want to:
- Show a "Reason" field only when "Status" is set to "Rejected"
- Make a field required only when a checkbox is checked
- Change display options based on another field's value

> **Tip**: To show a field conditionally, set hidden to true in the field settings. Then, create a condition with a rule checking the value of another field. The condition should set hidden to false.

### Relationships & Translations

This section will only appear when the field is relational, and describes the relationship between this field and other collections. Each relationship type will be shown differently, and where there is a junction collection you will be given the option to add a sort field on the collection.

**Relational triggers** configure what will happen to the relational field data when related values are deselected or deleted. This includes:
- Setting values to null
- Setting values to their default
- Cascading deletions
- Preventing deletions

## Field Width

Each field can be configured to be half or full width in the editor. Two half-width fields can be placed next to each other. Additionally, a field can be configured to use up the full-width of the editor, expanding beyond the usual full-width container.

Field width is not in the field configuration, but can be set by clicking on the field width toggle in the collection data model page.

## System Collection Fields

System collections have a number of default fields that cannot be configured as they are required for Directus to operate. However, additional fields can be added to any system collection to extend their functionality.

## Existing Database Fields

When Directus is connected to an existing database, fields of supported types will be automatically made available in Directus. You can then fully configure these fields as desired within the Data Studio.
`,
	},

	// Relationships
	{
		uri: 'mcp://docs/data-model/relationships',
		mimeType: 'text/markdown',
		name: 'Relationships',
		description: 'Documentation for Directus relationships and data associations',
		text: `# Directus Relationships

## Overview

Directus supports all standard relationship types, as well as additional compound types meant to streamline certain common configurations. Relationships allow you to connect data across different collections, creating powerful data structures.

## Relationship Types

### Many to One (M2O)

In a Many-to-One relationship, multiple items from one collection are linked to one item in a different collection. One field is added to the 'many' collection referencing the primary key of the 'one' collection.

**Database Structure**:
- The "many" side has a foreign key field
- The foreign key points to the primary key in the "one" side collection
- No junction table is needed

**Examples**:
- Given cities and countries collections, many cities would be assigned to one country
- Given orders and customers, many orders would be assigned to one customer
- Given books and publishers, many books would be assigned to one publisher

**Interface**:
In the Editor, having a M2O field displays a dropdown or lookup field that allows selection of one item from the related collection.

**API Usage**:
When fetching items from a collection with M2O relationships, you can include the related item by using the fields parameter:

\`\`\`json
{
  "fields": ["id", "title", "author.*"]
}
\`\`\`

**Creating/Updating**:
When creating or updating an item, you can set a M2O relationship in several ways:

1. Using the primary key value:
\`\`\`json
{
  "author": 5
}
\`\`\`

2. Creating a new related item:
\`\`\`json
{
  "author": {
    "name": "John Doe",
    "email": "john@example.com"
  }
}
\`\`\`

3. Updating an existing related item:
\`\`\`json
{
  "author": {
    "id": 5,
    "name": "John Smith"  // This updates the name
  }
}
\`\`\`

4. Removing a relationship:
\`\`\`json
{
  "author": null
}
\`\`\`

### One to Many (O2M)

In a One-to-Many relationship, one item from a collection is linked to multiple items in a different collection. This is the inverse perspective of a M2O relationship.

**Database Structure**:
- Actually implemented as a Many-to-One relationship in the database
- The "many" side has a foreign key pointing to the "one" side
- Directus creates a virtual field on the "one" side to access the related "many" items

**Examples**:
- Given an author with many articles
- Given a category containing many products
- Given a department with many employees

**Interface**:
Creating a O2M interface on the 'one' side of a M2O relationship creates an Alias field, which lets us access related items. This does not create a new database column as the O2M field is purely virtual. It creates an interface within the Editor to access items from an O2M perspective.

**API Usage**:
When fetching items with O2M relationships, you can include all related items:

\`\`\`json
{
  "fields": ["id", "name", "articles.*"]
}
\`\`\`

**Creating/Updating**:
When creating or updating an item, you can set a O2M relationship by:

1. Setting an array of existing item IDs:
\`\`\`json
{
  "articles": [1, 2, 3]
}
\`\`\`

2. Creating new related items:
\`\`\`json
{
  "articles": [
    { "title": "New Article 1" },
    { "title": "New Article 2" }
  ]
}
\`\`\`

3. Mixed approach (existing, new, and updates):
\`\`\`json
{
  "articles": [
    1,  // Use existing item with ID 1
    { "title": "New Article" },  // Create new item
    { "id": 3, "title": "Updated Title" }  // Update existing item with ID 3
  ]
}
\`\`\`

4. Detailed approach for more control:
\`\`\`json
{
  "articles": {
    "create": [{ "title": "New Article" }],
    "update": [{ "id": 3, "title": "Updated Title" }],
    "delete": [1]
  }
}
\`\`\`

### Many to Many (M2M)

In a Many-to-Many relationship, an additional collection is created known as the junction collection. The junction collection stores the primary keys from two related collections, allowing for any number of items to be related between two collections.

**Database Structure**:
- Requires a junction table with at least two columns
- Each column is a foreign key to one of the related collections
- Additional fields can be added to store metadata about the relationship

**Examples**:
- Articles having multiple tags, and tags applied to multiple articles
- Products belonging to multiple categories, and categories containing multiple products
- Students enrolled in multiple courses, and courses having multiple students

**Self-Referencing M2M**:
You can also have a self-referencing M2M relationship that connects items in the same collection:
- Given an articles collection, you could configure related articles
- Given a users collection, you could configure a friends list
- Given papers, you could configure citations

**Interface**:
In the Editor, M2M fields typically display as a multi-select interface, allowing users to select multiple items from the related collection.

**API Usage**:
When fetching items with M2M relationships, you can include the related items:

\`\`\`json
{
  "fields": ["id", "title", "tags.*"]
}
\`\`\`

**Creating/Updating**:
When creating or updating an item, you can set a M2M relationship by:

1. Setting an array of existing item IDs:
\`\`\`json
{
  "tags": [1, 5, 7]
}
\`\`\`

2. Creating new related items:
\`\`\`json
{
  "tags": [
    { "name": "New Tag" }
  ]
}
\`\`\`

3. Mixed approach:
\`\`\`json
{
  "tags": [
    1,  // Use existing tag with ID 1
    { "name": "New Tag" },  // Create new tag
    { "id": 5, "name": "Updated Tag" }  // Update existing tag with ID 5
  ]
}
\`\`\`

4. Detailed approach:
\`\`\`json
{
  "tags": {
    "create": [{ "name": "New Tag" }],
    "update": [{ "id": 5, "name": "Updated Tag" }],
    "delete": [1]  // This removes the relationship, not the tag itself
  }
}
\`\`\`

### Many to Any (M2A)

In a Many-to-Any relationship, one collection can be related to any item in any collection. This is sometimes known as a matrix field or replicator.

**Database Structure**:
- Implemented with a specialized junction table that includes:
  - Foreign key to the "many" side
  - A collection field to track which collection the related item belongs to
  - Foreign key to the item in the specified collection

**Examples**:
- Page builder with different types of content blocks (headings, paragraphs, images)
- Product features that can reference different types of specifications
- Notification system where notifications can link to different types of entities

**Interface**:
When you configure a M2A in Directus, a M2A Alias field is created as well as a junction collection. The junction collection in a M2A relationship also stores the collection name for related collections.

**API Usage**:
When fetching items with M2A relationships, you can specify which fields to include from which collections:

\`\`\`json
{
  "fields": [
    "id", 
    "title", 
    "sections.item:headings.text",
    "sections.item:paragraphs.content",
    "sections.item:images.id"
  ]
}
\`\`\`

**Creating/Updating**:
When creating or updating an item, you can set a M2A relationship by:

\`\`\`json
{
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
        "id": 42  // Reference an existing image
      }
    }
  ]
}
\`\`\`

### Translations

When you create a Translations interface in Directus, a translations O2M Alias field is created, as well as a languages collection and a junction collection between your main collection and languages. All translated text is stored in the junction collection.

**Database Structure**:
- A languages collection with supported languages
- A junction collection connecting your main collection to languages
- Translated fields are stored in the junction collection

**Interface**:
In the Editor, a Translations field typically displays tabs for each language, allowing users to enter translated content for each supported language.

**API Usage**:
When fetching items with translations, you can include all translations or filter to specific languages:

\`\`\`json
{
  "fields": ["id", "translations.*"]
}
\`\`\`

**Creating/Updating**:
When creating or updating an item with translations:

\`\`\`json
{
  "translations": [
    {
      "languages_id": 1,  // English
      "title": "Hello World",
      "content": "This is the English content"
    },
    {
      "languages_id": 2,  // Spanish
      "title": "Hola Mundo",
      "content": "Este es el contenido en español"
    }
  ]
}
\`\`\`

## Working with Relationship Junction Tables

### Customizing Junction Collections

Junction collections can be customized with additional fields to store metadata about the relationship:

- For an articles-tags relationship, you might add a "relevance_score" field
- For a courses-students relationship, you might add "enrollment_date" and "grade" fields
- For a products-categories relationship, you might add a "featured" boolean field

### Accessing Junction Data

When working with relationships that use junction collections, you can access both the related items and the junction data:

\`\`\`json
{
  "fields": [
    "id", 
    "title", 
    "students.student_id.name",
    "students.enrollment_date",
    "students.grade"
  ]
}
\`\`\`

### Updating Junction Data

When creating or updating relationships with junction data:

\`\`\`json
{
  "students": [
    {
      "student_id": 5,
      "enrollment_date": "2023-01-15",
      "grade": "A-"
    },
    {
      "student_id": 8,
      "enrollment_date": "2023-01-20",
      "grade": "B+"
    }
  ]
}
\`\`\`

## Best Practices for Working with Relationships

### Performance Considerations

- **Limit Relationship Depth**: While you can nest relationships deeply, limiting to 2-3 levels helps maintain performance
- **Use Specific Fields**: Request only the fields you need rather than using wildcards like ${"`*`"}
- **Consider Pagination**: For collections with many related items, use pagination parameters

### Data Integrity

- **Cascading Deletions**: Configure relational triggers properly to maintain data integrity
- **Required Relationships**: Consider whether relationships should be required or optional
- **Handling Duplicates**: Be careful when creating relationships to avoid duplicates

### UI/UX Considerations

- **Display Templates**: Configure meaningful display templates for related items
- **Sort Fields**: Add sort fields to junction collections for manual ordering
- **Conditional Displays**: Use conditional styling to highlight important relationship information
`,
	},

	// Data Model Best Practices
	{
		uri: 'mcp://docs/data-model/best-practices',
		mimeType: 'text/markdown',
		name: 'Data Model Best Practices',
		description: 'Best practices for designing Directus data models',
		text: `# Directus Data Model Best Practices

## Overview

Designing an effective data model is critical for building scalable, maintainable applications with Directus. This guide covers best practices for collections, fields, and relationships.

## Collection Design Principles

### Collection Naming

- Use **plural nouns** for collection names (e.g., "articles" instead of "article")
- Use **lowercase** and **underscores** for collection names (e.g., "blog_posts" instead of "BlogPosts")
- Keep collection names **concise but descriptive**
- Use a **consistent naming convention** throughout your project

### Collection Organization

- **Group related collections** with a common prefix (e.g., "product_categories", "product_variants")
- Consider organizing collections as **Core**, **Junction**, and **Config** collections
- Use **singletons** for collections that will only ever have one item (e.g., "site_settings")
- Hide technical or helper collections from the navigation menu

### Collection Structure

- Design collections with a **clear, focused purpose**
- Avoid creating **overly broad collections** that serve multiple purposes
- **Break down complex data models** into multiple related collections
- Consider **future expansion needs** when designing collections

## Field Design Principles

### Field Naming

- Use **singular nouns** for field names (e.g., "title" not "titles")
- Use **snake_case** (lowercase with underscores) for field names
- For boolean fields, consider using **is_** or **has_** prefixes (e.g., "is_published", "has_attachment")
- Use meaningful names rather than abbreviations (e.g., "description" instead of "desc")

### Field Types and Organization

- Choose the **most appropriate field type** for your data
- For enumerated values, use a **select** field rather than free text
- Group related fields using **field sections** or **tabs**
- Arrange fields in a **logical order** (e.g., important fields first)
- Use **consistent field widths** throughout your collections

### Field Validation

- Apply **appropriate validation rules** for each field
- Add **helpful notes** to guide users on field requirements
- Configure **conditional logic** to show/hide fields when needed
- Set up **meaningful display templates** for collections

## Relationship Best Practices

### Relationship Planning

- **Map out relationships** before implementation
- Consider **performance implications** of deeply nested relationships
- Choose the **appropriate relationship type** for each connection
- Plan for **data integrity** with proper relational triggers

### Many-to-One Relationships

- Use for **classification** and **categorization**
- Consider whether the relationship should be **required or optional**
- Configure **display templates** for intuitive selection
- Add **helpful interfaces** like dropdowns with search

### One-to-Many Relationships

- Use for **parent-child relationships**
- Consider adding **filters** to make related item management easier
- Configure **sort options** for related items
- Set up **appropriate layouts** for viewing related items

### Many-to-Many Relationships

- Use for **flexible associations** between collections
- Consider adding **metadata fields** to junction collections
- Configure **appropriate sort fields** for manual ordering
- Use **conditional styles** to highlight important relationships

### Many-to-Any Relationships

- Use for **modular content** or **page builder** functionality
- Limit the **number of allowed collections** to keep the interface manageable
- Design a **consistent structure** across all potential related collections
- Consider using **component-based design patterns**

### Translation Relationships

- Configure **all translatable fields** at the beginning
- Ensure **consistent field names** across all translatable collections
- Consider which fields should be **translatable vs. global**
- Set up **appropriate default language** fallbacks

## Performance Optimization

### Database Optimization

- Add **indexes** for frequently queried fields
- Use **appropriate field types** for the data being stored
- Consider the **cardinality** of relationships when designing
- Use **UUIDs** for public-facing IDs and auto-incremented integers for internal references

### Query Optimization

- Request **only the fields you need** in API calls
- Use **filter parameters** effectively to reduce data transfer
- Consider **pagination** for large datasets
- Cache **frequently accessed data** when appropriate

### Interface Optimization

- Configure **appropriate interfaces** for field types
- Use **custom displays** for complex data visualization
- Set up **meaningful display templates** for relationships
- Group related fields in **logical sections or tabs**

## Security Considerations

### Data Access

- Design with **principle of least privilege** in mind
- Consider **field-level permissions** in your data model
- Plan for **row-level permissions** needs
- Use **validation rules** to enforce data integrity

### Sensitive Data

- Identify and protect **sensitive fields** with appropriate permissions
- Consider using **hash fields** for secure storage
- Use **role-based access control** effectively
- Document **security considerations** for your data model

## Documentation Best Practices

### Collection Documentation

- Add **descriptive notes** to all collections
- Document the **purpose** of each collection
- Note **important relationships** with other collections
- Include **usage examples** where appropriate

### Field Documentation

- Add **helpful notes** to complex fields
- Document **validation rules** and requirements
- Explain **special behavior** of fields (e.g., auto-populated fields)
- Use **consistent terminology** across your documentation

## Migration and Evolution

### Planning for Changes

- Design with **future changes** in mind
- Use **nullable fields** for new additions to existing collections
- Consider **backward compatibility** when making changes
- Plan for **data migration** needs

### Managing Schema Changes

- Make **incremental changes** rather than massive restructuring
- Test changes in a **development environment** first
- Document all **schema changes** for team reference
- Communicate changes to **team members** and **stakeholders**

## Common Data Modeling Patterns

### Content Management

- **Main content collection** with core fields
- **Categories/tags** as related collections
- **Media/assets** managed through file fields
- **Author/user** relationships
- **Versioning** for content revisions

### E-commerce

- **Products** collection with variants
- **Categories** in hierarchical structure
- **Orders** with line items as related collection
- **Customers** with addresses and preferences
- **Inventory** tracking with status fields

### User Management

- **Users** with profile information
- **Roles** for permission management
- **Groups** for organizing users
- **Activity/audit logs** for tracking
- **Preferences** for user-specific settings

### Event Management

- **Events** with date/time fields
- **Venues** as related collection
- **Registrations** tracking attendees
- **Sessions** for multi-session events
- **Speakers** as related collection
`,
	},
];

// Resource decorator for Data Model resources
export class DataModelResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, dataModelResources);
  }
}

// Export resources array for combining in main resources file if needed
export { dataModelResources };