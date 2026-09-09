import { getHomeAssistantStates } from './home-assistant/client.js';

const main = async (): Promise<void> => {
  const states = await getHomeAssistantStates();

  console.log(`Connected to Home Assistant.`);
  console.log(`Received ${states.length} entities.`);
};

await main();
