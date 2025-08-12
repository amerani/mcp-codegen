import { 
      McpRequired, 
      McpOptional, 
      Format 
} from "mcp-codegen";

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