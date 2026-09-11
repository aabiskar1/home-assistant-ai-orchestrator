import type {DiscoveredEntity} from '../home-assistant/discovery.js';
import type {EntityPolicy, EntitySelector} from './schemas.js';

export type ResolvedEntityPolicy = {
	allowedEntityIds: ReadonlySet<string>;
	deniedEntityIds: ReadonlySet<string>;
};

const isSelectorMatch = (entity: DiscoveredEntity, selector: EntitySelector): boolean =>
	(selector.entityId === undefined || selector.entityId === entity.entityId) &&
	(selector.domain === undefined || selector.domain === entity.domain);

export const resolveEntityPolicy = (
	entities: DiscoveredEntity[],
	policy: EntityPolicy,
): ResolvedEntityPolicy => {
	const allowedEntityIds = new Set<string>();
	const deniedEntityIds = new Set<string>();

	for (const entity of entities) {
		const isAllowed = policy.allow.some((selector) => isSelectorMatch(entity, selector));
		const isDenied = policy.deny.some((selector) => isSelectorMatch(entity, selector));

		if (isDenied) {
			deniedEntityIds.add(entity.entityId);
		}

		if (isAllowed && !isDenied) {
			allowedEntityIds.add(entity.entityId);
		}
	}

	return {allowedEntityIds, deniedEntityIds};
};

export const selectAllowedEntities = (
	entities: DiscoveredEntity[],
	policy: ResolvedEntityPolicy,
): DiscoveredEntity[] => entities.filter((entity) => policy.allowedEntityIds.has(entity.entityId));
