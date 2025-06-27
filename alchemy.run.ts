import alchemy from "alchemy";
import {
	DOStateStore,
	KVNamespace,
	R2Bucket,
	TanStackStart,
	Worker,
	WranglerJson,
} from "alchemy/cloudflare";
import { Exec } from "alchemy/os";

const APP_NAME = process.env.APP_NAME ?? "tanstack-sanity";
const STAGE = process.env.STAGE ?? "dev";

const isDetroying = process.argv.includes("--destroy");

if (
	!process.env.SANITY_STUDIO_DATASET ||
	!process.env.SANITY_STUDIO_PROJECT_ID
) {
	throw new Error(
		"You need to setup a SANITY_STUDIO_DATASET & SANITY_STUDIO_PROJECT_ID env variable in your .env",
	);
}

const app = await alchemy(`${APP_NAME}-cloudflare`, {
	stage: STAGE,
	phase: isDetroying ? "destroy" : "up",
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

const r2Bucket = await R2Bucket(`${APP_NAME}-${STAGE}-r2`, {
	name: `${APP_NAME}-${STAGE}-r2`,
	adopt: true,
	empty: true,
	allowPublicAccess: true,
	// jurisdiction: "eu",
});

const r2Worker = await Worker(`${APP_NAME}-${STAGE}-r2-manager`, {
	projectRoot: `${process.cwd()}/apps/r2-manager`,
	entrypoint: "index.ts",
	adopt: true,
	bindings: {
		R2_BUCKET: r2Bucket,
		SECRET: process.env.R2_SANITY_SECRET,
		ALLOWED_ORIGINS: [
			"http://localhost:3333",
			"https://sanity-studio.com",
		].join(","),
	},
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
		SANITY_STUDIO_DATASET: process.env.SANITY_STUDIO_DATASET,
		SANITY_STUDIO_PROJECT_ID: process.env.SANITY_STUDIO_PROJECT_ID,
	},
});

await WranglerJson("wrangler.jsonc", {
	worker: website,
	path: `${process.cwd()}/apps/web/wrangler.jsonc`,
});

if (!isDetroying) {
	const sanity = await Exec(`${APP_NAME}-${STAGE}-studio`, {
		command: `bun run studio:deploy`,
		env: {
			SANITY_STUDIO_R2_WORKER_URL: r2Worker.url,
			SANITY_STUDIO_R2_URL: process.env.SANITY_STUDIO_R2_URL,
		},
	});
}

console.log({
	r2Manager: r2Worker.url,
	website: website.url,
});

await app.finalize();
