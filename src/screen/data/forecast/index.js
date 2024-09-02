import { useEffect, useMemo, useState } from "react";
import ASINTable from "@/src/components/table";
import { defaultMonth, defaultYear } from "@/src/config";
import NoData from "@/src/components/no-data";
import _ from "lodash";
import { Card } from "antd";
import ManageDataWeeklyFilter from "./Filter";
import moment from "moment";
import CustomModal from "@/src/components/modal";
import UploadForecastData from "./UploadForecastData";
import { useManageData } from "@/src/providers/manageData";
import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { monthFilterPipe } from "./factory";
import { useRouter } from "next/router";

const mainStyle = {
  fontSize: 15,
  paddingTop: 8,
  paddingBottom: 8,
  display: "flex",
};

const dataRender = (text, item) => {
  const data = text[item];
  if (text.key === 0) {
    return currencyFormat(data?.forecast);
  }
  if (text.key === 1) {
    return currencyFormat(data?.sale);
  }
  if (text.key === 2) {
    return percentageFormat(data?.monthPerMonthGrowth);
  }
  if (text.key === 3) {
    return currencyFormat(data?.organicRevenue);
  }
  if (text.key === 4) {
    return currencyFormat(data?.revenue);
  }
  if (text.key === 5) {
    return currencyFormat(data?.variance);
  }
  if (text.key === 6) {
    return percentageFormat(data?.variancePercentage);
  }
  if (text.key === 7) {
    return "-";
  }
  if (text.key === 8) {
    return currencyFormat(data?.adBudget);
  }
  if (text.key === 9) {
    return currencyFormat(data?.spend);
  }
  if (text.key === 10) {
    return percentageFormat(data?.forcastTacos);
  }
  if (text.key === 11) {
    return percentageFormat(data?.actualTacos);
  }
  if (text.key === 12) {
    const formatedValue = currencyFormat(data?.adBudgetVariance);
    return data?.adBudgetVariance < 0 ? (
      <span style={{ color: "red" }}>({formatedValue})</span>
    ) : (
      formatedValue
    );
  }
  return "-";
};

export default function ManageDataForecastScreen() {
  const { forecastTab } = useManageData();
  const { query } = useRouter();
  const { forecast } = forecastTab;
  const year = defaultYear();

  const [months, setMonths] = useState(
    monthFilterPipe(_.range(1, defaultMonth() + 1))
  );
  const monthsQuery = useMemo(() => {
    return Array.isArray(query.months)
      ? query.months.map((item) => _.toNumber(item))
      : query.months
      ? [_.toNumber(query.months)]
      : monthFilterPipe(_.range(1, defaultMonth() + 1));
  }, [query.months]);

  useEffect(() => {
    setMonths(monthsQuery);
  }, [setMonths, monthsQuery]);

  const columns = [
    {
      title: "Amazon Forecast",
      width: 300,
      fixed: true,
      align: "left",
      render: (text) => text?.title,
    },
    ...months.map((item) => ({
      title: moment()
        .month(item - 1)
        .format("MMM"),
      width: 150,
      align: "center",
      render: (text) => dataRender(text, item),
    })),
    {
      title: "Total",
      width: 150,
      align: "center",
      render: (text) => dataRender(text, "total"),
    },

    {
      title: "Q1",
      width: 150,
      align: "center",
      render: (text) => dataRender(text, "Q1"),
    },
    {
      title: "Q2",
      width: 150,
      align: "center",
      render: (text) => dataRender(text, "Q2"),
    },
    {
      title: "Q3",
      width: 150,
      align: "center",
      render: (text) => dataRender(text, "Q3"),
    },
    {
      title: "Q4",
      width: 150,
      align: "center",
      render: (text) => dataRender(text, "Q4"),
    },
  ];

  const monthBased = _.keyBy(forecast?.data?.monthly || [], "month");
  const totalData = forecast?.data?.total;
  const quartersData = _.keyBy(forecast?.data?.quarters || [], "quarter");

  const spreader = {
    ...monthBased,
    total: totalData,
    ...quartersData,
  };

  const dataSource = [
    {
      key: 0,
      title: <b style={mainStyle}>{year} Forecast</b>,
      ...spreader,
    },
    {
      key: 1,
      title: <b style={mainStyle}>{year} Actuals/Pacing</b>,
      ...spreader,
    },
    {
      key: 2,
      title: <b style={mainStyle}>{year} PROJECTED MoM GROWTH</b>,
      ...spreader,
    },
    {
      key: 3,
      title: "ORGANIC REVENUE",
      ...spreader,
    },
    {
      key: 4,
      title: "ADVERTISING REVENUE",
      ...spreader,
    },
    {
      key: 5,
      title: "VARIANCE $",
      ...spreader,
    },
    {
      key: 6,
      title: "VARIANCE %",
      ...spreader,
    },
    {
      key: 7,
      title: "ACTUAL MoM GROWTH %",
      ...spreader,
    },
    {
      key: 8,
      title: <b style={mainStyle}>FORECAST AD BUDGET</b>,
      ...spreader,
    },
    {
      key: 9,
      title: "ACTUAL AD SPEND",
      ...spreader,
    },
    {
      key: 10,
      title: <b style={mainStyle}>FORECAST TACOS</b>,
      ...spreader,
    },
    {
      key: 11,
      title: "ACTUAL TACOS",
      ...spreader,
    },
    {
      key: 12,
      title: "VARIANCE $",
      ...spreader,
    },
  ];

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <Card
          title={ManageDataWeeklyFilter({ months, setMonths })}
          bordered={false}
          bodyStyle={{ padding: "30px 0px 0px 0px" }}
          headStyle={{ padding: "0px 0px 30px 0px" }}
          style={{ boxShadow: "none" }}
        >
          <div className="d-flex justify-content-end mb-9">
            <CustomModal
              title={"Upload Forecast Data"}
              width={600}
              opener={
                <button className="btn btn-light-danger btn-sm mx-3 fw-bolder">
                  Import Data
                </button>
              }
              footer={null}
            >
              {({ handleOk }) => <UploadForecastData handleOk={handleOk} />}
            </CustomModal>
          </div>
          {forecast?.data?.length != 0 ? (
            <ASINTable
              bordered
              size="small"
              columns={columns}
              dataSource={[
                ...dataSource,
                // {
                //   month_name: "Total",
                //   year: null,
                //   customer_count: null,
                //   old_customer_count: null,
                //   new_customer_count: null,
                //   spend: null,
                //   spend: null,
                //   new_customer_count: null,
                //   // ...filter.week.reduce((acc, item) => {
                //   //   acc[`WK${item <= 9 ? "0" + item : item}`] =
                //   //     currencyFormat(12312);
                //   //   return acc;
                //   // }, {}),
                // },
              ]}
              ellipsis
              rowKey="key"
              pagination={false}
              scroll={{
                x: columns?.reduce((a, b) => a.width + b.width, 0) + 300,
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight - 450
                    : undefined,
              }}
            />
          ) : (
            <NoData />
          )}
        </Card>
      </div>
    </>
  );
}
