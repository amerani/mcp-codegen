import 'reflect-metadata';
import { ZOD_METADATA, ZOD_PROPS } from './constants';
import { Primitives } from './types';

function BaseField(options?: Partial<Record<keyof typeof ZOD_METADATA, Primitives>>) {
	return function(obj: Object, prop: string | symbol) {
		Reflect.defineMetadata(ZOD_PROPS, {
			...Reflect.getMetadata(ZOD_PROPS, obj),
			[prop]: 1,
		}, obj);

		const type = Reflect.getMetadata("design:type", obj, prop)?.name?.toLowerCase() || 'null';

		const values = options 
			? { ...options, type } 
			: { type }
			;

		Object.keys(ZOD_METADATA).forEach(key => {
			if (!values[key]) return;
			// If the metadata already exists, we skip setting it
			if (Reflect.hasMetadata(ZOD_METADATA[key], obj, prop)) {
				if (process.env.DEBUG === 'true') {
					console.log(`Metadata for ${key} already exists, skipping:`, Reflect.getMetadata(ZOD_METADATA[key], obj, prop));
				}
				return;
			}
			if (process.env.DEBUG === 'true') {
				console.log(`Defining metadata for ${key}:`, values[key]);
			}
			Reflect.defineMetadata(ZOD_METADATA[key], values[key], obj, prop);
		});
	};
}

export function McpRequired() {
	return BaseField();
}

export function McpOptional() {
			return BaseField({ optional: true });
}

export function Format(format: string) {
	return BaseField({ format });
}



