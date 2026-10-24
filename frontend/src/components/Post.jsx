import { useState, useEffect, useContext } from "react";
import { useParams } from "react-router";
import AuthContext from "../context/AuthContext";


const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";



function Post() {
    const [reloadPost, setReloadPost] = useState(false); // change this var to reload the post (and the comments)

    const [post, setPost] = useState(null);
    const params = useParams();
    const postId = params.id;


    // Fetch post details
    useEffect(() => {
        async function fetchPost() {
            try {
                const res = await fetch(`${POSTS_URL}/${postId}`);
                const result = await res.json();

                console.log('fetch post result', result);

                setPost(result.post);
            } catch (err) {
                console.error(err);
            }
        }

        fetchPost();
    }, [postId, reloadPost]);


    // Comment
    const user = useContext(AuthContext);
    const [commentContent, setCommentContent] = useState("");
    const [error, setError] = useState(null);

    function handleChangeCommentContent(event) {
        setCommentContent(event.target.value);
    }

    async function postNewComment(event) {
        event.preventDefault();
        setError(null);

        const TARGET_URL = `${POSTS_URL}/${postId}/comments`;

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
                setError(result.error || result.message || "Failed to post new comment.");
                return;
            }

            setReloadPost(!reloadPost);
            setCommentContent("");
        } catch (err) {
            console.error(err);
            setError("Unable to connect to the server. Please try again later.");
        }
    }


    if (!post) {
        return <></>
    }

    return (
        <main className="container">
            <h1>{post.title && post.title}</h1>

            <p>{post.author && "Author: " + post.author.username}</p>
            {/* <p>{post.createdAt && "createdAt: " + (new Date(post.createdAt).toLocaleDateString())}</p> */}
            {/* <p>{post.updatedAt && "updatedAt: " + (new Date(post.updatedAt).toLocaleDateString())}</p> */}

            <p>{post.content && "content: " + post.content}</p>

            <div>
                <h2>Comments</h2>

                <div>
                    {user.profile ?
                        <form onSubmit={postNewComment}>
                            {error && (
                                <div className="form-group">
                                    <p style={{ color: '#ef4444' }}>{error}</p>
                                </div>
                            )}

                            <input type="text" name="content" value={commentContent} onChange={handleChangeCommentContent} placeholder="Comment" />
                            <button type="submit">Post</button>
                        </form>
                        :
                        <p>Log in or sign up to comment</p>
                    }
                </div>


                {post.comments && post.comments.map(comment => {
                    return (
                        <div key={comment.id}>
                            {/* <p>id: {comment.id}</p> */}
                            <p>author.username: {comment.author.username}</p>
                            {/* <p>updatedAt {(new Date(comment.updatedAt).toLocaleDateString())}</p> */}
                            <p>content: {comment.content}</p>
                        </div>
                    )
                })}
            </div>

        </main>
    );
}

export default Post;
