import DashboardLayout from "@/src/layouts/DashboardLayout";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { defaultDateRange } from "@/src/config";
import {
  getSalesBySkuDetails,
  getSalesBySkuDetailsList,
  getSalesBySkuGraphData,
} from "@/src/services/salesBySku.services";
import {
  SkuTable,
  SalesBySkuTable,
  TopBarFilterSku,
  SkuGraph,
} from "@/src/components/sales-analytics/sku";
import {
  selectSalesBySkuDetails,
  selectSalesBySkuDetailsList,
  selectSalesBySkuGraphData,
} from "@/src/store/slice/salesBySku.slice";
import { fetchSalesBySkuDetails } from "@/src/api/salesBySku.api";
import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { message } from "antd";
import { exportToExcel } from "@/src/hooks/Excelexport";
import { DefaultPerPage } from "@/src/config";

export default function SalesBySku() {
  const dispatch = useDispatch();
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState({});
  const [detailsLoading, setDetailsLoading] = useState(true);
  const [graphLoading, setGraphLoading] = useState(true);
  const [graph, setGraph] = useState([]);
  const [dateFilter, setDateFilter] = useState(defaultDateRange());
  const [searchText, setSearchText] = useState("");
  const [sorter, setSorter] = useState({});
  const [pageSize, setPageSize] = useState(DefaultPerPage);

  const salesBySKUDetails = useSelector(selectSalesBySkuDetails);
  const salesSKUDetailsList = useSelector(selectSalesBySkuDetailsList);
  const salesBySKUGraph = useSelector(selectSalesBySkuGraphData);
  const [showDSP, setShowDSP] = useState(false);

  useEffect(() => {
    const brand = JSON.parse(localStorage.getItem("brand"));
    setShowDSP(brand.advertiser_id && brand.advertiser_id.length > 0);
  }, []);

  const getList = (e) => {
    setDetailsLoading(true);
    setGraphLoading(true);
    if (salesSKUDetailsList.status) {
      setLoading(true);
    }
    // dispatch(
    //   getSalesBySkuDetailsList({
    //     start_date: moment(dateFilter[0]['$d']).format('MM-DD-YYYY'),
    //     end_date: moment(dateFilter[1]['$d']).format('MM-DD-YYYY'),
    //     search_text: e || searchText || ''
    //   })
    // );
    dispatch(
      getSalesBySkuDetails({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search_text: e || searchText || "",
        orderBy: sorter?.columnKey,
        order: sorter?.order?.slice(0, -3),
        perPage: pageSize,
      })
    );

    dispatch(
      getSalesBySkuGraphData({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search_text: e || searchText || "",
      })
    );
  };

  const pageChange = (page, perPage) => {
    setLoading(true);
    dispatch(
      getSalesBySkuDetails({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search_text: searchText || "",
        page: page,
        orderBy: sorter?.columnKey,
        order: sorter?.order?.slice(0, -3),
        perPage: perPage,
      })
    );
  };

  const onPageNo = (e) => {
    pageChange(e, salesSKUDetailsList.limit);
  };

  const onPerPage = (e) => {
    setPageSize(e);
    pageChange(1, e);
  };

  useEffect(() => {
    const time = setTimeout(() => {
      if (dateFilter && dateFilter?.length === 2) {
        getList();
      }
    }, 1000);
    return () => {
      clearTimeout(time);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateFilter]);

  useEffect(() => {
    setDetails(salesBySKUDetails?.data);
    setDetailsLoading(false);
  }, [salesBySKUDetails]);

  useEffect(() => {
    if (salesSKUDetailsList.status == true) {
      setList(salesSKUDetailsList?.items || []);
      setLoading(false);
    }
  }, [salesSKUDetailsList]);

  useEffect(() => {
    setGraph(salesBySKUGraph?.data);
    setGraphLoading(false);
  }, [salesBySKUGraph]);

  const handleChange = (_pagination, _filters, sorter) => {
    setLoading(true);
    setSorter(sorter);
    dispatch(
      getSalesBySkuDetails({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search_text: searchText || "",
        orderBy: sorter?.columnKey,
        order: sorter?.order?.slice(0, -3),
      })
    );
  };

  const exportSalesBySKU = () => {
    message.loading("Loading...");
    fetchSalesBySkuDetails({
      start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
      end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
      search_text: searchText || "",
      orderBy: sorter?.columnKey,
      order: sorter?.order?.slice(0, -3),
      perPage: 999999,
    })
      .then((res) => {
        if (res.status === 200 && res.data) {
          exportToExcel({
            columns: [
              "ASIN",
              "SKU",
              "Title",
              "Parent ASIN",
              "Sum Of Units Ordered",
              "Sum Of Ordered Product Sales",
              "Average Of Buy Box",
              "Average Unit Session",
              "Sum Of Sessions",
              "Sum Of Page Views",
              "Average Traffic Percentage",
              "Sum Of Total Order Items",
              "Average Page Views Percentage",
              "Ad Spend",
              "Ad Revenue",
              "TACOS",
            ],
            fileName: "sales-by-sku",
            rows: res.data.items.details.map((text) => {
              return {
                ["ASIN"]: text?.child_asin,
                ["SKU"]: text?.sku,
                ["Title"]: text?.title,
                ["Parent ASIN"]: text?.parent_asin,
                ["Sum Of Units Ordered"]: numberFormat(
                  text?.astr_units_ordered_sum
                ),
                ["Sum Of Ordered Product Sales"]: currencyFormat(
                  text?.ordered_product_sales_sum
                ),
                ["Average Of Buy Box"]: percentageFormat(
                  text?.astr_buy_box_percentage_avg
                ),
                ["Average Unit Session"]: percentageFormat(
                  text?.unit_session_percentage_avg
                ),
                ["Sum Of Sessions"]: numberFormat(text?.astr_sessions_sum),
                ["Sum Of Page Views"]: numberFormat(text?.astr_page_views_sum),
                ["Average Traffic Percentage"]: percentageFormat(
                  text?.astr_session_percentage_avg
                ),
                ["Sum Of Total Order Items"]: numberFormat(
                  text?.total_order_items_sum
                ),
                ["Average Page Views Percentage"]: percentageFormat(
                  text?.astr_page_view_percentage_avg
                ),
                ["Ad Spend"]: currencyFormat(text?.spend),
                ["Ad Revenue"]: currencyFormat(text?.revenue),
                ["TACOS"]: percentageFormat(text?.tacos),
              };
            }),
          });
        } else {
          message.error("No Sales data details available yet.");
        }
        message.destroy();
      })
      .catch((err) => {
        message.destroy();
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };

  return (
    <DashboardLayout>
      <div
        className="content d-flex flex-column flex-column-fluid"
        id="kt_content"
      >
        <div className="container-fluid" id="kt_content_container">
          <TopBarFilterSku
            setDateFilter={(e) => setDateFilter(e)}
            setSearchText={(e) => setSearchText(e.target.value)}
            searchText={searchText}
            dateFilter={dateFilter}
            getList={(e) => getList(e)}
          />
          <SkuTable
            showDSP={showDSP}
            loading={detailsLoading}
            details={details}
          />
          <SkuGraph loading={graphLoading} />
          <SalesBySkuTable
            loading={loading}
            onPageNo={onPageNo}
            onPerPage={onPerPage}
            handleChange={handleChange}
            exportSalesBySKU={exportSalesBySKU}
            showDSP={showDSP}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
