import { useState, useEffect, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

import PostModal from "./PostModal";
import ModalController from "./ModalController";

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
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState([]);
	const modalController = new ModalController(
		"New Post",
		modalIsOpen,
		setModalIsOpen
	);

	// const [postTitle, setPostTitle] = useState("");
	// const [postContent, setPostContent] = useState("");
	// const [published, setPublished] = useState(true);

	async function createNewPost(title, content, published) {
		setValidationErrors([]);

		try {
			const res = await fetch(POSTS_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
				body: JSON.stringify({
					title: title.trim(),
					content: content.trim() || "",
					published,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationErrors(result.errors);
				}
				return;
			}

			setValidationErrors([]);
			modalController.closeModal();

			setReloadPost(!reloadPost);
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<main className="container">
			<div className="page-header">
				<h1>Latest Posts</h1>
				<p>Discover stories from our community</p>

				<button
					onClick={() => {
						setValidationErrors([]);
						modalController.openModal();
					}}
				>
					New Post
				</button>
			</div>

			<div className="posts-grid">
				{posts.length === 0 ? (
					<>
						<p>No posts</p>
					</>
				) : (
					posts.map((post) => {
						return (
							<article className="card" key={post.id}>
								<div className="card-body">
									<h2 className="post-title">
										<Link to={"/posts/" + post.id}>
											{post.title}
										</Link>
									</h2>
									<p className="post-meta">
										<span>
											By{" "}
											<Link
												to={"/users/" + post.author.id}
											>
												{post.author.username}
											</Link>
										</span>
										,&nbsp;
										<span>
											{new Date(
												post.updatedAt
											).toLocaleDateString()}
										</span>
									</p>
								</div>
							</article>
						);
					})
				)}
			</div>

			<div>
				<PostModal
					modalController={modalController}
					originalPost={{}}
					targetFunction={createNewPost}
					validationErrors={validationErrors}
				/>
			</div>
		</main>
	);
}

export default Home;
