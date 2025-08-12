# mcp-codegen

The official MCP TypeScript SDK requires modeling MCP Tool Schema using a type-system called [Zod](https://zod.dev/). `mcp-codegen` allows you to leverage plain-old-TypeScript-objects.

## Installation

```bash
npm install mcp-codegen
```

## Build

This package is built using esbuild to transpile TypeScript to ES2015 (ES6) for broad compatibility. The build process generates both JavaScript and TypeScript declaration files.

```bash
npm run build:all
``` 

## Exports

The package exports the following components:

- `McpRequired()` - Decorator for required fields
- `McpOptional()` - Decorator for optional fields  
- `Format(format: string)` - Decorator for field format specification
- `SchemaBuilder` - Function to generate Zod schema from decorated classes
- `Primitives` - TypeScript type for primitive values
- `ZOD_METADATA`, `ZOD_PROPS` - Internal constants

## Dependencies

1. TypeScript experimental decorators (legacy only, TC39 coming soon)
1. [Reflect](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Reflect) and [reflect-metadata](https://github.com/microsoft/reflect-metadata)
1. [Zod to JSON Schema](https://github.com/StefanTerdell/zod-to-json-schema) (Zod4 coming soon)

## Getting Started

### Decorate TypeScript Class
Build MCP Tool schema using TypeScript classes and decorators.

```ts
import { McpRequired, McpOptional, Format } from "mcp-codegen";

export class ToolCallInput {
	im_just_a_prop: string;

	@McpRequired()
	query: string;
	
	@McpRequired()
	async: boolean;

	@McpOptional()
	max?: number;
	
	@Format('bigint')
	@McpOptional()
	variance?: number;

	@McpOptional()
	queryId?: string;

	@Format('date-time')
	@McpOptional()
	createdAt?: string;
}
```

### Generate Zod object and JSON Schema
```ts
import { ToolCallInput } from "decorated-typescript-class";
import { SchemaBuilder } from "mcp-codegen";
import zodToJsonSchema from "zod-to-json-schema";

const zodObject = SchemaBuilder(ToolCallInput);
const jsonSchema = zodToJsonSchema(z.object(zodObject));
```

#### Generated JSON Schema

```json
{
  "type": "object",
  "properties": {
    "query": {
      "type": "string"
    },
    "async": {
      "type": "boolean"
    },
    "max": {
      "type": "number"
    },
    "variance": {
      "type": "integer",
      "format": "int64"
    },
    "queryId": {
      "type": "string"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time"
    }
  },
  "required": [
    "query",
    "async"
  ],
  "additionalProperties": false,
  "$schema": "http://json-schema.org/draft-07/schema#"
}
```

### Consume in MCP Tool Handler

```ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";

new McpServer().registerTool(
    "example-tool",
    {
        title: "Example Tool",
        inputSchema: toolSchema         // Output of SchemaBuilder
    },
    (args: ToolCallInput): Promise<CallToolResult> => {
        return Promise.resolve({
            content: [
                {
                    type: "text",
                    text: `Results for query: ${args.query}`      // Required type
                },
                {
                    type: "text",
                    text: `Results requested: ${args.max || 100}` // Optional type
                }
            ]
        });
    }
)
```