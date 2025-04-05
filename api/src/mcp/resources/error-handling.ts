import { MCPResourceHandlerDecorator, type IMCPResourceHandler, type Resource } from '../base.js';

// Error handling resources
const errorHandlingResources: Resource[] = [
	// Error Codes Overview
	{
		uri: 'mcp://docs/error-codes',
		mimeType: 'text/markdown',
		name: 'Error Codes',
		description: 'Documentation for Directus error codes and handling',
		text: `# Directus Error Codes

## Overview
Directus uses standardized error codes to provide clear information about what went wrong with an API request. This document explains each error code, its meaning, and how to handle it properly.

## Global Error Codes

| Error Code | Status | Description |
|------------|--------|-------------|
| FAILED_VALIDATION | 400 | Validation for this particular item failed. |
| FORBIDDEN | 403 | You are not allowed to perform the current action. |
| INVALID_TOKEN | 403 | Provided token is invalid. |
| TOKEN_EXPIRED | 401 | Provided token is valid but has expired. |
| INVALID_CREDENTIALS | 401 | Username / password or access token is wrong. |
| INVALID_IP | 401 | Your IP address isn't allow-listed to be used with this user. |
| INVALID_OTP | 401 | Incorrect OTP was provided. |
| INVALID_PAYLOAD | 400 | Provided payload is invalid. |
| INVALID_QUERY | 400 | The requested query parameters cannot be used. |
| UNSUPPORTED_MEDIA_TYPE | 415 | Provided payload format or Content-Type header is unsupported. |
| REQUESTS_EXCEEDED | 429 | You have exceeded the rate limit. |
| ROUTE_NOT_FOUND | 404 | Endpoint does not exist. |
| SERVICE_UNAVAILABLE | 503 | Could not use external service. |
| UNPROCESSABLE_CONTENT | 422 | You tried doing something illegal. |

> **Note**: To prevent revealing which items exist, all actions for non-existing items will return a FORBIDDEN error.

## Error Response Format

When an error occurs, the MCP server will return a response with this format:

\`\`\`json
{
  "content": [
    {
      "type": "error",
      "text": "Error message describing what went wrong"
    }
  ]
}
\`\`\`

In some cases, additional error details may be included in the error message.

## Common Error Scenarios and Solutions

### Authentication and Authorization Errors

#### INVALID_CREDENTIALS (401)
This occurs when the provided username/password or access token is incorrect.

**Solution**:
- Double-check the provided credentials
- Ensure you're using the correct environment/project
- If using tokens, verify they haven't been revoked

#### TOKEN_EXPIRED (401)
The authentication token you're using has expired.

**Solution**:
- Request a new token by authenticating again
- If using refresh tokens, use the refresh token to obtain a new access token

#### FORBIDDEN (403)
You don't have the necessary permissions to perform the requested action.

**Solution**:
- Check the user's role and permissions
- Request additional permissions from an administrator if needed
- Verify you're operating on the correct items or collections

### Data Validation Errors

#### FAILED_VALIDATION (400)
The data you provided doesn't satisfy validation rules for the collection.

**Solution**:
- Check the error message for specific field validation failures
- Verify required fields are included
- Ensure data types match the expected formats
- Check for any constraints like min/max length, unique values, etc.

#### INVALID_PAYLOAD (400)
The overall structure of your request payload is incorrect.

**Solution**:
- Verify the JSON/payload structure matches the API requirements
- Check for syntax errors in your request body
- Ensure all required top-level properties are present

### Query Errors

#### INVALID_QUERY (400)
Something is wrong with your query parameters.

**Solution**:
- Check filter syntax for errors
- Verify you're not using unsupported operators
- Ensure relational queries use proper syntax
- Verify field names exist in the collection

### Rate Limiting

#### REQUESTS_EXCEEDED (429)
You've made too many requests in a short time period.

**Solution**:
- Implement backoff strategies in your code
- Reduce the frequency of requests
- Batch operations when possible
- Check headers for rate limit information

### Service Errors

#### SERVICE_UNAVAILABLE (503)
An external service required by Directus is not available.

**Solution**:
- Try again later
- Check if any integrated services (storage, email, etc.) are down
- Verify your Directus instance configuration for external services

## Best Practices for Error Handling

1. **Always check the error code**: Parse the error response and check the specific error code to handle different types of errors appropriately.

2. **Implement retry logic**: For rate limiting and service unavailability errors, implement a retry strategy with exponential backoff.

3. **Log error details**: Record detailed error information for troubleshooting.

4. **Provide user-friendly messages**: Translate technical errors into meaningful messages for end-users.

5. **Handle validation errors specifically**: Extract the validation error details to show specific field errors to users.

6. **Check for expired tokens**: Automatically refresh tokens when they expire instead of requiring users to log in again.

7. **Handle permissions gracefully**: When encountering FORBIDDEN errors, offer appropriate guidance rather than just showing an error message.

## Error Handling Code Examples

### Basic Error Handling

\`\`\`javascript
try {
  // Make API request using the MCP tool
  const response = await mcp.invoke('read_items', {
    collection: 'articles',
    filter: { status: 'published' }
  });
  
  // Process successful response
  processData(response);
} catch (error) {
  // Check error type and handle accordingly
  if (error.code === 'FORBIDDEN') {
    console.log('You do not have permission to access these articles');
  } else if (error.code === 'INVALID_QUERY') {
    console.log('The query parameters are invalid');
  } else {
    console.log('An unexpected error occurred:', error.message);
  }
}
\`\`\`

### Token Refresh Strategy

\`\`\`javascript
async function makeAuthenticatedRequest(params) {
  try {
    return await mcp.invoke('read_items', params);
  } catch (error) {
    if (error.code === 'TOKEN_EXPIRED') {
      // Refresh the token
      await refreshToken();
      
      // Retry the original request
      return await mcp.invoke('read_items', params);
    }
    
    throw error; // Re-throw other errors
  }
}
\`\`\`

### Handling Validation Errors

\`\`\`javascript
try {
  await mcp.invoke('create_item', {
    collection: 'articles',
    data: { title: 'New Article' }
  });
} catch (error) {
  if (error.code === 'FAILED_VALIDATION') {
    // Extract and display specific validation errors
    const validationErrors = parseValidationErrors(error.message);
    
    for (const field in validationErrors) {
      console.log(\`Error in field \${field}: \${validationErrors[field]}\`);
    }
  } else {
    console.log('Error creating article:', error.message);
  }
}
\`\`\`

## Frequently Asked Questions

### Why am I getting a FORBIDDEN error when I know the item exists?

For security reasons, Directus returns the same FORBIDDEN error for both non-existent items and items you don't have permission to access. This prevents information disclosure about which items exist in the system.

### How can I tell if my token is expired?

Check for the TOKEN_EXPIRED error code in responses. You can also decode JWT tokens to check their expiration time before making requests.

### What should I do when hitting rate limits?

Implement a backoff strategy, reduce the frequency of requests, and consider batching operations when possible. The response headers will include information about your rate limit status.

### How do I fix FAILED_VALIDATION errors?

The error message will include details about which fields failed validation and why. Make sure your data meets all the validation requirements for the collection.

### Why am I getting INVALID_QUERY errors?

Check your filter syntax, make sure you're using supported operators, and verify that field names exist in the collection. The error message should provide more specific information about what's wrong with your query.
`,
	},
	
	// Validation errors
	{
		uri: 'mcp://docs/validation-errors',
		mimeType: 'text/markdown',
		name: 'Validation Errors',
		description: 'Detailed explanation of validation errors in Directus',
		text: `# Validation Errors in Directus

## Understanding FAILED_VALIDATION Errors

Validation errors occur when the data you provide doesn't satisfy the validation rules set for a collection. These rules can be defined at various levels:

1. **Database schema constraints**: Required fields, field types, length limits, etc.
2. **Field validation rules**: Custom validation rules set in the field configuration
3. **Permission validation rules**: Validation conditions set in the permissions
4. **Collection hooks**: Custom validation logic in hooks

## Validation Error Response Format

When a validation error occurs, the system returns a FAILED_VALIDATION error with details about which fields failed validation and why.

Example error response:

\`\`\`json
{
  "errors": [
    {
      "message": "Validation failed",
      "extensions": {
        "code": "FAILED_VALIDATION",
        "fields": {
          "title": "Field is required",
          "email": "Must be a valid email address",
          "age": "Must be greater than or equal to 18"
        }
      }
    }
  ]
}
\`\`\`

## Common Validation Error Types

### Required Fields

A field is marked as required but was not provided or was null.

**Example error**: \`"title": "Field is required"\`

**Solution**: Ensure all required fields have values when creating or updating items.

### Type Validation

The provided value doesn't match the expected type for the field.

**Example errors**:
- \`"email": "Must be a valid email address"\`
- \`"website": "Must be a valid URL"\`
- \`"published_date": "Must be a valid date"\`

**Solution**: Ensure the values match the expected format for each field type.

### Numeric Constraints

The provided number doesn't meet the defined constraints.

**Example errors**:
- \`"age": "Must be greater than or equal to 18"\`
- \`"rating": "Must be less than or equal to 5"\`

**Solution**: Check the min, max, or other numeric constraints for the field.

### String Length

The string length doesn't meet the defined constraints.

**Example errors**:
- \`"title": "Must be between 5 and 100 characters long"\`
- \`"description": "Must be at most 500 characters long"\`

**Solution**: Adjust the text to meet the length requirements.

### Unique Values

The provided value conflicts with an existing value in a unique field.

**Example error**: \`"username": "Must be unique"\`

**Solution**: Choose a different value that doesn't already exist in the collection.

### Relational Validation

Issues with relational data.

**Example errors**:
- \`"author": "Referenced item does not exist"\`
- \`"categories": "One or more referenced items do not exist"\`

**Solution**: Ensure that referenced items exist and you have permission to access them.

### Custom Validation

Custom validation rules defined for the field or collection.

**Example error**: \`"password": "Must contain at least one uppercase letter, one lowercase letter, and one number"\`

**Solution**: Follow the specific validation rule described in the error message.

## Handling Validation Errors

### Best Practices for Validation Error Handling

1. **Prevalidate in the frontend**: Implement client-side validation that matches the backend rules to catch issues early.

2. **Display specific field errors**: Show validation errors next to the relevant fields in your UI.

3. **Provide clear guidance**: Include helper text to explain validation requirements before users submit data.

4. **Preserve user input**: When validation fails, don't clear the form; keep the user's input and highlight the errors.

5. **Group related errors**: If multiple fields in a section have errors, consider showing a section-level error message.

### Code Example: Processing Validation Errors

\`\`\`javascript
async function createItem(collection, data) {
  try {
    const result = await mcp.invoke('create_item', {
      collection,
      data
    });
    return { success: true, data: result };
  } catch (error) {
    if (error.code === 'FAILED_VALIDATION') {
      // Extract validation errors
      const fieldErrors = {};
      
      if (error.extensions && error.extensions.fields) {
        // Process structured field errors
        return { 
          success: false, 
          type: 'validation', 
          errors: error.extensions.fields 
        };
      } else {
        // Handle unstructured error
        return { 
          success: false, 
          type: 'validation', 
          errors: { _general: error.message } 
        };
      }
    }
    
    // Handle other types of errors
    return { 
      success: false, 
      type: 'error', 
      message: error.message 
    };
  }
}

// Usage
const result = await createItem('articles', { 
  title: '', 
  content: 'Test content'
});

if (!result.success && result.type === 'validation') {
  // Display field errors
  for (const [field, errorMessage] of Object.entries(result.errors)) {
    displayFieldError(field, errorMessage);
  }
}
\`\`\`

## Validation Rules in Directus

### How Validation Rules Are Defined

1. **Field Configuration**: When setting up a field in Directus, you can define validation rules such as:
   - Required fields
   - Min/max values for numbers
   - Min/max length for strings
   - Allowed values (enum-like validation)
   - Regex patterns

2. **Permission Validation**: In the permissions settings, you can define validation conditions that determine whether a create/update operation is allowed.

3. **Custom Hooks**: For more complex validation logic, hooks can be used to implement custom validation rules.

### Example: Setting Up Validation Rules

#### For a Text Field
- Required: Yes
- Min Length: 5
- Max Length: 100
- Pattern: ^[A-Za-z0-9 ]+$ (alphanumeric and spaces only)

#### For a Number Field
- Required: Yes
- Min Value: 0
- Max Value: 100
- Step: 1 (integers only)

#### For a Relationship Field
- Required: Yes
- Allow None: No (must have a relation)

## Troubleshooting Validation Errors

### Common Issues and Solutions

#### "Field is required" even when providing a value
- Check if you're explicitly sending \`null\` or an empty string
- Ensure the field name is correct (case-sensitive)
- Verify the value isn't being removed by a hook or middleware

#### Unique constraint failures
- Check if an item with the same value already exists
- For updates, ensure you're not trying to change to a value that already exists
- Check if uniqueness is enforced across multiple fields

#### Related item validation failures
- Verify the related item exists
- Check if you have permission to access/reference the related item
- Ensure the relationship is configured correctly

#### Custom validation rule failures
- Review the specific requirements for the field
- Check if there are hooks adding custom validation
- Look for permission-based validation rules

### Debugging Validation

1. **Check the API response**: Look at the full error response for detailed field errors.

2. **Review field settings**: Check the field configuration in the Directus Admin app.

3. **Check permissions**: Look at permission settings that might include validation rules.

4. **Test with minimal data**: Try creating an item with just the required fields to isolate the issue.

5. **Examine hooks**: If using custom hooks, check if they're adding validation logic.

## Advanced Validation Topics

### Conditional Validation

Some fields may be required only when certain conditions are met. For example, a "shipping address" might be required only when "shipping method" is set to "physical".

This type of validation is typically implemented using:
- Custom hooks
- Permission validation rules
- Frontend validation logic

### Relational Data Validation

When working with relational data, validation becomes more complex:

- **Many-to-One**: Validate that the referenced item exists and is accessible
- **One-to-Many**: Validate that child items meet their own validation rules
- **Many-to-Many**: Validate junction data and referenced items
- **Many-to-Any**: Validate that the referenced collection is allowed and the item exists

### Handling File Upload Validation

File uploads have specific validation concerns:

- File size limits
- Allowed file types
- Image dimensions
- File count limits

### Validation in Transactions

When updating multiple related items in a transaction, validation happens for each item, and the entire transaction fails if any validation fails.
`,
	},
];

// Resource decorator for Error Handling resources
export class ErrorHandlingResourceDecorator extends MCPResourceHandlerDecorator {
  constructor(handler: IMCPResourceHandler) {
    super(handler, errorHandlingResources);
  }
}

// Export resources array for combining in main resources file if needed
export { errorHandlingResources };