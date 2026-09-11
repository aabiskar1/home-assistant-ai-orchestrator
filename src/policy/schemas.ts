import {z} from 'zod';

const domainSchema = z
	.string()
	.trim()
	.min(1)
	.regex(/^[0-9_a-z]+$/v);
const entityIdSchema = z
	.string()
	.trim()
	.min(1)
	.regex(/^[0-9_a-z]+\.[0-9_a-z]+$/v);

export const entitySelectorSchema = z
	.strictObject({
		entityId: entityIdSchema.optional(),
		domain: domainSchema.optional(),
	})
	.refine((selector) => selector.entityId !== undefined || selector.domain !== undefined, {
		message: 'A selector must contain at least one supported field.',
	});

export const entityPolicySchema = z.strictObject({
	version: z.literal(1),
	allow: z.array(entitySelectorSchema),
	deny: z.array(entitySelectorSchema),
});

export type EntitySelector = z.infer<typeof entitySelectorSchema>;
export type EntityPolicy = z.infer<typeof entityPolicySchema>;
