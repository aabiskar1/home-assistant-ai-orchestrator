import {loadAllowedEntities, loadDeniedEntities} from './config/entities.js';
import {getHomeAssistantStates} from './home-assistant/client.js';
import {normalizeStates} from './home-assistant/state-normalizer.js';

const main = async (): Promise<void> => {
	const [states, allowed, denied] = await Promise.all([
		getHomeAssistantStates(),
		loadAllowedEntities(),
		loadDeniedEntities(),
	]);

	const normalizedStates = normalizeStates(states, {
		allowed,
		denied,
	});

	console.log('Connected to Home Assistant.');
	console.log(`Received ${states.length} entities.`);
	console.log(`Allowed entities configured: ${allowed.size}.`);
	console.log(`Denied entities configured: ${denied.size}.`);
	console.log(`Normalized ${normalizedStates.length} entities.`);
};

await main();
