import { Button, Select } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import _ from "lodash";
import useMount from "@/src/hooks/useMount";
import { useDispatch, useSelector } from "react-redux";
import { selectBrandList } from "@/src/store/slice/brands.slice";
import { getBrandList } from "@/src/services/brands.services";
import { useRouter } from "next/router";
import { brandsFilterPipe } from "@/src/screen/data/forecast/factory";
import { getCategoryNoBrandRelatedList } from "@/src/services/categoryList.services";
import { selectCategoryList } from "@/src/store/slice/categoryList.slice";
import { getUserList } from "@/src/services/users.services";
import { selectUserList } from "@/src/store/slice/users.slice";

const filterBy = [
  { label: "Brand", value: "brand" },
  { label: "AM", value: "am" },
  { label: "category", value: "category" },
];

const Filter = (props) => {
  const [selectedFilterBy, setSelectedFilterBy] = useState("brand");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [users, setUsers] = useState([]);
  const dispatch = useDispatch();
  const isMount = useMount();
  const brandList = useSelector(selectBrandList);
  const CategoryListRes = useSelector(selectCategoryList);
  const userList = useSelector(selectUserList);

  const amOptions = userList.items.map((item) => ({
    value: item.id,
    label: item.u_name,
  }));

  const { query } = useRouter();

  const brandIds = useMemo(() => query?.brandIds, [query.brandIds]);

  useEffect(() => {
    if (brandIds) {
      setSelectedBrands(
        brandsFilterPipe(brandIds).map((item) => _.toNumber(item))
      );
    } else {
      setSelectedBrands(brandList.data?.map((item) => item.id) || []);
    }
  }, [brandList, brandIds]);

  useEffect(() => {
    const amIds = brandsFilterPipe(query?.amIds || []);
    const categoryIds = brandsFilterPipe(query?.categoryIds || []);
    const by = query?.by || "brand";
    setSelectedFilterBy(by);
    categoryIds.length > 0 && setCategories(categoryIds);
    amIds.length > 0 && setUsers(amIds);
  }, [query?.amIds, query?.brandIds, query?.by, query?.categoryIds]);

  const userRole = isMount
    ? JSON.parse(localStorage.getItem("user") || "{}")?.role
    : "User";

  useEffect(() => {
    if (userRole === "Admin") {
      dispatch(getCategoryNoBrandRelatedList());
      dispatch(getUserList({ perPage: 999 }));

      dispatch(
        getBrandList({
          page: 1,
          perPage: 999,
          status: "Created",
          include: ["categories", "users"],
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userRole]);

  const brandOptions = useMemo(() => {
    return brandList.data
      .map((item) => ({
        label: item.name,
        value: item.id,
        users: item.users || [],
        Categories: item.Categories || [],
      }))
      .sort(function (a, b) {
        if (a.label < b.label) {
          return -1;
        }
        if (a.label > b.label) {
          return 1;
        }
        return 0;
      });
  }, [brandList.data]);

  const categoriesOptions = useMemo(() => {
    return (
      CategoryListRes?.noBrandRelated?.data?.map((item) => ({
        label: item.name,
        value: item.id,
      })) || []
    );
  }, [CategoryListRes]);

  const handleCategoriesChange = (categories) => {
    setCategories(categories);
  };

  const handleUserChange = (users) => {
    setUsers(users);
  };

  const handleSubmit = () => {
    props.onSubmit?.({
      by: selectedFilterBy,
      brandIds: selectedBrands,
      amIds:
        selectedFilterBy === "brand" || selectedFilterBy === "category"
          ? []
          : users,
      categoryIds:
        selectedFilterBy === "brand" || selectedFilterBy === "am"
          ? []
          : categories,
    });
  };
  const handleReset = () => {
    setSelectedBrands(brandList.data?.map((item) => item.id) || []);
    setCategories([]);
    setUsers([]);
    setSelectedFilterBy("brand");
  };

  const filterOption = (input, option) => {
    if (option.children) {
      return option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        ? true
        : false;
    } else if (option.label) {
      return option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
        ? true
        : false;
    }
  };

  return (
    <div className="d-flex mb-5">
      <div>
        <Select
          placeholder={"Filter By"}
          size="large"
          style={{ width: 250, marginBottom: "20px" }}
          onChange={setSelectedFilterBy}
          options={filterBy}
          value={selectedFilterBy}
        />
      </div>

      <div className="ms-3">
        <Select
          size="large"
          placeholder={"Select Brands"}
          style={{ width: 250 }}
          mode={"multiple"}
          allowClear
          maxTagCount={"responsive"}
          filterOption={filterOption}
          value={brandOptions.length > 0 ? selectedBrands : []}
          onChange={(e) => {
            if (e.includes("SELECT_ALL")) {
              setSelectedBrands(brandList.data?.map((item) => item.id) || []);
            } else {
              setSelectedBrands(e);
            }
          }}
          options={[
            { label: "Select All", value: "SELECT_ALL" },
            ...brandOptions,
          ]}
          disabled={selectedFilterBy === null}
        />
      </div>

      <div className="mx-3">
        <Select
          placeholder={"Select Categories"}
          size="large"
          style={{ width: 250, marginBottom: "20px" }}
          mode={"multiple"}
          maxTagCount={"responsive"}
          value={brandOptions.length > 0 ? categories : []}
          onChange={handleCategoriesChange}
          options={categoriesOptions}
          filterOption={filterOption}
          disabled={
            selectedFilterBy === null ||
            selectedFilterBy === "brand" ||
            selectedFilterBy === "am"
          }
        />
      </div>
      <div className="mx-3">
        <Select
          placeholder={"Select AM"}
          size="large"
          style={{ width: 250, marginBottom: "20px" }}
          mode={"multiple"}
          maxTagCount={"responsive"}
          onChange={handleUserChange}
          value={brandOptions.length > 0 ? users : []}
          filterOption={filterOption}
          options={amOptions}
          disabled={
            selectedFilterBy === null ||
            selectedFilterBy === "brand" ||
            selectedFilterBy === "category"
          }
        />
      </div>
      <div className="mx-1">
        <Button onClick={handleSubmit} size="large">
          Submit
        </Button>
      </div>
      <div className="">
        <Button onClick={handleReset} type={"text"} size="large">
          Reset
        </Button>
      </div>
    </div>
  );
};

export default Filter;
