import { Select } from "antd";
import moment from "moment";
import _ from "lodash";
import { defaultMonth, defaultYear } from "@/src/config";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { useSelector, useDispatch } from "react-redux";
import { getCategoryList } from "@/src/services/categoryList.services";
import { useEffect } from "react";

export default function TopBarFilter(filter, setFilter, type, config = {}) {
  const dispatch = useDispatch();
  const CategoryListRes = useSelector(selectCategoryList);

  useEffect(() => {
    dispatch(getCategoryList({ limit: 9999 }));
  }, []);

  const selectAll = () => {
    const range =
      type === "Week"
        ? _.range(1, defaultYear() === filter.year ? defaultWeek() + 1 : 54)
        : _.range(0, defaultYear() === filter.year ? defaultMonth() + 1 : 12);

    setFilter({
      ...filter,
      [type.toLowerCase()]: range,
    });
  };

  return (
    <div className="row gx-5 gx-xl-5 fadeInRight">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body px-4 py-4">
            <div className="gap-3">
              <div className="float-start pe-3">
                <Select
                  defaultValue={defaultYear()}
                  size="large"
                  style={{ width: config.year_mode ? 250 : 100 }}
                  value={filter?.year || null}
                  mode={config.year_mode}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      year: e,
                    });
                  }}
                  options={[...Array(4)].map((_, i) => {
                    const year =
                      parseInt(moment(new Date()).format("YYYY")) +
                      i -
                      [...Array(4)]?.length +
                      1;
                    return { value: year, label: year };
                  })}
                />
              </div>
              <div className="float-start pe-3">
                <Select
                  style={{ width: 300 }}
                  size="large"
                  placeholder={`Select ${type}`}
                  mode="multiple"
                  maxTagCount="responsive"
                  value={filter?.[type?.toLowerCase()] || null}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      [type.toLowerCase()]: e,
                    });
                  }}
                  options={
                    type === "Week"
                      ? [...Array(53)].map((_, i) => {
                          return {
                            value: i + 1,
                            label: `WK${
                              i.toString()?.length === 1 ? 0 + i + 1 : i + 1
                            }`,
                          };
                        })
                      : moment.months()?.map((d, i) => {
                          return { label: d, value: i };
                        })
                  }
                  allowClear
                />
              </div>
              <div className="float-start pe-3">
                <button
                  className="btn btn-secondary ml-auto mr-10px"
                  onClick={selectAll}
                >
                  Select All {type}s
                </button>
              </div>
              <div className="float-start pe-3">
                <Select
                  defaultValue="All"
                  placeholder="Category"
                  mode="multiple"
                  size="large"
                  style={{ width: 200 }}
                  value={filter?.categories || null}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      categories: e,
                    });
                  }}
                  options={CategoryListRes?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  }))}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
