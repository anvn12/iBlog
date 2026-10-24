import { useState, useEffect, useRef, useContext } from "react";
import AuthContext from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import { Editor } from '@tinymce/tinymce-react';
import Modal from 'react-modal';
Modal.setAppElement('#root');


const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";
const TINYMCE_API = import.meta.env.VITE_TINYMCE_API;


const customStyles = {
	content: {
		top: '50%',
		left: '50%',
		right: 'auto',
		bottom: 'auto',
		marginRight: '-50%',
		transform: 'translate(-50%, -50%)',
	},
};


function Home() {
	const navigate = useNavigate();

	const user = useContext(AuthContext);

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


	// New post
	const [modalIsOpen, setIsOpen] = useState(false);
	const [error, setError] = useState(null);
	const [validationErrors, setValidationErrors] = useState([]);

	function openModal() {
		setError(null);
		setValidationErrors([]);

		if (!user?.JWT) {
			navigate('/login');
			return;
		}
		setIsOpen(true);
	}
	function closeModal() {
		setError(null);
		setValidationErrors([]);
		setIsOpen(false);
	}

	const [postTitle, setPostTitle] = useState("");
	function handleChangePostTitle(event) {
		setPostTitle(event.target.value);
	}

	const editorRef = useRef(null);

	const [published, setPublished] = useState(true);
	const changeSelectOptionHandler = (event) => {
		setPublished(event.target.value);
	};

	async function createNewPost() {
		setError(null);
		setValidationErrors([]);

		const content = editorRef.current ? editorRef.current.getContent() : "";

		try {
			const res = await fetch(POSTS_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${user.JWT}`
				},
				body: JSON.stringify({
					title: postTitle.trim(),
					content: content.trim(),
					published
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationErrors(result.errors);
				} else {
					setError(result.error || result.message || "Failed to create new post.");
				}
				return;
			}

			setPostTitle("");
			setPublished(true);
			editorRef.current.setContent('')
			closeModal()
			setReloadPost(!reloadPost)
		} catch (err) {
			console.error(err);
		}
	}


	return (
		<main className="container">
			<div className="page-header">
				<h1>Latest Posts</h1>
				<p>Discover stories from our community</p>

				<button onClick={openModal}>New Post</button>
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

									,&nbsp;

									<span>
										{new Date(post.updatedAt).toLocaleDateString()}
									</span>
								</p>
							</div>
						</article>
					)
				})}
			</div>

			<div>
				<Modal
					isOpen={modalIsOpen}
					onRequestClose={closeModal}
					style={customStyles}
					contentLabel="New Post Modal"
				>
					<div>
						<button onClick={closeModal}>Cancel</button>
						<h2>New Post</h2>
					</div>

					<div>
						<input type="text" placeholder="Title" name="title" value={postTitle} onChange={handleChangePostTitle} />

						<Editor
							apiKey={TINYMCE_API}
							onInit={(evt, editor) => editorRef.current = editor}
							initialValue="<p>This is the initial content of the editor.</p>"
							init={{
								height: 300,
								menubar: false,
								plugins: [
									'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
									'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
									'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
								],
								toolbar: 'undo redo | blocks | ' +
									'bold italic forecolor | alignleft aligncenter ' +
									'alignright alignjustify | bullist numlist outdent indent | ' +
									'removeformat | help',
								content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }'
							}}
						/>

						<div>
							<label htmlFor="published">Published: </label>
							<select name="published" id="published" onChange={changeSelectOptionHandler}>
								<option value="true">True</option>
								<option value="false">False</option>
							</select>
						</div>
					</div>

					<button onClick={createNewPost}>Post</button>
				</Modal>
			</div>
		</main >
	);
}

export default Home;
