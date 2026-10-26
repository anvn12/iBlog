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

    function handleChangeCommentContent(event) {
        setCommentContent(event.target.value);
    }

    async function postNewComment(event) {
        event.preventDefault();
        setValidationErrors([]);

        const TARGET_URL = `${SERVER_POSTS_ID_URL}/comments`;

        try {
            const res = await fetch(TARGET_URL, {
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
        const TARGET_URL = `${SERVER_POSTS_ID_URL}/comments/${commentId}`;

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


    function getFieldError(fieldName) {
        return validationErrors
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

                        {commentContent ? (
                            <button type="submit">Post</button>
                        ) : (
                            <button type="submit" disabled>Post</button>
                        )}
                    </form>
                ) : (
                    <p>Log in or sign up to comment</p>
                )}
            </div>


            {comments && comments.map(comment => {
                return (
                    <div key={comment.id}>
                        <p>
                            <span>
                                <Link to={"/users/" + comment.author.id}>{comment.author.username}</Link>
                            </span>

                            ,&nbsp;

                            <span>
                                {(new Date(comment.updatedAt).toLocaleDateString())}
                            </span>
                        </p>

                        <p>{comment.content}</p>

                        {/* {(user.profile && comment.author.id === user.profile.id) &&
                                <button onClick={() => editComment(comment.id)}>Edit</button>
                            } */}

                        {
                            (user.profile && comment.author.id === user.profile.id) &&
                            <button onClick={() => deleteComment(comment.id)}>Remove</button>
                        }
                    </div>
                )
            })}
        </div>
    )
}

export default Comment