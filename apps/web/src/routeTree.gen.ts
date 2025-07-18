/** biome-ignore-all lint/suspicious/noExplicitAny: code generated by @tanstack/react-start */

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

import { Route as rootRouteImport } from "./routes/__root";
import { Route as IndexRouteImport } from "./routes/index";
import { Route as PostsSlugRouteImport } from "./routes/posts/$slug";

const IndexRoute = IndexRouteImport.update({
	id: "/",
	path: "/",
	getParentRoute: () => rootRouteImport,
} as any);
const PostsSlugRoute = PostsSlugRouteImport.update({
	id: "/posts/$slug",
	path: "/posts/$slug",
	getParentRoute: () => rootRouteImport,
} as any);

export interface FileRoutesByFullPath {
	"/": typeof IndexRoute;
	"/posts/$slug": typeof PostsSlugRoute;
}
export interface FileRoutesByTo {
	"/": typeof IndexRoute;
	"/posts/$slug": typeof PostsSlugRoute;
}
export interface FileRoutesById {
	__root__: typeof rootRouteImport;
	"/": typeof IndexRoute;
	"/posts/$slug": typeof PostsSlugRoute;
}
export interface FileRouteTypes {
	fileRoutesByFullPath: FileRoutesByFullPath;
	fullPaths: "/" | "/posts/$slug";
	fileRoutesByTo: FileRoutesByTo;
	to: "/" | "/posts/$slug";
	id: "__root__" | "/" | "/posts/$slug";
	fileRoutesById: FileRoutesById;
}
export interface RootRouteChildren {
	IndexRoute: typeof IndexRoute;
	PostsSlugRoute: typeof PostsSlugRoute;
}

declare module "@tanstack/react-router" {
	interface FileRoutesByPath {
		"/": {
			id: "/";
			path: "/";
			fullPath: "/";
			preLoaderRoute: typeof IndexRouteImport;
			parentRoute: typeof rootRouteImport;
		};
		"/posts/$slug": {
			id: "/posts/$slug";
			path: "/posts/$slug";
			fullPath: "/posts/$slug";
			preLoaderRoute: typeof PostsSlugRouteImport;
			parentRoute: typeof rootRouteImport;
		};
	}
}

const rootRouteChildren: RootRouteChildren = {
	IndexRoute: IndexRoute,
	PostsSlugRoute: PostsSlugRoute,
};
export const routeTree = rootRouteImport
	._addFileChildren(rootRouteChildren)
	._addFileTypes<FileRouteTypes>();
