import { useState, useEffect } from "react";
import { Link } from "react-router";


const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";



function Home() {
	const [posts, setPosts] = useState([]);

	useEffect(() => {
		async function fetchPost() {
			try {
				const res = await fetch(POSTS_URL);
				const result = await res.json();

				// console.log('fetch posts result', result);

				setPosts(result.posts);
			} catch (err) {
				console.error(err);
			}
		}

		fetchPost();
	}, []);


	return (
		<main className="container">
			<div className="page-header">
				<h1>Latest Posts</h1>
				<p>Discover stories from our community</p>
			</div>

			<div className="posts-grid">
				{posts.map(post => {
					return (
						<article className="card" key={post.id}>
							<div className="card-body">
								<h2 className="post-title">
									<Link to={"/posts/" + post.id}>{post.title}</Link>
								</h2>
								<p className="post-meta">
									<span>
										By <Link to={"/users/" + post.author.id}>{post.author.username}</Link>
									</span>
									<span>
										on {new Date(post.updatedAt).toLocaleDateString()}
									</span>
								</p>
							</div>
						</article>
					)
				})}
			</div>
		</main>
	);
}

export default Home;
