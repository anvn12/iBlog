import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router";
import AuthContext from "../context/AuthContext";
import parse from 'html-react-parser';
import DOMPurify from 'dompurify';

import Comment from "./Comment";

const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";



function Post() {
    const user = useContext(AuthContext);
    const navigate = useNavigate();

    const params = useParams();
    const postId = params.id;

    const SERVER_POSTS_ID_URL = `${POSTS_URL}/${postId}`

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
                    "Authorization": `Bearer ${user.JWT}`
                }
            });

            if (!res.ok) {
                // setError(result.error || result.message || "Failed to delete post.");
                return;
            }

            navigate('/');
        } catch (err) {
            console.error(err);
            // setError("Unable to connect to the server. Please try again later.");
        }
    }


    function reload() {
        setReloadPost(!reloadPost);
    }


    if (!post) {
        return <></>
    }

    return (
        <main className="container">
            <div>
                <h1>{post.title && post.title}</h1>

                <p>
                    Author:
                    &nbsp;
                    <Link to={"/users/" + post.author.id}>
                        {post.author && post.author.username}
                    </Link>
                </p>

                {/* <p>{post.createdAt && "createdAt: " + (new Date(post.createdAt).toLocaleDateString())}</p> */}
                {/* <p>{post.updatedAt && "updatedAt: " + (new Date(post.updatedAt).toLocaleDateString())}</p> */}

                {post.content && <div className="post-content">{parse(DOMPurify.sanitize(post.content))}</div>}

                {
                    (user.profile && post.author.id === user.profile.id) &&
                    <button onClick={() => deletePost()}>Remove Post</button>
                }
            </div>

            <Comment
                user={user}
                comments={post.comments}
                reload={reload}
                SERVER_POSTS_ID_URL={SERVER_POSTS_ID_URL}
            />
        </main >
    );
}

export default Post;
