import got from 'got';
import {env} from '../config/env.js';
import {homeAssistantStatesSchema, type HomeAssistantState} from './schemas.js';

const homeAssistantClient = got.extend({
	prefixUrl: `${env.HA_URL}/api`,
	headers: {
		authorization: `Bearer ${env.HA_TOKEN}`,
	},
	timeout: {
		request: 10_000,
	},
	retry: {
		limit: 2,
	},
});

export const getHomeAssistantStates = async (): Promise<HomeAssistantState[]> => {
	const data: unknown = await homeAssistantClient.get('states').json();

	return homeAssistantStatesSchema.parse(data);
};
