import {describe, expect, it} from 'vitest';
import {validatePlanEntityPolicy} from '../src/planning/policy.js';

const makeAction = (entityId: string) => ({
	entityId,
	domain: 'light',
	service: 'turn_off',
	reason: 'The example light is no longer needed.',
});

describe('validatePlanEntityPolicy', () => {
	it('accepts a valid action for an allowed entity', () => {
		const action = makeAction('light.example_allowed');
		const result = validatePlanEntityPolicy(
			{
				outcome: 'propose_actions',
				summary: 'Proposed plan: Turn off the allowed example light.',
				actions: [action],
			},
			{
				allowedEntityIds: new Set([action.entityId]),
				deniedEntityIds: new Set(),
			},
		);

		expect(result.outcome).toBe('propose_actions');
		expect(result.actions).toEqual([action]);
		expect(result.rejectedActions).toEqual([]);
	});

	it('rejects an action for an unlisted entity', () => {
		const result = validatePlanEntityPolicy(
			{
				outcome: 'propose_actions',
				summary: 'Proposed plan: Turn off an unlisted example light.',
				actions: [makeAction('light.example_unlisted')],
			},
			{
				allowedEntityIds: new Set(['light.example_allowed']),
				deniedEntityIds: new Set(),
			},
		);

		expect(result.outcome).toBe('no_action');
		expect(result.summary).toContain('all generated actions were rejected');
		expect(result.actions).toEqual([]);
		expect(result.rejectedActions).toEqual([
			{
				action: makeAction('light.example_unlisted'),
				reason: 'not_allowed',
			},
		]);
	});

	it('gives the deny list precedence over the allow list', () => {
		const entityId = 'light.example_denied';
		const result = validatePlanEntityPolicy(
			{
				outcome: 'propose_actions',
				summary: 'Proposed plan: Turn off a denied example light.',
				actions: [makeAction(entityId)],
			},
			{
				allowedEntityIds: new Set(),
				deniedEntityIds: new Set([entityId]),
			},
		);

		expect(result.outcome).toBe('no_action');
		expect(result.actions).toEqual([]);
		expect(result.rejectedActions[0]?.reason).toBe('denied');
	});

	it('rejects an action whose declared domain does not match its entity ID', () => {
		const action = {...makeAction('switch.example_plug'), domain: 'light'};
		const result = validatePlanEntityPolicy(
			{
				outcome: 'propose_actions',
				summary: 'Proposed plan: Turn off an example plug.',
				actions: [action],
			},
			{
				allowedEntityIds: new Set([action.entityId]),
				deniedEntityIds: new Set(),
			},
		);

		expect(result.outcome).toBe('no_action');
		expect(result.actions).toEqual([]);
		expect(result.rejectedActions).toEqual([{action, reason: 'domain_mismatch'}]);
	});

	it('separates accepted and rejected actions in a mixed plan', () => {
		const accepted = makeAction('light.example_allowed');
		const rejected = makeAction('light.example_unlisted');
		const result = validatePlanEntityPolicy(
			{
				outcome: 'propose_actions',
				summary: 'Proposed plan: Evaluate two example lights.',
				actions: [accepted, rejected],
			},
			{
				allowedEntityIds: new Set([accepted.entityId]),
				deniedEntityIds: new Set(),
			},
		);

		expect(result.outcome).toBe('propose_actions');
		expect(result.actions).toEqual([accepted]);
		expect(result.rejectedActions).toEqual([{action: rejected, reason: 'not_allowed'}]);
	});
});
