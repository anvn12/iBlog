import { useState, useEffect } from "react";
import { useParams } from "react-router";


const POSTS_URL = import.meta.env.VITE_SERVER_URL + "/posts";



function Post() {
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
    }, [postId]);

    if (!post) {
        return (
            <>
            </>
        )
    }

    return (
        <main className="container">
            <h1>{post.title && post.title}</h1>

            <p>{post.author && "Author: " + post.author.username}</p>
            <p>{post.createdAt && "createdAt: " + (new Date(post.createdAt).toLocaleDateString())}</p>
            <p>{post.updatedAt && "updatedAt: " + (new Date(post.updatedAt).toLocaleDateString())}</p>

            <p>{post.content && "content: " + post.content}</p>

            <div>
                <h2>Comments</h2>

                {post.comments && post.comments.map(comment => {
                    return (
                        <div key={comment.id}>
                            <p>id: {comment.id}</p>
                            <p>author.username: {comment.author.username}</p>
                            <p>updatedAt {(new Date(comment.updatedAt).toLocaleDateString())}</p>
                            <p>content: {comment.content}</p>
                        </div>
                    )
                })}
            </div>

        </main>
    );
}

export default Post;
