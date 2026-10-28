import Modal from "react-modal";
import { useState } from "react";

Modal.setAppElement("#root");

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

function UserModal({
	modalController,
	originalProfile = {},
	targetFunction,
	validationErrors,
}) {
	const [username, setUsername] = useState(originalProfile.username || "");
	const [name, setName] = useState(originalProfile.name || "");
	const [email, setEmail] = useState(originalProfile.email || "");

	function handleChangeUsername(event) {
		setUsername(event.target.value);
	}
	function handleChangeName(event) {
		setName(event.target.value);
	}
	function handleChangeEmail(event) {
		setEmail(event.target.value);
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
		<Modal
			isOpen={modalController.isOpen}
			onRequestClose={modalController.closeModal}
			style={customStyles}
			contentLabel="User Modal"
		>
			<div>
				<h2>{modalController.title}</h2>
			</div>

			<div>
				<div>
					{getFieldError("username")}
					<label htmlFor="username">Username: </label>
					<input
						type="text"
						placeholder="username"
						name="username"
						id="username"
						value={username}
						onChange={handleChangeUsername}
					/>
				</div>

				<div>
					{getFieldError("name")}
					<label htmlFor="name">Name: </label>
					<input
						type="text"
						placeholder="name"
						name="name"
						id="name"
						value={name}
						onChange={handleChangeName}
					/>
				</div>

				<div>
					{getFieldError("email")}
					<label htmlFor="email">Email: </label>
					<input
						type="email"
						placeholder="email"
						name="email"
						id="email"
						value={email}
						onChange={handleChangeEmail}
					/>
				</div>
			</div>

			<div>
				<button
					type="submit"
					onClick={() => targetFunction(username, name, email)}
				>
					Save
				</button>

				<button onClick={() => modalController.closeModal()}>
					Cancel
				</button>
			</div>
		</Modal>
	);
}

export default UserModal;
