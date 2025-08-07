import { z } from "zod";

function zodType(type: string) {
	try {
		return z[type]();
	} catch (error) {
		console.warn(`Unknown type: ${type}`, error);
		return z.string();
	}
}

function zodFormat(format: string) {
			switch (format) {
				case 'date-time':
					return z.date();
				case 'bigint':
					return z.bigint();          
				default:
					console.warn(`Unknown format: ${format}`);
					return z.string();
			}
}

export { zodType, zodFormat };