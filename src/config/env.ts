import {z} from 'zod';

const envSchema = z.object({
	HA_URL: z.url(),
	HA_TOKEN: z.string().min(1),
	OLLAMA_URL: z.url().default('http://192.168.1.207:11434'),
	OLLAMA_MODEL: z.string().default('gemma4:e2b'),
	DRY_RUN: z
		.enum(['true', 'false'])
		.default('true')
		.transform((value) => value === 'true'),
});

export const env = envSchema.parse(process.env);
