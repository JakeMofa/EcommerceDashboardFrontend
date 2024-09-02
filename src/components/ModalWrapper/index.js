import Modal from "react-modal";

const ModalWrapper = (props) => {
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      padding: "0px",
      transform: "translate(-50%, -50%)",
    },
  };

  return (
    <Modal
      ariaHideApp={false}
      isOpen={props.isOpen}
      onRequestClose={props.closeModal}
      style={customStyles}
    >
      {props.children}
    </Modal>
  );
};

export default ModalWrapper;
