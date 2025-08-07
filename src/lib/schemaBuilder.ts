import { ZOD_PROPS, ZOD_METADATA } from "./constants";
import { zodFormat, zodType } from "./schemaMapper";

function getSchema(Type: { new() }) {
	const input = new Type();
	const output = {};
	Object.keys(Reflect.getMetadata(ZOD_PROPS, input)).forEach(field => {
		const type = Reflect.getMetadata(ZOD_METADATA.type, input, field);
		const format = Reflect.getMetadata(ZOD_METADATA.format, input, field);
		
		let zod = undefined;
		if (type) {
			zod = zodType(type);
		} 
		if (format) {
			zod = zodFormat(format);
		}
		const optional = Reflect.getMetadata(ZOD_METADATA.optional, input, field);
		if (optional) {
			zod = zod.optional();
		}
		output[field] = zod;
	})
	return output;
}

export default getSchema