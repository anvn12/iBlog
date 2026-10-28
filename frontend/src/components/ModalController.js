class ModalController {
	constructor(title, modalIsOpen, setModalIsOpen) {
		this.title = title;
		this.isOpen = modalIsOpen;
		this.setIsOpen = setModalIsOpen;
	}

	openModal() {
		this.isOpen = true;
		this.setIsOpen(true);
	}

	closeModal() {
		this.isOpen = false;
		this.setIsOpen(false);
	}
}

export default ModalController;
