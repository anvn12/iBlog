class ModalController {
	constructor(title, modalIsOpen, setModalIsOpen) {
		this.title = title;
		this.isOpen = modalIsOpen;
		this.setIsOpen = setModalIsOpen;
	}

	openModal() {
		this.isOpen = true;
		this.setIsOpen(true);

		console.log("open modal");
	}

	closeModal() {
		this.isOpen = false;
		this.setIsOpen(false);

		console.log("close modal");
	}
}

export default ModalController;
