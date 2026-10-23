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
		<>
			<h1>Home</h1>

			<main>
				<div className="posts-container">
					{posts.map(post => {
						return (
							<Link to={"/posts/" + post.id}>

								<div className="post" key={post.id}>
									<p>
										Title: {post.title}
									</p>

									<p>
										<Link to={"/users/" + post.author.id}>
											Author: {post.author.username}
										</Link>
									</p>

									<p>Updated At: {post.updatedAt}</p>
								</div>
							</Link>
						)
					})}
				</div>
			</main>
		</>
	);
}

export default Home;
