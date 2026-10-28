import { useState } from "react";
import { Link } from "react-router";


function Comment({
    user,
    comments,
    reload,
    SERVER_POSTS_ID_URL
}) {
    const [commentContent, setCommentContent] = useState("");
    const [validationErrors, setValidationErrors] = useState([]);
    const [validationEditingCommentErrors, setValidationEditingCommentErrors] = useState([]);
    const [editingComment, setEditingComment] = useState({
        status: false,
        commentId: "",
        content: "",
    });

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
                    "Authorization": `Bearer ${user.JWT}`
                },
                body: JSON.stringify({
                    content: commentContent
                }),
            });

            const result = await res.json();

            if (!res.ok) {
                setValidationErrors(result.errors);
                return;
            }

            reload();
            setCommentContent("");
        } catch (err) {
            console.error(err);
        }
    }

    async function deleteComment(commentId) {
        const TARGET_URL = `${COMMENTS_URL}/${commentId}`;

        try {
            const res = await fetch(TARGET_URL, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.JWT}`
                }
            });

            if (!res.ok) {
                return;
            }

            reload();
        } catch (err) {
            console.error(err);
        }
    }


    // Edit comment
    function toggleEditComment(comment) {
        setValidationEditingCommentErrors([]);

        setEditingComment({
            status: true,
            commentId: comment.id,
            content: comment.content,
        })
    }
    function handleChangeEditingCommentContent(event) {
        setEditingComment({
            ...editingComment,
            content: event.target.value,
        })
    }
    function closeEditingComment() {
        setValidationEditingCommentErrors([]);

        setEditingComment({
            ...editingComment,
            status: false,
        })
    }
    async function saveEditingComment() {
        const TARGET_URL = `${COMMENTS_URL}/${editingComment.commentId}`;

        try {
            const res = await fetch(TARGET_URL, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${user.JWT}`
                },
                body: JSON.stringify({
                    content: editingComment.content.trim() || "",
                })
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
                <p key={i} role="alert" style={{ color: "red" }}>
                    {error.msg}
                </p>
            ));
    }

    function getEditingCommentError(fieldName) {
        return validationEditingCommentErrors
            .filter((error) => error.path === fieldName)
            .map((error, i) => (
                <p key={i} role="alert" style={{ color: "red" }}>
                    {error.msg}
                </p>
            ));
    }


    return (
        <div>
            <h2>Comments</h2>

            <div>
                {user.profile ? (
                    <form onSubmit={postNewComment}>
                        {getFieldError("content")}
                        <input
                            type="text"
                            name="content"
                            value={commentContent}
                            onChange={handleChangeCommentContent}
                            placeholder="Comment"
                        />

                        {commentContent && (
                            <button type="submit">Post</button>
                        )}
                    </form>
                ) : (
                    <p>Log in or sign up to comment</p>
                )}
            </div>


            {comments && comments.map(comment => {
                return (
                    <div key={comment.id}>
                        <div>
                            <span>
                                <Link to={"/users/" + comment.author.id}>{comment.author.username}</Link>
                            </span>

                            ,&nbsp;

                            <span>
                                {(new Date(comment.updatedAt).toLocaleDateString())}
                            </span>
                        </div>

                        {(editingComment.status === true &&
                            editingComment.commentId === comment.id) ? (

                            <div>
                                {getEditingCommentError("content")}

                                <input
                                    type="text"
                                    value={editingComment.content}
                                    onChange={handleChangeEditingCommentContent}
                                />

                                <div>
                                    <button onClick={saveEditingComment}>
                                        Save
                                    </button>

                                    <button onClick={closeEditingComment}>
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div>
                                    <p>{comment.content}</p>
                                </div>

                                {(user.profile && comment.author.id === user.profile.id) &&
                                    <div>
                                        <button onClick={() => toggleEditComment(comment)}>
                                            Edit
                                        </button>

                                        <button onClick={() => deleteComment(comment.id)}>
                                            Remove
                                        </button>
                                    </div>
                                }
                            </div>
                        )}
                    </div>
                )
            })}
        </div >
    )
}

export default Comment