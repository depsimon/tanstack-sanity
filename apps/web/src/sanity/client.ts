import { createClient } from "@sanity/client";

export const client = createClient({
	projectId: import.meta.env.VITE_SANITY_STUDIO_PROJECT_ID,
	dataset: import.meta.env.VITE_SANITY_STUDIO_DATASET,
	apiVersion: "2024-01-01",
	useCdn: false,
});
