import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { Skeleton } from "antd";

export default function RSales(reportData, loading) {
  return (
    <div className="col-xl-3 mb-5 mb-xl-5 fadeInRight">
      <div className="card card-flush h-xl-100">
        <div className="card-body px-2 py-3">
          <div className="table-responsive">
            <table className="table table-row-dashed fs-7 table-row-gray-300 align-middle gx-4 gy-4 mb-0">
              <thead>
                <tr
                  className="text-start text-gray-800 fw-boldest fs-7 text-center"
                  style={{ background: "#f8f8f8" }}
                >
                  <th colSpan={3} className="min-w-75px">
                    {loading ? title2Loading() : "Sales"}
                  </th>
                </tr>
              </thead>
              <tbody className="fw-bold text-gray-800 text-center">
                <tr>
                  <td>{loading ? title3Loading() : "YTD"}</td>
                  <td>{loading ? title3Loading() : "LY"}</td>
                  <td>{loading ? title3Loading() : "CHG"}</td>
                </tr>
                {loading ? (
                  <tr>
                    <td>{title3Loading()}</td>
                    <td>{title3Loading()}</td>
                    <td>{title3Loading()}</td>
                  </tr>
                ) : (
                  <tr className="number-font">
                    <td>{currencyFormat(reportData?.ytdSales)}</td>
                    <td>{currencyFormat(reportData?.lastYearSales)}</td>
                    <td
                      className={`${
                        reportData?.lastYearSalesChange < 0
                          ? "text-danger"
                          : "text-success"
                      }`}
                    >
                      {percentageFormat(reportData?.lastYearSalesChange)}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function title3Loading() {
  return <Skeleton.Button active={true} />;
}
function title2Loading() {
  return <Skeleton.Input size="small" active={true} />;
}
