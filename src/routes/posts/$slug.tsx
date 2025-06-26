import { PortableText } from "@portabletext/react";
import type { SanityDocument } from "@sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { client } from "~/sanity/client";

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]`;

const { projectId, dataset } = client.config();

const urlFor = (source: SanityImageSource) =>
	projectId && dataset
		? imageUrlBuilder({ projectId, dataset }).image(source)
		: null;

export const Route = createFileRoute("/posts/$slug")({
	component: Page,
});

function Page() {
	const { slug } = Route.useParams();

	const { data: post } = useSuspenseQuery({
		queryKey: ["post", slug],
		queryFn: () => {
			return client.fetch<SanityDocument>(POST_QUERY, { slug });
		},
	});

	const postImageUrl = post.image
		? urlFor(post.image)?.width(550).height(310).url()
		: null;

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8 flex flex-col gap-4">
			<Link to="/" className="hover:underline">
				← Back to posts
			</Link>
			{postImageUrl && (
				<img
					src={postImageUrl}
					alt={post.title}
					className="aspect-video rounded-xl"
					width="550"
					height="310"
				/>
			)}
			<h1 className="text-4xl font-bold mb-8">{post.title}</h1>
			<div className="prose">
				<p>Published: {new Date(post.publishedAt).toLocaleDateString()}</p>
				{Array.isArray(post.body) && <PortableText value={post.body} />}
			</div>
		</main>
	);
}
