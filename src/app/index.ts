import { Hono } from 'hono';
import { serveStatic } from 'hono/bun';
import { OpenAPI as TmdbOpenApi } from '@/generated/tmdb';
import { getTmdbApiKey } from '@/util/env';
import { router } from './routes/router';
import { flashMiddleware } from './utils/flash';

TmdbOpenApi.TOKEN = getTmdbApiKey();

const app = new Hono();

app.use('/*', serveStatic({ root: './public' }));
app.use(flashMiddleware);
app.route('/', router);

export default app;
