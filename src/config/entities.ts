import {readFile} from 'node:fs/promises';
import {z} from 'zod';

const entityListSchema = z.object({
	entities: z.array(z.string()),
});

const loadEntityList = async (path: string): Promise<Set<string>> => {
	const raw = await readFile(path, 'utf8');
	const parsed: unknown = JSON.parse(raw);
	const validated = entityListSchema.parse(parsed);

	return new Set(validated.entities);
};

export const loadAllowedEntities = async (): Promise<Set<string>> =>
	loadEntityList('config/allowed-entities.json');

export const loadDeniedEntities = async (): Promise<Set<string>> =>
	loadEntityList('config/denied-entities.json');
