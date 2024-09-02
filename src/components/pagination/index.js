import React from "react";
import { pageDropdown, DefaultPerPage } from "../../config";
import { Pagination, Select } from "antd";

export default function CustomPagination(props) {
  const {
    pageSize = 10,
    onPerPage,
    page = 1,
    totalPage = 10,
    onPageNo,
    loading,
    ...rest
  } = props;
  if (loading) return;
  return (
    <div className="d-flex flex-stack flex-wrap pt-0 mt-5" {...rest}>
      <div className="fs-6 fw-bold text-gray-700 d-flex align-items-center">
        <Select
          className=" w-75px me-3"
          defaultValue={DefaultPerPage}
          value={pageSize}
          getPopupContainer={(triggerNode) => triggerNode.parentNode}
          onChange={(e) => {
            onPerPage(e);
          }}
          options={pageDropdown?.map((d) => {
            return { label: d, value: d };
          })}
        />
        {`Showing Rows ${(page - 1) * pageSize + 1} to ${
          page * pageSize > totalPage ? totalPage : page * pageSize
        } of ${totalPage}`}
      </div>
      {totalPage > 0 && (
        <ul className="pagination">
          <Pagination
            current={page}
            total={totalPage}
            pageSize={pageSize}
            showSizeChanger={false}
            onChange={(e) => onPageNo(e)}
          />
        </ul>
      )}
    </div>
  );
}
