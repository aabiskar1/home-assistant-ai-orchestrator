import { z } from 'zod';

export const homeAssistantStateSchema = z.object({
  entity_id: z.string(),
  state: z.string(),
  attributes: z.record(z.string(), z.unknown()),
  last_changed: z.string(),
  last_updated: z.string(),
});

export const homeAssistantStatesSchema = z.array(homeAssistantStateSchema);

export type HomeAssistantState = z.infer<typeof homeAssistantStateSchema>;
