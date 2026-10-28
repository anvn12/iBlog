import { useState } from "react";
import { Link } from "react-router";
import { toast } from "react-toastify";
import ConfirmModal from "./ConfirmModal";
import ModalController from "./ModalController";

function Comment({ user, comments, reload, SERVER_POSTS_ID_URL }) {
	const [commentContent, setCommentContent] = useState("");
	const [validationErrors, setValidationErrors] = useState([]);
	const [validationEditingCommentErrors, setValidationEditingCommentErrors] =
		useState([]);
	const [editingComment, setEditingComment] = useState({
		status: false,
		commentId: "",
		content: "",
	});

	// delete comment confirm modal
	const [deleteCommentId, setDeleteCommentId] = useState(null);
	const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
	const deleteModalController = new ModalController(
		"Remove Comment",
		deleteModalIsOpen,
		setDeleteModalIsOpen
	);

	const COMMENTS_URL = `${SERVER_POSTS_ID_URL}/comments`;

	function handleChangeCommentContent(event) {
		setCommentContent(event.target.value);
	}

	async function postNewComment(event) {
		event.preventDefault();
		setValidationErrors([]);

		try {
			const res = await fetch(COMMENTS_URL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
				body: JSON.stringify({
					content: commentContent,
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				setValidationErrors(result.errors);
				return;
			}

			reload();
			toast.success("Successfully posted comment");
			setCommentContent("");
		} catch (err) {
			console.error(err);
		}
	}

	async function deleteComment() {
		if (!deleteCommentId) return;
		const TARGET_URL = `${COMMENTS_URL}/${deleteCommentId}`;

		try {
			const res = await fetch(TARGET_URL, {
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
			});

			if (!res.ok) {
				return;
			}

			toast.success("Successfully deleted comment");
			setDeleteCommentId(null);
			reload();
		} catch (err) {
			console.error(err);
		}
	}

	function openDeleteModal(commentId) {
		setDeleteCommentId(commentId);
		deleteModalController.openModal();
	}

	// Edit comment
	function toggleEditComment(comment) {
		setValidationEditingCommentErrors([]);

		setEditingComment({
			status: true,
			commentId: comment.id,
			content: comment.content,
		});
	}
	function handleChangeEditingCommentContent(event) {
		setEditingComment({
			...editingComment,
			content: event.target.value,
		});
	}
	function closeEditingComment() {
		setValidationEditingCommentErrors([]);

		setEditingComment({
			...editingComment,
			status: false,
		});
	}
	async function saveEditingComment() {
		const TARGET_URL = `${COMMENTS_URL}/${editingComment.commentId}`;

		try {
			const res = await fetch(TARGET_URL, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
				body: JSON.stringify({
					content: editingComment.content.trim() || "",
				}),
			});

			const result = await res.json();

			if (!res.ok) {
				if (result.errors) {
					setValidationEditingCommentErrors(result.errors);
				}
				return;
			}

			setValidationEditingCommentErrors([]);
			closeEditingComment();
			toast.success("Successfully updated comment");
			reload();
		} catch (err) {
			console.error(err);
		}
	}

	// error message
	function getFieldError(fieldName) {
		return validationErrors
			.filter((error) => error.path === fieldName)
			.map((error, i) => (
				<p key={i} className="error-message">
					{error.msg}
				</p>
			));
	}

	function getEditingCommentError(fieldName) {
		return validationEditingCommentErrors
			.filter((error) => error.path === fieldName)
			.map((error, i) => (
				<p key={i} className="error-message">
					{error.msg}
				</p>
			));
	}

	return (
		<div className="comments-section">
			<h2>Comments</h2>

			<div>
				{user.profile ? (
					<form className="comment-form" onSubmit={postNewComment}>
						<div className="input-wrapper">
							{getFieldError("content")}
							<input
								type="text"
								name="content"
								value={commentContent}
								onChange={handleChangeCommentContent}
								placeholder="Write a comment..."
							/>
						</div>

						{commentContent && (
							<button
								className="btn btn-primary comment-form-btn"
								type="submit"
							>
								Post
							</button>
						)}
					</form>
				) : (
					<p className="comment-login-prompt">
						<Link to="/login">Log in</Link> or{" "}
						<Link to="/signup">sign up</Link> to comment
					</p>
				)}
			</div>

			{comments.length === 0 ? (
				<div className="no-comments">No comments yet</div>
			) : (
				<div className="comment-list">
					{comments.map((comment) => {
						return (
							<div className="comment-item" key={comment.id}>
								<div className="comment-header">
									<Link
										to={
											"/users/" + comment.author.id
										}
										className="text-truncate"
										style={{ maxWidth: '120px' }}
									>
										{comment.author.username}
									</Link>
									<span>·</span>
									<span>
										{new Date(
											comment.updatedAt
										).toLocaleDateString()}
									</span>
								</div>

								{editingComment.status === true &&
									editingComment.commentId === comment.id ? (
									<div className="comment-edit-form">
										{getEditingCommentError("content")}
										<input
											type="text"
											value={editingComment.content}
											onChange={
												handleChangeEditingCommentContent
											}
										/>

										<div className="comment-edit-actions">
											<button
												className="btn btn-primary btn-sm"
												onClick={saveEditingComment}
											>
												Save
											</button>

											<button
												className="btn btn-sm"
												onClick={closeEditingComment}
											>
												Cancel
											</button>
										</div>
									</div>
								) : (
									<div>
										<div className="comment-body">
											<p>{comment.content}</p>
										</div>

										{user.profile &&
											comment.author.id ===
											user.profile.id && (
												<div className="comment-actions">
													<button
														className="btn btn-sm"
														onClick={() =>
															toggleEditComment(
																comment
															)
														}
													>
														Edit
													</button>

													<button
														className="btn btn-danger btn-sm"
														onClick={() =>
															openDeleteModal(
																comment.id
															)
														}
													>
														Remove
													</button>
												</div>
											)}
									</div>
								)}
							</div>
						);
					})}
				</div>
			)}

			<ConfirmModal
				modalController={deleteModalController}
				onConfirm={deleteComment}
				message="Are you sure you want to remove this comment? This action cannot be undone."
			/>
		</div>
	);
}

export default Comment;
