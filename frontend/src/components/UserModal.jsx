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
			contentLabel="User Modal"
		>
			<div className="modal-header">
				<h2>{modalController.title}</h2>
			</div>

			<div className="modal-body">
				<div className="modal-field">
					{getFieldError("username")}
					<label htmlFor="username">Username</label>
					<input
						type="text"
						placeholder="Username"
						name="username"
						id="username"
						value={username}
						onChange={handleChangeUsername}
					/>
				</div>

				<div className="modal-field">
					{getFieldError("name")}
					<label htmlFor="name">Name</label>
					<input
						type="text"
						placeholder="Name"
						name="name"
						id="name"
						value={name}
						onChange={handleChangeName}
					/>
				</div>

				<div className="modal-field">
					{getFieldError("email")}
					<label htmlFor="email">Email</label>
					<input
						type="email"
						placeholder="Email"
						name="email"
						id="email"
						value={email}
						onChange={handleChangeEmail}
					/>
				</div>
			</div>

			<div className="modal-footer">
				<button
					className="btn btn-secondary"
					onClick={() => modalController.closeModal()}
				>
					Cancel
				</button>
				<button
					className="btn btn-primary"
					type="submit"
					onClick={() => targetFunction(username, name, email)}
				>
					Save
				</button>
			</div>
		</Modal>
	);
}

export default UserModal;
