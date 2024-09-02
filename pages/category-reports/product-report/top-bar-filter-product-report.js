import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { Input, Select, TreeSelect } from "antd";
import moment from "moment";
import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import _ from "lodash";
import { defaultMonth, defaultWeek, defaultYear } from "@/src/config";

export default function TopBarFilter(filter, setFilter, type) {
  const CategoryListRes = useSelector(selectCategoryList);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    if (brand.subcategories_enabled) {
      setCategoriesList([
        { label: "Uncategorized", value: "Uncategorizerd", options: [] },
        ...CategoryListRes?.data?.map((item) => ({
          label: item.name,
          value: item.id,
          options: item.subcategories.map((c) => ({
            ...c,
            label: c.name,
            value: c.id,
            parent_id: c.parent_id,
          })),
        })),
      ]);
    } else {
      setCategoriesList([
        { label: "Uncategorized", value: "Uncategorizerd", options: [] },
        ...CategoryListRes?.data?.map((item) => ({
          label: item.name,
          value: item.id,
        })),
      ]);
    }
  }, [CategoryListRes]);

  const selectAll = () => {
    const range =
      type === "Week"
        ? _.range(1, defaultYear() === filter.year ? defaultWeek() : 54)
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
            <div className="d-flex flex-wrap gap-3">
              <div>
                <Select
                  defaultValue={[defaultYear()]}
                  size="large"
                  style={{ width: 180 }}
                  value={filter?.year || null}
                  mode="multiple"
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
              <div>
                <Select
                  style={{ width: 225 }}
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

              <div>
                <button
                  className="btn btn-secondary ml-auto mr-10px px-3"
                  onClick={selectAll}
                >
                  Select All {type}s
                </button>
              </div>

              <div className="position-relative">
                <Input
                  placeholder="Search by ASIN"
                  style={{
                    width: 180,
                  }}
                  value={filter.asin || null}
                  onChange={(e) =>
                    setFilter((s) => ({ ...s, asin: e.target.value }))
                  }
                  size="large"
                />
              </div>
              <div className="position-relative">
                <TreeSelect
                  disabled={categoriesList.length === 0}
                  size="large"
                  maxTagCount={"responsive"}
                  multiple
                  treeData={categoriesList.map((item) => ({
                    title: item.label,
                    value: item.value,
                    key: item.value,
                    children: item?.options?.map((option) => ({
                      title: option.label,
                      value: option.value,
                      key: option.value,
                    })),
                  }))}
                  value={filter?.["category"]}
                  onChange={(newValue) => {
                    setFilter({
                      ...filter,
                      ["category"]: newValue,
                    });
                  }}
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  allowClear
                  placeholder={"Category"}
                  style={{ width: 200 }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
