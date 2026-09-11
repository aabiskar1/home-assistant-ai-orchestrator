import got from 'got';
import {env} from '../config/env.js';
import {ollamaChatResponseSchema} from './schemas.js';

export type OllamaChatMessage = {
	role: 'system' | 'user' | 'assistant';
	content: string;
};

export type OllamaChatRequest = {
	messages: OllamaChatMessage[];
	format?: Record<string, unknown>;
};

export type OllamaChatTransport = (request: OllamaChatRequest) => Promise<string>;

const ollamaClient = got.extend({
	prefixUrl: `${env.OLLAMA_URL}/api`,
	timeout: {
		request: 90_000,
	},
	retry: {
		limit: 0,
	},
});

export const requestOllamaChat: OllamaChatTransport = async (request) => {
	const data: unknown = await ollamaClient
		.post('chat', {
			json: {
				model: env.OLLAMA_MODEL,
				messages: request.messages,
				stream: false,
				think: false,
				keep_alive: '3m',
				...(request.format && {format: request.format}),
			},
		})
		.json();

	return ollamaChatResponseSchema.parse(data).message.content;
};
