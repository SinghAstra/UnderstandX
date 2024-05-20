import React from "react";
import Modal from "react-modal";

const ConfirmationModal = ({ isOpen, closeModal, onConfirm, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={closeModal}
      ariaHideApp={false}
      contentLabel="Confirmation Modal"
    >
      <div>{message}</div>
      <button onClick={onConfirm}>Confirm</button>
      <button onClick={closeModal}>Cancel</button>
    </Modal>
  );
};

export default ConfirmationModal;
