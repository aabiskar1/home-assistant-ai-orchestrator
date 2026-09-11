import type {HomeAssistantState} from './schemas.js';

export type DiscoveredEntity = {
	entityId: string;
	domain: string;
	homeAssistantState: HomeAssistantState;
};

export const getDomainFromEntityId = (entityId: string): string => entityId.split('.', 1)[0] ?? '';

export const discoverEntities = (states: HomeAssistantState[]): DiscoveredEntity[] =>
	states.map((state) => ({
		entityId: state.entity_id,
		domain: getDomainFromEntityId(state.entity_id),
		homeAssistantState: state,
	}));
