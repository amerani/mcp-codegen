import { McpServer,  } from "@modelcontextprotocol/sdk/server/mcp.js";
import { CallToolResult } from "@modelcontextprotocol/sdk/types.js"
import getSchema from "../lib/schemaBuilder.js";
import zodToJsonSchema from 'zod-to-json-schema';
import { z } from "zod";
import { ToolCallInput } from "./schema";

const toolSchema = getSchema(ToolCallInput) as {[k: string]: z.ZodTypeAny};
const jsonSchema = zodToJsonSchema(z.object(toolSchema));
console.log(JSON.stringify(jsonSchema, null, 2));

function registerTools(server: McpServer) {
	server.registerTool(
		'example-tool',
		{
			title: 'Example Tool',
			description: 'An example tool that demonstrates how to use the MCP SDK',
			inputSchema: toolSchema
		},
		(args: ToolCallInput): Promise<CallToolResult> => {
			return Promise.resolve({
				content: [
					{
						type: 'text',
						text: `Hello, ${args.query}!`
					}
				]
			});
		}
	)
}
export default registerTools;