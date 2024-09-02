import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ModalWrapper from "@/src/components/ModalWrapper";
import Icons from "@/src/assets/icons";
import { ArrowSvg } from "@/src/assets";

export default function ModulesModal({ isOpen, closeModal, account }) {
  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className="w-md-500px max-h-500px">
        <div style={{ backgroundColor: "#F6F6F6" }} className="modal-header">
          <p className="modal-title fw-bolder fs-5">
            {account}&apos;s Accessible Modules
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            className="fs-4 cursor-pointer"
            onClick={closeModal}
          />
        </div>
        <div className="min-h-200px p-5">
          <h5 className="badge badge-light-dark bg-light badge-pill mx-1 mb-2 fs-7 fw-bolder">
            <ArrowSvg />
            {"  "}Sales Analytics
          </h5>
          <h5 className="badge badge-light-dark bg-light badge-pill mx-1 mb-2 fs-7 fw-bolder">
            <ArrowSvg />
            {"  "}Inventory Management
          </h5>
          <h5 className="badge badge-light-dark bg-light badge-pill mx-1 mb-2 fs-7 fw-bolder">
            <ArrowSvg />
            {"  "}Category Reports
          </h5>
          <h5 className="badge badge-light-dark bg-light badge-pill mx-1 mb-2 fs-7 fw-bolder">
            <ArrowSvg />
            {"  "}Advertising Analytics
          </h5>
        </div>
        <div className="modal-footer">
          <button
            onClick={closeModal}
            className="mb-0 btn btn-outline-secondary border text-dark"
          >
            Cancel
          </button>
        </div>
      </div>
    </ModalWrapper>
  );
}
