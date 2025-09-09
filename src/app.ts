import { Hono } from "hono";
import { router } from "./routes/router";
export const app = new Hono();

app.route("/", router);
