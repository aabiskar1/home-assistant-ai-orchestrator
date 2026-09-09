import type {HomeAssistantState} from './schemas.js';

export type EntityPolicy = {
	allowed: Set<string>;
	denied: Set<string>;
};

export type NormalizedEntityState = {
	entityId: string;
	domain: string;
	state: string;
	name: string | undefined;
	area: string | undefined;
};

const getDomain = (entityId: string): string => entityId.split('.', 1)[0] ?? '';

const getStringAttribute = (
	attributes: Record<string, unknown>,
	key: string,
): string | undefined => {
	const value = attributes[key];

	return typeof value === 'string' ? value : undefined;
};

export const normalizeState = (
	entity: HomeAssistantState,
	policy: EntityPolicy,
): NormalizedEntityState | undefined => {
	if (!policy.allowed.has(entity.entity_id)) {
		return undefined;
	}

	if (policy.denied.has(entity.entity_id)) {
		return undefined;
	}

	const domain = getDomain(entity.entity_id);

	return {
		entityId: entity.entity_id,
		domain,
		state: entity.state,
		name: getStringAttribute(entity.attributes, 'friendly_name'),
		area: getStringAttribute(entity.attributes, 'area_name'),
	};
};

export const normalizeStates = (
	entities: HomeAssistantState[],
	policy: EntityPolicy,
): NormalizedEntityState[] =>
	entities
		.map((entity) => normalizeState(entity, policy))
		.filter((entity): entity is NormalizedEntityState => entity !== undefined);
