import { getCategorySpecificList } from "@/src/services/categoryList.services";
import {
  selectBrandCategoryList,
  selectCategoryList,
} from "@/src/store/slice/categoryList.slice";
import { Select } from "antd";
import React, { useMemo } from "react";
import { useSelector } from "react-redux";

const CategoryField = ({
  brandId,
  textValue,
  stateValue,
  categoryId,
  ...props
}) => {
  const selector = useSelector(selectCategoryList);

  const categoryBrandOptions = useMemo(() => {
    return (
      selector?.noBrandRelated?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })) || []
    );
  }, [selector?.noBrandRelated]);

  const value =
    categoryBrandOptions.length > 0
      ? stateValue === undefined
        ? categoryId
        : stateValue
      : undefined;

  return (
    <>
      <Select
        allowClear
        placeholder={textValue || "Select Category"}
        showSearch
        // mode="multiple"
        value={value || undefined}
        style={{ width: 170 }}
        options={categoryBrandOptions}
        {...props}
      />
    </>
  );
};

export default CategoryField;
