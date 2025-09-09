import Bun from "bun";
import { app } from "./app";

Bun.serve({
	port: 1337,
	fetch: app.fetch,
});
