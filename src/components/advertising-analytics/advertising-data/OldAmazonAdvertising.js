import { useEffect, useState } from "react";
import KPITable from "@/src/components/advertising-analytics/advertising-data/KPITable";
import Graph from "@/src/components/advertising-analytics/advertising-data/Graph";
import TopBarFilter from "@/src/components/advertising-analytics/top-bar-filter";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { defaultWeek, defaultYear } from "@/src/config";
import { useSelector, useDispatch } from "react-redux";
import { getAdvertising } from "@/src/services/advertising.services";
import {
  selectLastWeekKPIs,
  selectYearToDayKPIs,
  selectAdvertisements,
} from "@/src/store/slice/advertising.slice";
import _ from "lodash";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";

export default function OldAmazonAdvertising() {
  const dispatch = useDispatch();
  const lastWeekKPIs = useSelector(selectLastWeekKPIs);
  const yearToDayKPIs = useSelector(selectYearToDayKPIs);
  const advertisements = useSelector(selectAdvertisements);

  const [filter, setFilter] = useState({
    week: _.range(1, defaultWeek() + 1),
    year: defaultYear(),
  });

  const [lastWeekKPIsData, setLastWeekKPIsData] = useState({});
  const [lastYearToDayKPIsData, setYearToDayKPIsData] = useState({});
  const [advertisementsData, setAdvertisementsData] = useState([]);

  const [lastWeekKPIsLoading, setLastWeekKPIsLoading] = useState(true);
  const [yearToDayKPIsLoading, setYearToDayKPIsLoading] = useState(true);
  const [graphsLoading, setGraphsLoading] = useState(true);

  useEffect(() => {
    if (lastWeekKPIs?.status === true) {
      setLastWeekKPIsData(lastWeekKPIs?.data || {});
      setLastWeekKPIsLoading(false);
    } else if (lastWeekKPIs?.status === false) {
      setLastWeekKPIsLoading(false);
    }
  }, [lastWeekKPIs]);

  useEffect(() => {
    if (yearToDayKPIs?.status === true) {
      setYearToDayKPIsData(yearToDayKPIs?.data || {});
      setYearToDayKPIsLoading(false);
    } else if (yearToDayKPIs?.status === false) {
      setYearToDayKPIsLoading(false);
    }
  }, [yearToDayKPIs]);

  useEffect(() => {
    if (advertisements?.status === true) {
      setAdvertisementsData(
        advertisements?.data.map((h) => {
          return {
            ...h,
            ACoS: (h.spend * 100) / h.total_ordered_product_sales,
          };
        }) || []
      );
      setGraphsLoading(false);
    } else if (advertisements?.status === false) {
      setGraphsLoading(false);
    }
  }, [advertisements]);

  useEffect(() => {
    if (filter?.week.length > 0 && filter?.year) {
      setLastWeekKPIsLoading(true);
      setYearToDayKPIsLoading(true);
      setGraphsLoading(true);
      const time = setTimeout(() => {
        dispatch(
          getAdvertising({
            search_year: filter?.year,
            search_week: filter?.week?.join(","),
          })
        );
      }, 600);
      return () => {
        clearTimeout(time);
      };
    }
  }, [filter, dispatch]);

  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          {TopBarFilter(filter, setFilter, "Week", {
            loading:
              yearToDayKPIsLoading || lastWeekKPIsLoading || graphsLoading,
            data: advertisementsData,
          })}

          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-6 h-550px h-md-100">
              <KPITable
                heading="KPI YTD"
                loading={yearToDayKPIsLoading}
                data={lastYearToDayKPIsData}
              />
            </div>
            <div className="col-xl-6 h-550px h-md-100">
              <KPITable
                heading="KPI LW"
                loading={lastWeekKPIsLoading}
                data={lastWeekKPIsData}
              />
            </div>
          </div>

          <div className="row gx-5 gx-xl-5">
            <div className="col-xl-6 mb-5">
              <Graph
                heading="REVENUE"
                loading={graphsLoading}
                chartData={advertisementsData}
                formatter={currencyFormat}
                yaxisFormatter={currencyFormat}
                columns={[{ name: "Total Revenue", data: "revenue" }]}
              />
            </div>
            <div className="col-xl-6 mb-5">
              <Graph
                heading="SPEND"
                loading={graphsLoading}
                chartData={advertisementsData}
                formatter={currencyFormat}
                yaxisFormatter={currencyFormat}
                columns={[{ name: "Spend", data: "spend" }]}
              />
            </div>
            <div className="col-xl-6 mb-5">
              <Graph
                heading="ACOS"
                loading={graphsLoading}
                chartData={advertisementsData}
                formatter={percentageFormat}
                yaxisFormatter={percentageFormat}
                columns={[{ name: "ACoS", data: "ACoS_percentage" }]}
              />
            </div>
            <div className="col-xl-6 mb-5">
              <Graph
                heading="CPO"
                loading={graphsLoading}
                chartData={advertisementsData}
                formatter={currencyFormat}
                yaxisFormatter={currencyFormat}
                columns={[{ name: "CPO", data: "CPO" }]}
              />
            </div>
            <div className="col-xl-6 mb-5">
              <Graph
                heading="TOTAL SALES & ACOS"
                loading={graphsLoading}
                chartData={advertisementsData}
                formatter={currencyFormat}
                yaxisFormatter={numberFormat}
                columns={[
                  {
                    name: "Total Sales",
                    data: "total_ordered_product_sales",
                  },
                  { name: "Total ACoS", data: "ACoS" },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
