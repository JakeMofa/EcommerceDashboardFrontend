import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import ModalWrapper from "@/src/components/ModalWrapper";
import { UserSvg } from "@/src/assets";
import { fetchUserBrands } from "@/src/api/users.api";
import NoData from "@/src/components/no-data";
import { message } from "antd";

export default function AccountsModal({
  isOpen,
  closeModal,
  account,
  brandList,
}) {
  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState([]);

  useEffect(() => {
    if (isOpen && account?.id) {
      fetchUserBrands(account.id)
        .then((res) => {
          if (res.status >= 200 && res.status <= 299) {
            const brandIds = res.data.brands.map((d) => d.brandId);
            setBrands(brandList.data.filter((b) => brandIds.includes(b.id)));
            setLoading(false);
          } else {
            setLoading(false);
          }
        })
        .catch((err) => message.error(err?.response?.message));
    }
  }, [isOpen]);

  return (
    <ModalWrapper isOpen={isOpen} closeModal={closeModal}>
      <div className="w-md-500px max-h-500px">
        <div style={{ backgroundColor: "#F6F6F6" }} className="modal-header">
          <p className="modal-title fw-bolder fs-5">
            {account?.name}&apos;s Assigned Brands
          </p>
          <FontAwesomeIcon
            icon={faXmark}
            className="fs-4 cursor-pointer w-15px"
            onClick={closeModal}
          />
        </div>
        <div className="min-h-200px p-5">
          {loading ? (
            <div>Loading...</div>
          ) : brands?.length != 0 ? (
            <div>
              {brands.map((brand) => {
                return (
                  <h5 key={brand.id} className="badge badge-light-dark bg-light badge-pill mx-1 mb-2 fs-7 fw-bolder">
                    <UserSvg />{"  "}
                    {brand.u_amazon_seller_name}
                  </h5>
                );
              })}
            </div>
          ) : (
            <NoData height={150} />
          )}
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
