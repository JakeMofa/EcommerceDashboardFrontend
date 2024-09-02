import request from "./request";

export const fetchReportLogs = (data) => {
  return request.get(
    `/report-logs?page=${data?.page || 1}&limit=${
      data?.pageSize || 10
    }&orderBy=${data?.orderBy || "id"}&order=${
      data?.order || "desc"
    }&marketplace=${data?.marketplace || ""}&reportType=${
      data?.reportType || ""
    }&reportRequestStatus=${data?.reportRequestStatus || ""}&startDate=${
      data?.startDate || ""
    }&endDate=${data?.endDate || ""}
    `
  );
};

export const fetchReportLogsSummary = () => {
  return request.get("/report-logs/summary");
};
