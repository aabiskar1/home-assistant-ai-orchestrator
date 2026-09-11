import {readFile} from 'node:fs/promises';
import {entityPolicySchema, type EntityPolicy} from '../policy/schemas.js';

const entityPolicyPath = 'config/entity-policy.json';

export const loadEntityPolicy = async (): Promise<EntityPolicy> => {
	const raw = await readFile(entityPolicyPath, 'utf8');
	const parsed: unknown = JSON.parse(raw);

	return entityPolicySchema.parse(parsed);
};
