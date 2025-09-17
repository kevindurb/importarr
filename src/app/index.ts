import { Hono } from 'hono';
import { OpenAPI as TmdbOpenApi } from '@/generated/tmdb';
import { getTmdbApiKey } from '@/util/env';
import { router } from './routes/router';

TmdbOpenApi.TOKEN = getTmdbApiKey();

const app = new Hono();

app.route('/', router);

export default app;
