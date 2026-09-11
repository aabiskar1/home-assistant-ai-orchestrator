import {getDomainFromEntityId} from '../home-assistant/discovery.js';
import type {ResolvedEntityPolicy} from '../policy/resolver.js';
import type {Plan, PlanOutcome, ProposedAction} from './schemas.js';

export type RejectionReason = 'denied' | 'not_allowed' | 'domain_mismatch';

export type RejectedAction = {
	action: ProposedAction;
	reason: RejectionReason;
};

export type EntityPolicyValidationResult = {
	outcome: PlanOutcome;
	summary: string;
	actions: ProposedAction[];
	rejectedActions: RejectedAction[];
};

export const validatePlanEntityPolicy = (
	plan: Plan,
	policy: ResolvedEntityPolicy,
): EntityPolicyValidationResult => {
	const actions: ProposedAction[] = [];
	const rejectedActions: RejectedAction[] = [];

	for (const action of plan.actions) {
		let reason: RejectionReason | undefined;

		if (policy.deniedEntityIds.has(action.entityId)) {
			reason = 'denied';
		} else if (!policy.allowedEntityIds.has(action.entityId)) {
			reason = 'not_allowed';
		} else if (getDomainFromEntityId(action.entityId) !== action.domain) {
			reason = 'domain_mismatch';
		}

		if (reason === undefined) {
			actions.push(action);
		} else {
			rejectedActions.push({action, reason});
		}
	}

	if (plan.outcome === 'propose_actions' && actions.length === 0) {
		return {
			outcome: 'no_action',
			summary:
				'Proposed plan: No actions are proposed because all generated actions were rejected by entity-policy validation.',
			actions,
			rejectedActions,
		};
	}

	return {
		outcome: plan.outcome,
		summary: plan.summary,
		actions,
		rejectedActions,
	};
};
