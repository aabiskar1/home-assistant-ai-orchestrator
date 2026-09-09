import {describe, expect, it} from 'vitest';
import {normalizeState, normalizeStates} from '../src/home-assistant/state-normalizer.js';
import type {HomeAssistantState} from '../src/home-assistant/schemas.js';

const makeState = (
	entityId: string,
	state: string,
	attributes: Record<string, unknown> = {},
): HomeAssistantState => ({
	entity_id: entityId,
	state,
	attributes,
	last_changed: '2026-09-09T20:00:00+00:00',
	last_updated: '2026-09-09T20:00:00+00:00',
});

describe('normalizeState', () => {
	it('normalizes an allowed entity', () => {
		const result = normalizeState(
			makeState('light.kitchen_kitchen_light_1', 'on', {
				friendly_name: 'Kitchen Light 1',
			}),
			{
				allowed: new Set(['light.kitchen_kitchen_light_1']),
				denied: new Set(),
			},
		);

		expect(result).toEqual({
			entityId: 'light.kitchen_kitchen_light_1',
			domain: 'light',
			state: 'on',
			name: 'Kitchen Light 1',
			area: undefined,
		});
	});

	it('rejects an entity not in the allow list', () => {
		const result = normalizeState(makeState('light.living_room', 'on'), {
			allowed: new Set(),
			denied: new Set(),
		});

		expect(result).toBeUndefined();
	});

	it('rejects explicitly denied entities', () => {
		const entityId = 'switch.smart_switch_2203011827560051860948e1e98b4e75_outlet';

		const result = normalizeState(makeState(entityId, 'on'), {
			allowed: new Set([entityId]),
			denied: new Set([entityId]),
		});

		expect(result).toBeUndefined();
	});

	it('normalizes a list and removes non-allowed entities', () => {
		const result = normalizeStates(
			[makeState('light.kitchen_kitchen_light_1', 'on'), makeState('light.living_room', 'off')],
			{
				allowed: new Set(['light.kitchen_kitchen_light_1']),
				denied: new Set(),
			},
		);

		expect(result).toHaveLength(1);
		expect(result[0]?.entityId).toBe('light.kitchen_kitchen_light_1');
	});
});
