import _ from "lodash";
import request from "./request";

export const fetchProductReportList = (data) => {
  return request.get(`/categories/product-report`, {
    params: _.omitBy(
      {
        year: data.search_year,
        weeks: data?.search_week,
        months: data?.search_month,
        asin: data.asin,
        category: data.category,
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};

export const fetchProductReportCategoryDetails = (data) => {
  return request.get(`/categories/category-product-report`, {
    params: {
      year: data.search_year,
      weeks: data?.search_week,
      months: data?.search_month,
      asin: data.asin,
      category_id: data.category_id,
      limit: data.perPage || 50,
      page: data.page || 1,
    },
  });
};

export const fetchProductReportExport = (data) => {
  return request.get(`/categories/product-report-export`, {
    params: _.omitBy(
      {
        year: data.search_year,
        weeks: data?.search_week,
        months: data?.search_month,
        asin: data.asin,
        category: data.category,
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};
