import { useEffect, useRef, useState } from "react";
import { Editor } from "@tinymce/tinymce-react";
import Modal from "react-modal";

Modal.setAppElement("#root");

const TINYMCE_API = import.meta.env.VITE_TINYMCE_API;

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
	},
};

function PostModal({
	modalController,
	originalPost = {},
	targetFunction,
	validationErrors,
}) {
	const editorRef = useRef(null);

	const [title, setTitle] = useState(originalPost.title || "");
	const [content, setContent] = useState(originalPost.content || "");
	const [published, setPublished] = useState(
		originalPost.published !== undefined ? originalPost.published : true
	);

	useEffect(() => {
		if (modalController.isOpen) {
			setTitle(originalPost.title || "");
			setContent(originalPost.content || "");
			setPublished(
				originalPost.published !== undefined
					? originalPost.published
					: true
			);
		}
	}, [modalController.isOpen, originalPost]);

	function handleChangeTitle(event) {
		setTitle(event.target.value);
	}
	function handleChangeContent(value) {
		setContent(value);
	}
	function handleChangePublished(event) {
		setPublished(event.target.value);
	}

	function getFieldError(fieldName) {
		return validationErrors
			.filter((error) => error.path === fieldName)
			.map((error, i) => (
				<p key={i} className="error-message">
					{error.msg}
				</p>
			));
	}

	return (
		<Modal
			isOpen={modalController.isOpen}
			onRequestClose={modalController.closeModal}
			style={customStyles}
			contentLabel="Post Modal"
		>
			<div className="modal-header">
				<h2>{modalController.title}</h2>
			</div>

			<div className="modal-body">
				<div className="modal-field">
					{getFieldError("title")}
					<label htmlFor="title">Title</label>
					<input
						type="text"
						placeholder="Enter post title"
						name="title"
						id="title"
						value={title}
						onChange={handleChangeTitle}
					/>
				</div>

				<div className="modal-field">
					<Editor
						apiKey={TINYMCE_API}
						onInit={(evt, editor) => (editorRef.current = editor)}
						init={{
							height: 300,
							menubar: false,
							plugins: [
								"advlist",
								"autolink",
								"lists",
								"link",
								"image",
								"charmap",
								"preview",
								"anchor",
								"searchreplace",
								"visualblocks",
								"code",
								"fullscreen",
								"insertdatetime",
								"media",
								"table",
								"code",
								"help",
								"wordcount",
							],
							toolbar:
								"undo redo | blocks | " +
								"bold italic forecolor | alignleft aligncenter " +
								"alignright alignjustify | bullist numlist outdent indent | " +
								"removeformat | help",
							content_style:
								'body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; font-size:14px }',
							branding: false,
							placeholder: "Content",
						}}
						value={content}
						onEditorChange={handleChangeContent}
					/>
				</div>

				<div className="modal-field">
					<label htmlFor="published">Published</label>
					<select
						name="published"
						id="published"
						defaultValue={published}
						onChange={handleChangePublished}
					>
						<option value="true">True</option>
						<option value="false">False</option>
					</select>
				</div>
			</div>

			<div className="modal-footer">
				<button
					className="btn btn-secondary"
					onClick={() => modalController.closeModal()}
				>
					Cancel
				</button>
				{title.length === 0 ? (
					<button
						className="btn btn-primary"
						onClick={() =>
							targetFunction(title, content, published)
						}
						disabled
					>
						Post
					</button>
				) : (
					<button
						className="btn btn-primary"
						onClick={() =>
							targetFunction(title, content, published)
						}
					>
						Post
					</button>
				)}
			</div>
		</Modal>
	);
}

export default PostModal;
