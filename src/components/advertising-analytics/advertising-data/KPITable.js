import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import Details from "@/src/components/Details";
import { DotChartOutlined } from "@ant-design/icons";
import { Skeleton } from "antd";

export default function KPITable({ heading, loading, data }) {
  return (
    <div className="row gx-5 gx-xl-5">
      <div className="col-xl-12 mb-5 mb-xl-5 h-200px">
        <div className="card card-flush h-xl-100">
          <div className="card-body py-3 pt-5">
            <div className="row g-3 h-100">
              <p className="fs-4 fw-boldest">{heading}</p>
              {loading ? (
                <div className="h-200px">
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      margin: "auto",
                      width: "fit-content",
                      height: "fit-content",
                    }}
                  >
                    <Skeleton.Node active>
                      <DotChartOutlined
                        style={{
                          fontSize: 40,
                          color: "#bfbfbf",
                        }}
                      />
                    </Skeleton.Node>
                  </div>
                </div>
              ) : (
                <Details
                  loading={false}
                  data={[
                    {
                      title: "Revenue",
                      value: currencyFormat(data?.revenue),
                    },
                    {
                      title: "Spend",
                      value: currencyFormat(data?.spend),
                    },
                    {
                      title: "ACoS",
                      value: percentageFormat(data?.ACoS_percentage),
                    },
                    {
                      title: "CPO",
                      value: currencyFormat(data?.CPO, 2),
                    },
                    {
                      title: "Impression",
                      value: numberFormat(data?.impression),
                    },
                    {
                      title: "Clicks",
                      value: numberFormat(data?.clicks),
                    },
                    {
                      title: "Orders",
                      value: numberFormat(data?.orders),
                    },
                    {
                      title: "CPC",
                      value: currencyFormat(data?.CPC, 2),
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
