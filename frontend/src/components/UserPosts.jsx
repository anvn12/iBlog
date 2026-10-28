import { useState, useEffect, useContext } from "react";
import { useParams, Link, useSearchParams } from "react-router";
import AuthContext from "../context/AuthContext";

const USERS_URL = import.meta.env.VITE_SERVER_URL + "/users";

function UserPosts() {
	const user = useContext(AuthContext);

	const params = useParams();
	const userId = params.id;
	const USER_ID_URL = `${USERS_URL}/${userId}`;

	const [searchParams] = useSearchParams();
	const published = searchParams.get("published") || "true";

	const [displayPosts, setDisplayPosts] = useState([]);

	// Fetch user posts
	useEffect(() => {
		async function fetchUser() {
			const TARGET_URL = USER_ID_URL + "/posts?published=" + published;
			try {
				const res = await fetch(TARGET_URL, {
					method: "GET",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${user.JWT}`,
					},
				});

				const result = await res.json();

				setDisplayPosts(result.posts);
			} catch (err) {
				console.error(err);
			}
		}

		fetchUser();
	}, [USER_ID_URL, published, user.JWT]);

	if (!displayPosts) {
		return <></>;
	}

	return (
		<main className="container">
			<div className="user-posts">
				<div className="user-posts-nav">
					<Link to={"/users/" + userId}>
						← Back to Profile
					</Link>

					<div>
						{published === "true" ? (
							user.profile &&
							user.profile.id === userId && (
								<Link
									className="btn btn-outline btn-sm"
									to={{ search: "?published=false" }}
								>
									Show Unpublished
								</Link>
							)
						) : (
							<Link
								className="btn btn-outline btn-sm"
								to={{ search: "?published=true" }}
							>
								Show Published
							</Link>
						)}
					</div>
				</div>

				<table>
					<thead>
						<tr>
							<th>Title</th>
							<th>Updated At</th>
							<th>Created At</th>
						</tr>
					</thead>

					<tbody>
						{displayPosts.length === 0 ? (
							<tr>
								<td colSpan="3" className="no-comments">
									No posts
								</td>
							</tr>
						) : (
							displayPosts.map((post) => {
								return (
									<tr key={post.id}>
										<td style={{ maxWidth: '300px' }}>
											<Link
												to={"/posts/" + post.id}
												className="text-truncate"
											>
												{post.title}
											</Link>
										</td>
										<td>
											{new Date(
												post.updatedAt
											).toLocaleDateString()}
										</td>
										<td>
											{new Date(
												post.createdAt
											).toLocaleDateString()}
										</td>
									</tr>
								);
							})
						)}
					</tbody>
				</table>
			</div>
		</main>
	);
}

export default UserPosts;
