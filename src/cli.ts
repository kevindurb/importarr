import { type ParseArgsOptionsConfig, parseArgs } from "node:util";
import { refreshFiles } from "./lib/file-scanner";

const actions: Record<string, Record<string, () => Promise<unknown>>> = {
	refresh: {
		files: refreshFiles,
	},
};

const options: ParseArgsOptionsConfig = {
	sourcePath: {
		type: "string",
		short: "s",
	},
};

async function main(args: string[]) {
	const { values, positionals } = parseArgs({
		args,
		options,
		allowPositionals: true,
	});

	if (positionals.length < 2) throw new Error("incorrect arguments");

	if (typeof values.sourcePath === "string") {
		process.env.SOURCE_PATH = values.sourcePath;
	}

	const action = positionals.reduce<any>((obj, key) => obj?.[key], actions);

	if (typeof action !== "function") throw new Error("not a valid action");

	await action();
}

await main(process.argv.slice(2));
