import { numberFormat } from "@/src/helpers/formatting.helpers";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { Progress } from "antd";
import Card from "antd/lib/card/Card";
import Meta from "antd/lib/card/Meta";
import React, { useEffect } from "react";
import { getInventoryDashboard as getInventoryDashboard } from "@/src/services/inventoryDashboard.services";
import { selectInventoryDashboard } from "@/src/store/slice/inventoryDashboard.slice";
import { useDispatch, useSelector } from "react-redux";

export default function InventoryDashboard() {
  const dispatch = useDispatch();
  const inventoryDashboard = useSelector(selectInventoryDashboard);

  const ProgressBarCard = {
    targetValue: 70,
    progressColor: {
      "0%": "#108ee9",
      "70%": "#108ee9",
      "100%": "#87d068",
    },
  };

  useEffect(() => {
    dispatch(getInventoryDashboard());
  }, []);

  const format = (_percent) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      {<span>100%</span>}
    </div>
  );

  const CommonCard = (props) => {
    return (
      <div className="col col-12 col-md-6 col-lg-6 col-xl-3 col-xxl-3 col-sm-6 col-xs-12 px-3 py-2">
        <Card hoverable>
          <div className="d-flex justify-content-between shadow-3d-info">
            <Meta
              title={props.heading}
              description={<Progress percent={props.value} />}
            />
          </div>
          <div className="mt-5">
            <div className="my-2 d-flex justify-content-between">
              <span className="fs-8 fw-bolder">{props.Row1}</span>
              <span className="fw-bolder">{props.Row1V}</span>
            </div>
            <div className="my-2 d-flex justify-content-between">
              <span className="fs-8 fw-bolder">{props.Row2}</span>
              <span className="fw-bolder">{props.Row2V}</span>
            </div>
            <div className="my-2 d-flex justify-content-between">
              <span className="fs-8 fw-bolder">{props.Row3}</span>
              <span className="fw-bolder">{props.Row3V}</span>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <DashboardLayout>
      <div className="mx-5 my-4">
        <h2>Inventory Dashboard</h2>
        <div className="row my-5">
          <div className="col col-12 col-md-6 col-lg-6 col-sm-6 px-3 py-2 col-xl-3 col-xxl-3">
            <Card hoverable style={{ height: 120 }}>
              <div className="d-flex justify-content-between display-7">
                <Meta
                  className="display-7"
                  title="Inventory Performance Index"
                  description="70% index"
                />
              </div>
              <Progress
                className="mt-5"
                percent={ProgressBarCard.targetValue}
                success={{ percent: 75 }}
                strokeColor={ProgressBarCard.progressColor}
                format={format}
              />
            </Card>
          </div>
          <div className="col col-12 col-md-6 col-lg-6 col-sm-6 px-3 py-2 col-xl-3 col-xxl-3">
            <Card hoverable style={{ height: 120 }}>
              <div className="d-flex justify-content-between">
                <Meta
                  title="SKUs to restock today"
                  description="your in-stock rate is: 76.51%"
                />
                <h3 className="mt-0">35</h3>
              </div>
              <div className="mt-5 d-flex">
                <a href="#">
                  <span>View All</span>
                  <svg
                    className="mx-1 bi bi-arrow-right"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8z"
                    />
                  </svg>
                </a>
              </div>
            </Card>
          </div>
          <div className="col col-12 col-md-6 col-lg-6 col-sm-6 px-3 py-2 col-xl-3 col-xxl-3">
            <Card hoverable style={{ height: 120 }}>
              <div className="d-flex justify-content-between">
                <Meta title="Excess Units" description="0 SKUs" />
                <h3 className="mt-0">0</h3>
              </div>
            </Card>
          </div>
          <div className="col col-12 col-md-6 col-lg-6 col-sm-6 px-3 py-2 col-xl-3 col-xxl-3">
            <Card hoverable style={{ height: 120 }}>
              <div className="d-flex justify-content-between">
                <Meta title="Days in inventory" description="5.2 turns" />
                <h3 className="mt-0">0</h3>
              </div>
            </Card>
          </div>
        </div>
        <div className="row my-5">
          <h2>Restock Limits</h2>
          <div className="row my-5">
            <CommonCard
              heading="Standard-Size Storage"
              subheading="6,891 of 14,291 Units"
              value={40}
              Row1="Utilization Quantity"
              Row1V={`${numberFormat(6982)}`}
              Row2="Maximum Inventory Level"
              Row2V={`${numberFormat(36434)}`}
              Row3="Maximum Shipment Quantity"
              Row3V={`${numberFormat(7200)}`}
            ></CommonCard>
            <CommonCard
              heading="Oversize Storage"
              subheading="0 of 1,000 Units"
              value={70}
              Row1="Utilization Quantity"
              Row1V={`${numberFormat(0)}`}
              Row2="Maximum Inventory Level"
              Row2V={`${numberFormat(1000)}`}
              Row3="Maximum Shipment Quantity"
              Row3V={`${numberFormat(700)}`}
            ></CommonCard>
            <CommonCard
              heading="Apparel Storage"
              subheading="0 of 1,000 Units"
              value={90}
              Row1="Utilization Quantity"
              Row1V={`${numberFormat(6982)}`}
              Row2="Maximum Inventory Level"
              Row2V={`${numberFormat(0)}`}
              Row3="Maximum Shipment Quantity"
              Row3V={`${numberFormat(1000)}`}
            ></CommonCard>
            <CommonCard
              heading="Footwear Storage"
              subheading="0 of 1,000 Units"
              value={50}
              Row1="Utilization Quantity"
              Row1V={`${numberFormat(6982)}`}
              Row2="Maximum Inventory Level"
              Row2V={`${numberFormat(63434)}`}
              Row3="Maximum Shipment Quantity"
              Row3V={`${numberFormat(1000)}`}
            ></CommonCard>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
