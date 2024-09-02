import request from "./request";

export const fetchCentralReportLogs = (data) => {
  return request.post("/central-report-logs/list", {
    reportType: data.reportType,
    status: data?.status,
    ordering: `${data?.order == "descend" ? "-" : ""}${
      data?.orderBy || "created_at"
    }`,
    page: data?.page || 1,
    pageSize: data?.pageSize || 20,
    brandId: data?.brand_id || "",
  });
};
