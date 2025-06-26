import alchemy from "alchemy";
import {
	DOStateStore,
	KVNamespace,
	TanStackStart,
	WranglerJson,
} from "alchemy/cloudflare";

const APP_NAME = process.env.APP_NAME ?? "tanstack-sanity";
const STAGE = process.env.STAGE ?? "dev";

if (!process.env.VITE_SANITY_DATASET || !process.env.VITE_SANITY_PROJECT_ID) {
	throw new Error(
		"You need to setup a VITE_SANITY_DATASET & VITE_SANITY_PROJECT_ID env variable in your .env",
	);
}

const app = await alchemy(`${APP_NAME}-cloudflare`, {
	stage: STAGE,
	phase: process.argv.includes("--destroy") ? "destroy" : "up",
	stateStore:
		process.env.ALCHEMY_STATE_STORE === "cloudflare"
			? (scope) =>
					new DOStateStore(scope, {
						apiKey: alchemy.secret(process.env.CLOUDFLARE_API_KEY),
						email: process.env.CLOUDFLARE_EMAIL,
						worker: {
							name: `${APP_NAME}-state`,
						},
					})
			: undefined,
});

const defaultKv = await KVNamespace(`${APP_NAME}-${STAGE}-kv`, {
	title: `${APP_NAME}-${STAGE}-kv`,
	adopt: true,
});

export const website = await TanStackStart(`${APP_NAME}-${STAGE}-website`, {
	projectRoot: `${process.cwd()}/apps/web`,
	command: `bun run --filter '*/web' build`,
	main: ".output/server/index.mjs",
	assets: `${process.cwd()}/apps/web/.output/public`,
	bindings: {
		DEFAULT_KV: defaultKv,
		VITE_SANITY_DATASET: process.env.VITE_SANITY_DATASET,
		VITE_SANITY_PROJECT_ID: process.env.VITE_SANITY_PROJECT_ID,
	},
});

await WranglerJson("wrangler.jsonc", {
	worker: website,
	path: `${process.cwd()}/apps/web/wrangler.jsonc`,
});

console.log({
	url: website.url,
});

await app.finalize();
