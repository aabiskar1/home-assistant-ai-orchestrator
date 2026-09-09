import { env } from '../config/env.js';
import { homeAssistantStatesSchema, type HomeAssistantState } from './schemas.js';

export const getHomeAssistantStates = async (): Promise<HomeAssistantState[]> => {
  const response = await fetch(`${env.HA_URL}/api/states`, {
    headers: {
      Authorization: `Bearer ${env.HA_TOKEN}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error(`Home Assistant request failed: ${response.status} ${response.statusText}`);
  }

  const data: unknown = await response.json();

  return homeAssistantStatesSchema.parse(data);
};
