import React, { useEffect, useState } from "react";
import { Card, Tabs } from "antd";
import styles from "./manage_data.module.css";
import { useRouter } from "next/router";
import classNames from "classnames";
import dynamic from "next/dynamic";
import Filter from "./Filter";

const ManageDataPan = (props) => {
  return (
    <>
      <Card
        bodyStyle={{
          borderTopLeftRadius: "0px",
          minHeight: "calc(100vh - 215px)",
        }}
        style={{
          border: "none",
          borderTopLeftRadius: "0px",
          borderTopRightRadius: "0px",
        }}
      >
        {props.children}
      </Card>
    </>
  );
};

const ForecastScreen = dynamic(() => import("@/src/screen/data/forecast"), {
  ssr: false,
});
const DailyScreen = dynamic(() => import("@/src/screen/data/daily"), {
  ssr: false,
});
const WeeklyScreen = dynamic(() => import("@/src/screen/data/weekly"), {
  ssr: false,
});
const MonthlyScreen = dynamic(() => import("@/src/screen/data/monthly"), {
  ssr: false,
});

const ManageDataLayout = () => {
  const [tabIndex, setTabIndex] = useState(null);
  const { push, asPath, query } = useRouter();

  const options = [
    {
      label: `Forecast`,
      key: "0",
      children: (
        <ManageDataPan>
          <ForecastScreen />
        </ManageDataPan>
      ),
    },
    {
      label: `Daily`,
      key: "1",
      children: (
        <ManageDataPan>
          <DailyScreen />
        </ManageDataPan>
      ),
    },
    {
      label: `Weekly`,
      key: "2",
      children: (
        <ManageDataPan>
          <WeeklyScreen />
        </ManageDataPan>
      ),
    },
    {
      label: `Monthly`,
      key: "3",
      children: (
        <ManageDataPan>
          <MonthlyScreen />
        </ManageDataPan>
      ),
    },
  ];

  useEffect(() => {
    const findRoute = classNames(
      asPath.startsWith("/data/forecast") && "0",
      asPath.startsWith("/data/daily") && "1",
      asPath.startsWith("/data/weekly") && "2",
      asPath.startsWith("/data/monthly") && "3"
    );
    const finalRoute = findRoute || "0";
    if (!findRoute) push("/data/forecast");
    else setTabIndex(finalRoute);
  }, [asPath, push]);

  const pathname = (activeKey) =>
    (activeKey === "0" && "/data/forecast") ||
    (activeKey === "1" && "/data/daily") ||
    (activeKey === "2" && "/data/weekly") ||
    (activeKey === "3" && "/data/monthly");

  return (
    <div className={styles.root}>
      <Filter
        onSubmit={(data) => {
          if (data.by) {
            push({
              pathname: pathname(tabIndex),
              query: {
                brandIds: data.brandIds,
                amIds: data.amIds,
                categoryIds: data.categoryIds,
                by: data.by,
              },
            });
          }
        }}
      />
      <Tabs
        tabBarGutter={4}
        activeKey={tabIndex}
        onChange={(activeKey) => {
          push({
            pathname: pathname(activeKey),
            query: { ...query },
          });
          setTabIndex(activeKey);
        }}
        tabBarExtraContent={
          <button
            className={classNames(
              styles.export_button,
              "btn btn-white btn-active-light-dark btn-sm fw-bolder"
            )}
          >
            Export Data
          </button>
        }
        tabPosition="top"
        animated
        type="card"
        size={"large"}
        items={options}
      />
    </div>
  );
};

export default ManageDataLayout;
