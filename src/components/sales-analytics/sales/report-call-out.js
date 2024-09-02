import React from "react";
import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { Skeleton } from "antd";
import moment from "moment";
import { Switch } from "antd";

export default function ReportCallOuts(
  totalSalesL4wkChange,
  weeklyView,
  reportCallOutLoading,
  reportData,
  currentPeriod,
  setCurrentPeriod
) {
  return (
    <div className="card card-flush h-xl-100 fadeInRight">
      <div className="card-header min-h-55px px-4">
        <h3 className="card-title align-items-start flex-column mx-0">
          <span className="card-label fw-bolder text-dark m-0">
            Performance Summary{" "}
            {weeklyView
              ? `WK${
                  reportData?.advertisementData?.week
                    ? reportData?.advertisementData?.week
                    : "..."
                }`
              : reportData?.advertisementData?.month
              ? moment.months()[reportData?.advertisementData?.month - 1]
              : "..."}
          </span>
        </h3>
        <div className="card-title align-items-end fs-6 pb-sm-3">
          <span>Current Period</span>
          <Switch
            checked={currentPeriod}
            onChange={() => setCurrentPeriod(!currentPeriod)}
            className="mx-2"
          />
          <span>Last Full Period</span>
        </div>
      </div>
      <div className="card-body py-4">
        <div className="row gx-10">
          <div className="col-md-6 pr-md-2 border-end border-end-dashed">
            <div className="d-flex justify-content-between mb-4">
              {reportCallOutLoading ? (
                TitleLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0 fs-6">
                      <b className="fw-boldest">Total Sales</b>
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-0 fw-bolder number-font">
                      <b>
                        {currencyFormat(
                          weeklyView
                            ? reportData?.totalSalesLastWeek
                            : reportData?.totalSalesLm
                        )}
                      </b>
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-2">
              {reportCallOutLoading ? (
                <></>
              ) : (
                <>
                  <div>
                    <p className="mb-0">CHG vs {weeklyView ? "LW" : "LM"}</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font">
                      {percentageFormat(
                        weeklyView ? reportData?.upLwDiff : reportData?.upLmDiff
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-2">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Difference</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font">
                      {currencyFormat(
                        weeklyView ? reportData?.upVsLw : reportData?.upVsLm
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-2">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">
                      CHG vs {weeklyView ? "L4WK" : "LM"} Avg
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font">
                      {percentageFormat(
                        weeklyView
                          ? totalSalesL4wkChange
                          : reportData?.vsSalesChg
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mt-6 mb-6">
              {reportCallOutLoading ? (
                TitleLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0 fs-6">
                      <b className="fw-boldest">YTD Sales</b>
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      <b>{currencyFormat(reportData?.ytdSales)}</b>
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-4">
              {reportCallOutLoading ? (
                TitleLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0 fs-6">
                      <b className="fw-boldest">Key Takeaways</b>
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-0  fw-bolder">
                      <b />
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Sessions Change</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {percentageFormat(
                        weeklyView
                          ? reportData?.upVsLwSession
                          : reportData?.upVsLmSession
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Conversion Rate</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {percentageFormat(reportData?.conversionRate)}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Buy Box Percentage</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {percentageFormat(reportData?.avgBuyBoxPercentage)}
                    </h6>
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="col-md-6 pl-md-2">
            <div className="d-flex justify-content-between mb-4">
              {reportCallOutLoading ? (
                TitleLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0 fs-6">
                      <b className="fw-boldest">Ad Spend</b>
                    </p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      <b>
                        {currencyFormat(reportData?.advertisementData?.twSpend)}
                      </b>
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Ad Revenue</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {currencyFormat(reportData?.advertisementData?.twRevenue)}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Organic Sales</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {currencyFormat(
                        reportData?.advertisementData?.organicSales
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Total Sales</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {currencyFormat(
                        reportData?.advertisementData?.totalSales
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">ROAS</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {currencyFormat(
                        reportData?.advertisementData?.twRevenue /
                          reportData?.advertisementData?.twSpend,
                        2
                      )}
                    </h6>
                  </div>
                </>
              )}
            </div>
            <div className="d-flex justify-content-between mb-3">
              {reportCallOutLoading ? (
                disLoading()
              ) : (
                <>
                  <div>
                    <p className="mb-0">Total ACoS</p>
                  </div>
                  <div>
                    <h6 className="mb-0 number-font fw-bolder">
                      {percentageFormat(reportData?.advertisementData?.ACoS)}
                    </h6>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function disLoading() {
  return (
    <>
      <Skeleton.Input size="small" active={true} />
      <Skeleton.Button
        size="small"
        active={true}
        shape="default"
        block={false}
      />
    </>
  );
}

function TitleLoading() {
  return (
    <>
      <Skeleton.Input active={true} />
      <Skeleton.Button active={true} shape="default" block={false} />
    </>
  );
}
