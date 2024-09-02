import _ from "lodash";
import request, { api_request } from "./request";

export const fetchCustomerAcquisitionMonthly = (data) => {
  return request.get(
    `/customer-acquisition?years=${data?.search_year || ""}&months=${
      data?.search_month || ""
    }`
  );
};

export const fetchCustomerAcquisitionWeekly = (data) => {
  return request.get(
    `/customer-acquisition-weekly?years=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`
  );
};

export const controllerLTV = new AbortController();

export const fetchCustomerAcquisitionLTV = (data) => {
  return request.get(
    `/new-customer-sales?year=${data?.search_year || ""}&months=${
      data?.search_month || ""
    }`,
    { signal: controllerLTV.signal }
  );
};

export const fetchCustomerAcquisitionPredictiveLTV = (data) => {
  return request.get(`/new-customer-sales-prediction?months=${data.months}`, {
    signal: controllerLTV.signal,
  });
};

export const fetchCustomerAcquisitionBreakdownMonthly = (data) => {
  return request.get(`/breakdown`, {
    params: _.omitBy(
      {
        page: data.page || 1,
        limit: data?.perPage || 10,
        years: data.search_year,
        months: data?.search_month,
        orderBy: data?.orderBy || "unique_buyer",
        order: data?.order || "desc",
        search: data?.searchText || "",
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};

export const fetchCustomerAcquisitionBreakdownWeekly = (data) => {
  return request.get(`/breakdown-weekly`, {
    params: _.omitBy(
      {
        page: data.page || 1,
        limit: data?.perPage || 10,
        orderBy: data?.orderBy || "unique_buyer",
        order: data?.order || "desc",
        years: data.search_year,
        weeks: data?.search_week,
        search: data?.searchText || "",
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};

export const fetchCustomerAcquisitionCategoryBreakdownMonthly = (data) => {
  return request.get(`/category-breakdown`, {
    params: _.omitBy(
      {
        categoryIds: data.search_category,
        years: data.search_year,
        months: data?.search_month,
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};

export const fetchCustomerAcquisitionCategoryBreakdownWeekly = (data) => {
  return request.get(`/category-breakdown-weekly`, {
    params: _.omitBy(
      {
        categoryIds: data.search_category,
        years: data.search_year,
        weeks: data?.search_week,
      },
      (v) => v === null || v === "" || v === undefined
    ),
  });
};

export const fetchShipmentReportActivationStatus = () => {
  const brand = JSON.parse(localStorage.getItem("brand"));
  return request.get(
    `/reports/shipment-report-activation?brandId=${brand?.id}`
  );
};

export const ShipmentReportActivationToggle = () => {
  const brand = JSON.parse(localStorage.getItem("brand"));
  return request.get(
    `/reports/shipment-report-activation-toggle?brandId=${brand?.id}`
  );
};

export const ImportCustomerAcquisition = (data) => {
  return api_request.post("/api/data-upload/shipment", data);
};

export const ImportDspData = (data) => {
  return api_request.post("/api/data-upload/dsp-data", data);
};
