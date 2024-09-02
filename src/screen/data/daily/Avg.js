import React, { useState } from "react";
import { Drawer, Switch } from "antd";
import ASINTable from "@/src/components/table";
import NoData from "@/src/components/no-data";
import _ from "lodash";
import { useManageData } from "@/src/providers/manageData";
import { currencyFormat } from "@/src/helpers/formatting.helpers";

const AvgDrawer = (props) => {
  const [open, setOpen] = useState(false);
  const [avgState, setAvgState] = useState(false);
  const { dailyTab } = useManageData();
  const { daily } = dailyTab;

  const onChange = (checked) => {
    setAvgState(checked);
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const days = Object.freeze(["Mon", "Tue", "Wed", "Thu	", "Fri", "Sat", "Sun"]);
  const daysNumber = Object.freeze([1, 2, 3, 4, 5, 6, 7]);

  const calculateAggregatedSales = () => {
    const salesRecord = {};

    daily?.data.forEach((dataObj) => {
      const perDay = dataObj.perDay;

      for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        if (perDay[dayIndex]) {
          if (!salesRecord[dayIndex]) {
            salesRecord[dayIndex] = { sales: 0 };
          }
          salesRecord[dayIndex].sales += perDay[dayIndex].sales;
        }
      }
    });

    return salesRecord;
  };

  const weekDays = daysNumber.map((item) => ({
    title: days[item - 1],
    width: 150,
    align: "center",
    sorter: (a, b) => {
      const aValue = a.perDay?.[item]?.sales || 0;
      const bValue = b.perDay?.[item]?.sales || 0;

      return aValue - bValue;
    },
    render: (text) => {
      const value = text.perDay?.[item];
      const color = value?.color;
      return (
        <span
          style={
            props.showColors && color
              ? {
                  color: `rgb(${color.red}, ${color.green}, ${color.blue})`,
                }
              : {}
          }
        >
          {currencyFormat(value?.sales || "0")}
        </span>
      );
    },
  }));

  const columns = [
    {
      title: "Brand Name",
      width: 300,
      align: "left",
      render: (text) => {
        return (
          <span
            style={{
              fontWeight: text?.brandName === "Total" ? "bolder" : "normal",
            }}
          >
            {text?.brandName}
          </span>
        );
      },
    },
    ...weekDays,
  ];
  return (
    <>
      {React.cloneElement(props.opener, { onClick: showDrawer })}
      <Drawer
        placement="bottom"
        onClose={onClose}
        open={open}
        title={"Days of week data"}
        forceRender
        height={"100vh"}
      >
        <>
          <div className="d-flex gap-3 justify-content-end mb-9">
            <span>Avg</span>
            <Switch checked={avgState} onChange={onChange} />
            <span>Total</span>
          </div>

          {daily?.data?.length != 0 ? (
            <ASINTable
              columns={columns.concat({
                title: avgState ? "TTL" : "AVG",
                width: 150,
                align: "center",
                render: (text) => {
                  return avgState
                    ? currencyFormat(text.total || "0")
                    : currencyFormat(text.average || "0");
                },
              })}
              dataSource={
                [
                  { brandName: "Total", perDay: calculateAggregatedSales() },
                  ...(daily?.data || []),
                ] || []
              }
              ellipsis
              rowKey="key"
              pagination={false}
              scroll={{
                x: columns?.reduce((a, b) => a.width + b.width, 0) + 300,
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight - 230
                    : undefined,
              }}
            />
          ) : (
            <NoData />
          )}
        </>
      </Drawer>
    </>
  );
};

export default AvgDrawer;
