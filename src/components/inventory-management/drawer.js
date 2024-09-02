import { getInventoryPlanningColumnsSave } from "@/src/services/InventoryPlanning.services";
import { Drawer, message, Spin } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";

export default function Drawers(props) {
  const { open, onHide, data, selected } = props;
  const dispatch = useDispatch();
  const [selectColumns, setSelectColumns] = useState(selected || []);
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    setColumnConfig(selectedColumns);
  }, [selectColumns]);

  return (
    <Drawer
      title="Configuration"
      width={400}
      placement="right"
      onClose={onHide}
      open={open}
    >
      <div className="card w-100 rounded-0">
        <div className="card-footer py-3">
          <button
            onClick={() => {
              setSelectColumns(columnsList);
            }}
            type="reset"
            className="btn btn-primary"
          >
            <span>Select All</span>
          </button>
          <button
            onClick={() => {
              setSelectColumns([]);
            }}
            type="reset"
            className="btn btn-secondary mx-4"
          >
            <span>Deselect All</span>
          </button>
        </div>

        <div className="card-body hover-scroll-overlay-y">
          {Object.entries(data || {})?.map((d, i) => (
            <div
              onClick={() => {
                const selectColumns_ = JSON.parse(
                  JSON.stringify(selectColumns)
                );
                const index = selectColumns_.findIndex((t) => t === d[0]);
                if (index === -1) {
                  selectColumns_.push(d[0]);
                } else {
                  selectColumns_.splice(index, 1);
                }
                setSelectColumns([...selectColumns_]);
              }}
              className="form-check form-check-custom form-check-solid mb-5"
              key={i}
            >
              <input
                className="form-check-input"
                type="checkbox"
                checked={
                  (selectColumns || selected)?.findIndex((r) => r === d[0]) ===
                  -1
                    ? false
                    : true
                }
                id="flexCheckDefault"
              />
              <label
                className="form-check-label fw-bolder"
                htmlFor="flexCheckDefault"
              >
                {d[1]}
              </label>
            </div>
          ))}
        </div>

        <div className="card-footer py-3">
          <button
            onClick={() => {
              onHide();
            }}
            className="btn fs-7 btn-light btn-active-light-dark me-2"
            data-kt-drawer-dismiss="true"
          >
            <span>Cancel</span>
          </button>
          <button
            type="submit"
            disabled={submitLoading}
            onClick={() => {
              let obj = {};
              selectColumns?.forEach((t) => {
                obj = {
                  ...obj,
                  [t]: 1,
                };
              });
              message.destroy();
              setSubmitLoading(true);
              message.loading("Loading...", 0);
              dispatch(getInventoryPlanningColumnsSave(obj));
            }}
            className="btn fs-7 btn-dark"
            data-kt-menu-dismiss="true"
          >
            {submitLoading && (
              <Spin
                size="small"
                style={{
                  position: "relative",
                  top: "4px",
                  marginRight: "10px",
                }}
              />
            )}
            <span>Apply</span>
          </button>
        </div>
      </div>
    </Drawer>
  );
}
