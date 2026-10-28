import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import parse from "html-react-parser";
import DOMPurify from "dompurify";

import Comment from "./Comment";
import PostModal from "./PostModal";
import ModalController from "./ModalController";

const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";

function Post() {
	const params = useParams();
	const postId = params.id;
	const SERVER_POSTS_ID_URL = `${POSTS_URL}/${postId}`;

	const user = useContext(AuthContext);
	const navigate = useNavigate();

	const [reloadPost, setReloadPost] = useState(false); // change this var to reload the post (and the comments)
	const [post, setPost] = useState(null);

	// Fetch post details
	useEffect(() => {
		async function fetchPost() {
			try {
				const res = await fetch(SERVER_POSTS_ID_URL);
				const result = await res.json();

				setPost(result.post);
			} catch (err) {
				console.error(err);
			}
		}

		fetchPost();
	}, [SERVER_POSTS_ID_URL, reloadPost]);

	async function deletePost() {
		try {
			const res = await fetch(SERVER_POSTS_ID_URL, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
			});

			if (!res.ok) {
				return;
			}

			toast.success("Successfully deleted post");
			navigate("/");
		} catch (err) {
			console.error(err);
		}
	}

	// edit post modal
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState([]);
	const modalController = new ModalController(
		"Edit Post",
		modalIsOpen,
		setModalIsOpen
	);

	async function editPost(title, content, published) {
		try {
			const res = await fetch(SERVER_POSTS_ID_URL, {
				method: "PUT",
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

			toast.success("Successfully edited post");

			reload();
		} catch (err) {
			console.error(err);
		}
	}

	function reload() {
		setReloadPost(!reloadPost);
	}

	if (!post) {
		return <></>;
	}

	return (
		<main className="container">
			<div className="post-detail">
				<div className="post-detail-header">
					<h1>{post.title && post.title}</h1>

					<div className="post-detail-meta">
						<span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
							By{" "}
							<Link to={"/users/" + post.author.id} className="text-truncate" style={{ maxWidth: '200px' }}>
								{post.author && post.author.username}
							</Link>
						</span>
						{post.createdAt && (
							<span>
								Created{" "}
								{new Date(
									post.createdAt
								).toLocaleDateString()}
							</span>
						)}
						{post.updatedAt && (
							<span>
								Updated{" "}
								{new Date(
									post.updatedAt
								).toLocaleDateString()}
							</span>
						)}
					</div>
				</div>

				{user.profile && post.author.id === user.profile.id && (
					<div className="post-detail-actions">
						<button
							className="btn btn-primary btn-sm"
							onClick={() => {
								setValidationErrors([]);
								modalController.openModal();
							}}
						>
							Edit
						</button>

						<button
							className="btn btn-danger btn-sm"
							onClick={deletePost}
						>
							Remove
						</button>
					</div>
				)}

				{post.content && (
					<div className="post-content">
						{parse(DOMPurify.sanitize(post.content))}
					</div>
				)}
			</div>

			<Comment
				user={user}
				comments={post.comments}
				reload={reload}
				SERVER_POSTS_ID_URL={SERVER_POSTS_ID_URL}
			/>

			<PostModal
				modalController={modalController}
				originalPost={post}
				targetFunction={editPost}
				validationErrors={validationErrors}
			/>
		</main>
	);
}

export default Post;
