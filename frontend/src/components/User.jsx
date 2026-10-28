import { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router";
import AuthContext from "../context/AuthContext";

import UserModal from "./UserModal";
import ModalController from "./ModalController";

const USERS_URL = import.meta.env.VITE_SERVER_URL + "/users";

function User() {
	const params = useParams();
	const userId = params.id;
	const USER_ID_URL = `${USERS_URL}/${userId}`;

	const user = useContext(AuthContext);

	const [reloadUser, setReloadUser] = useState(false); // change this var to reload
	const [displayUser, setdisplayUser] = useState(null);

	// Fetch user
	useEffect(() => {
		async function fetchUser() {
			try {
				const res = await fetch(USER_ID_URL);
				const result = await res.json();

				setdisplayUser(result.user);
			} catch (err) {
				console.error(err);
			}
		}

		fetchUser();
	}, [USER_ID_URL, reloadUser]);

	// edit user profile
	const [modalIsOpen, setModalIsOpen] = useState(false);
	const [validationErrors, setValidationErrors] = useState([]);
	const modalController = new ModalController(
		"Edit Profile",
		modalIsOpen,
		setModalIsOpen
	);

	async function editUser(username, name, email) {
		try {
			const res = await fetch(USER_ID_URL, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${user.JWT}`,
				},
				body: JSON.stringify({
					username: username.trim() || "",
					name: name.trim() || "",
					email: email.trim() || "",
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

			reload();
		} catch (err) {
			console.error(err);
		}
	}

	function reload() {
		setReloadUser(!reloadUser);
	}

	if (!displayUser) {
		return <></>;
	}

	return (
		<main className="container">
			<div className="user-profile">
				<div className="user-profile-card">
					<div className="user-profile-info">
						<p>
							<span className="user-profile-label">
								Username:
							</span>
							{displayUser.username || "Not set"}
						</p>
						<p>
							<span className="user-profile-label">Name:</span>
							{displayUser.name || "Not set"}
						</p>
						<p>
							<span className="user-profile-label">Email:</span>
							{displayUser.email || "Not set"}
						</p>
					</div>

					<div className="user-profile-actions">
						{user.profile &&
							user.profile.id === displayUser.id && (
								<button
									className="btn btn-primary btn-sm"
									onClick={() => {
										setValidationErrors([]);
										modalController.openModal();
									}}
								>
									Edit Profile
								</button>
							)}

						<Link
							to={"/users/" + userId + "/posts"}
							className="btn btn-outline btn-sm"
						>
							View Posts
						</Link>
					</div>
				</div>
			</div>

			<UserModal
				modalController={modalController}
				originalProfile={displayUser}
				targetFunction={editUser}
				validationErrors={validationErrors}
			/>
		</main>
	);
}

export default User;
