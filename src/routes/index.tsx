import type { SanityDocument } from "@sanity/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { client } from "~/sanity/client";

const POSTS_QUERY = `*[
  _type == "post"
  && defined(slug.current)
]|order(publishedAt desc)[0...12]{_id, title, slug, publishedAt}`;

export const Route = createFileRoute("/")({
	component: Home,
});

function Home() {
	const { data: posts } = useSuspenseQuery({
		queryKey: ["post"],
		queryFn: () => {
			return client.fetch<SanityDocument[]>(POSTS_QUERY);
		},
	});

	return (
		<main className="container mx-auto min-h-screen max-w-3xl p-8">
			<h1 className="text-4xl font-bold mb-8">Posts</h1>
			<ul className="flex flex-col gap-y-4">
				{posts.map((post) => (
					<li className="hover:underline" key={post._id}>
						<Link to="/posts/$slug" params={{ slug: post.slug.current }}>
							<h2 className="text-xl font-semibold">{post.title}</h2>
							<p>{new Date(post.publishedAt).toLocaleDateString()}</p>
						</Link>
					</li>
				))}
			</ul>
		</main>
	);
}
