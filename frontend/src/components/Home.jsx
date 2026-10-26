import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

import PostModal from "./PostModal";



const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";

function Home() {
	const user = useContext(AuthContext);

	const navigate = useNavigate();


	// fetch posts
	const [reloadPost, setReloadPost] = useState(false); // change this var to reload the post (and the comments)
	const [posts, setPosts] = useState([]);
	useEffect(() => {
		async function fetchPost() {
			try {
				const res = await fetch(POSTS_URL);
				const result = await res.json();

				setPosts(result.posts);
			} catch (err) {
				console.error(err);
			}
		}

		fetchPost();
	}, [reloadPost]);


	// New post modal
	const [validationErrors, setValidationErrors] = useState([]);
	const [isPostModalOpen, setIsPostModalOpen] = useState(false);
	const [postTitle, setPostTitle] = useState("");
	const [postContent, setPostContent] = useState("");
	const [published, setPublished] = useState(true);

	function openNewPostModal() {
		setValidationErrors([]);

		if (!user?.JWT) {
			navigate('/login');
			return;
		}

		setIsPostModalOpen(true);
	}

	async function createNewPost() {
		setValidationErrors([]);

		try {
			const res = await fetch(POSTS_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.JWT}`
				},
				body: JSON.stringify({
					title: postTitle.trim(),
					content: postContent.trim() || "",
					published
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationErrors(result.errors);
				}
				return;
			}

			setPostTitle("");
			setPostContent("");
			setPublished(true);
			setValidationErrors([]);

			setReloadPost(!reloadPost);

			// close modal
			setIsPostModalOpen(false);
		} catch (err) {
			console.error(err);
		}
	}


	return (
		<main className="container">
			<div className="page-header">
				<h1>Latest Posts</h1>
				<p>Discover stories from our community</p>

				<button onClick={openNewPostModal}>New Post</button>
			</div>

			<div className="posts-grid">
				{posts.length === 0 ? (
					<>
						<p>No posts</p>
					</>
				) : (
					posts.map(post => {
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

										,&nbsp;

										<span>
											{new Date(post.updatedAt).toLocaleDateString()}
										</span>
									</p>
								</div>
							</article>
						)
					})
				)}
			</div>

			<div>
				<PostModal
					modalTitle="New Post"
					isOpen={isPostModalOpen}
					setIsOpen={setIsPostModalOpen}
					postTitle={postTitle}
					postContent={postContent}
					published={published}
					setPostTitle={setPostTitle}
					setPostContent={setPostContent}
					setPublished={setPublished}
					targetFunction={createNewPost}
					validationErrors={validationErrors}
				/>
			</div>
		</main >
	);
}

export default Home;
