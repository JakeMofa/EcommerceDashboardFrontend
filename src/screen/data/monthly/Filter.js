import { Checkbox, Form, Select, Switch } from "antd";
import moment from "moment";
import _ from "lodash";
import { defaultMonth, defaultYear } from "@/src/config";
import { useEffect } from "react";
import { getBrandList } from "@/src/services/brands.services";
import { useDispatch, useSelector } from "react-redux";
import { selectBrandList } from "@/src/store/slice/brands.slice";
import useMount from "@/src/hooks/useMount";

export default function ManageDataMonthlyFilter(
  filter,
  setFilter,
  config = {},
  showColors,
  setShowColors,
  { columnToggleOptions, columnToggle, onChange }
) {
  const dispatch = useDispatch();
  const isMount = useMount();

  const brandList = useSelector(selectBrandList);

  const userRole = isMount
    ? JSON.parse(localStorage.getItem("user") || "{}")?.role
    : "User";

  useEffect(() => {
    if (userRole === "Admin") {
      dispatch(
        getBrandList({
          page: 1,
          perPage: 999,
          status: "Created",
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const selectAll = () => {
    const range = _.range(
      0,
      defaultYear() === filter.year ? defaultMonth() + 1 : 12
    );

    setFilter({
      ...filter,
      ["month"]: range,
    });
  };

  return (
    <div className="d-flex gap-3">
      <div>
        <Select
          style={{ width: 300 }}
          size="large"
          placeholder={`Select months`}
          mode="multiple"
          maxTagCount="responsive"
          value={filter?.["month"] || null}
          onChange={(e) => {
            setFilter({
              ...filter,
              ["month"]: e,
            });
          }}
          options={moment.months()?.map((d, i) => {
            return { label: d, value: i + 1 };
          })}
          allowClear
        />
      </div>
      <div>
        <button
          className="btn btn-secondary ml-auto mr-10px"
          onClick={selectAll}
        >
          Select All months
        </button>
      </div>
      <div className="mt-2">
        <Form>
          <Form.Item label="Colors">
            <Switch
              checked={showColors}
              onChange={(checked) => setShowColors(checked)}
            />
          </Form.Item>
        </Form>
      </div>
      <div className="ms-auto">
        <Checkbox.Group
          options={columnToggleOptions}
          value={columnToggle}
          onChange={onChange}
        />
      </div>
    </div>
  );
}
