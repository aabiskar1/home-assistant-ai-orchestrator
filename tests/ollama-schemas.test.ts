import {describe, expect, it} from 'vitest';
import {ZodError} from 'zod';
import {ollamaChatResponseSchema} from '../src/ollama/schemas.js';

describe('ollamaChatResponseSchema', () => {
	it.each([
		{name: 'a missing message', response: {}},
		{name: 'an incorrect message role', response: {message: {role: 'user', content: '{}'}}},
		{name: 'non-string message content', response: {message: {role: 'assistant', content: 42}}},
	])('rejects $name', ({response}) => {
		expect(() => ollamaChatResponseSchema.parse(response)).toThrow(ZodError);
	});
});
