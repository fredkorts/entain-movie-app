import { beforeAll, afterEach, afterAll } from 'vitest';
import { server } from './mocks/server';

// Setup MSW server for TMDB API mocking
beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
