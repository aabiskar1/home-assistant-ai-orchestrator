import {z} from 'zod';

export const ollamaChatResponseSchema = z.object({
	message: z.object({
		role: z.literal('assistant'),
		content: z.string(),
	}),
});
