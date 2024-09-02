import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { Input, Select, TreeSelect } from "antd";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";

export default function TopBarFilter(filter, setFilter) {
  const CategoryListRes = useSelector(selectCategoryList);
  const [categoriesList, setCategoriesList] = useState([]);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    if (brand?.subcategories_enabled) {
      setCategoriesList([
        { label: "Uncategorized", value: "Uncategorizerd", options: [] },
        ...CategoryListRes?.data?.map((item) => ({
          label: item.name,
          value: String(item.id),
          options: item.subcategories.map((c) => ({
            ...c,
            label: c.name,
            value: String(c.id),
            parent_id: String(c.parent_id),
          })),
        })),
      ]);
    } else {
      setCategoriesList([
        { value: "Uncategorizerd", label: "Uncategorized" },
        ...CategoryListRes?.data?.map((item) => ({
          label: item.name,
          value: String(item.id),
        })),
      ]);
    }
  }, [CategoryListRes]);

  return (
    <div className="row gx-5 gx-xl-5 fadeInRight">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body px-4 py-4">
            <div className="d-flex flex-wrap gap-3">
              <div>
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
                  value={filter?.["search[category]"]}
                  onChange={(newValue) => {
                    setFilter({
                      ...filter,
                      page: 1,
                      ["search[category]"]: newValue,
                    });
                  }}
                  treeCheckable
                  showCheckedStrategy={TreeSelect.SHOW_ALL}
                  allowClear
                  placeholder={"Category"}
                  style={{ width: 200 }}
                />
              </div>
              <div className="position-relative">
                <Input
                  placeholder="ASIN"
                  style={{
                    width: 230,
                  }}
                  value={filter?.["search[asin]"] || null}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      page: 1,
                      ["search[asin]"]: e.target.value,
                    })
                  }
                  size="large"
                />
              </div>
              <div className="position-relative">
                <Input
                  placeholder="SKU"
                  style={{
                    width: 230,
                  }}
                  value={filter?.["search[sku]"] || null}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      page: 1,
                      ["search[sku]"]: e.target.value,
                    })
                  }
                  size="large"
                />
              </div>
              <div className="position-relative">
                <Input
                  placeholder="Product Title"
                  style={{
                    width: 230,
                  }}
                  value={filter?.["search[product_title]"] || null}
                  onChange={(e) =>
                    setFilter({
                      ...filter,
                      page: 1,
                      ["search[product_title]"]: e.target.value,
                    })
                  }
                  size="large"
                />
              </div>
              <div className="position-relative">
                <Select
                  defaultValue="All"
                  placeholder="Product Status"
                  size="large"
                  style={{ width: 200 }}
                  value={filter?.["search[product_status]"] || null}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      page: 1,
                      ["search[product_status]"]: e,
                    });
                  }}
                  options={[
                    {
                      value: "Active",
                      label: "Active",
                    },
                    { value: "inactive", label: "inactive" },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
