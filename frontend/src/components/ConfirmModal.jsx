import Modal from "react-modal";

Modal.setAppElement("#root");

const customStyles = {
	content: {
		top: "50%",
		left: "50%",
		right: "auto",
		bottom: "auto",
		marginRight: "-50%",
		transform: "translate(-50%, -50%)",
		padding: "0",
		border: "none",
		borderRadius: "12px",
		maxWidth: "400px",
		width: "90%",
	},
	overlay: {
		backgroundColor: "rgba(0, 0, 0, 0.5)",
		zIndex: 1000,
	},
};

function ConfirmModal({ modalController, onConfirm, message }) {
	return (
		<Modal
			isOpen={modalController.isOpen}
			onRequestClose={() => modalController.closeModal()}
			style={customStyles}
			contentLabel="Confirmation Modal"
		>
			<div className="confirm-modal">
				<div className="confirm-modal-header">
					<h3>{modalController.title || "Confirm Action"}</h3>
				</div>
				<div className="confirm-modal-body">
					<p>{message || "Are you sure you want to proceed?"}</p>
				</div>
				<div className="confirm-modal-footer">
					<button
						className="btn btn-secondary btn-sm"
						onClick={() => modalController.closeModal()}
					>
						Cancel
					</button>
					<button
						className="btn btn-danger btn-sm"
						onClick={() => {
							onConfirm();
							modalController.closeModal();
						}}
					>
						Confirm
					</button>
				</div>
			</div>
		</Modal>
	);
}

export default ConfirmModal;
