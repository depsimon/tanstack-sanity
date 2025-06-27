import { visionTool } from "@sanity/vision";
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { cloudflareR2Files } from "sanity-plugin-r2-files";
import { schemaTypes } from "./schemaTypes";

export default defineConfig({
	name: "default",
	title: "Tanstack News",

	projectId: import.meta.env.SANITY_STUDIO_PROJECT_ID,
	dataset: import.meta.env.SANITY_STUDIO_DATASET,

	plugins: [
		structureTool(),
		visionTool(),
		cloudflareR2Files({
			toolTitle: "Media Library",
			credentials: {
				url: import.meta.env.SANITY_STUDIO_R2_URL,
				workerUrl: import.meta.env.SANITY_STUDIO_R2_WORKER_URL,
			},
		}),
	],

	schema: {
		types: schemaTypes,
	},
});
