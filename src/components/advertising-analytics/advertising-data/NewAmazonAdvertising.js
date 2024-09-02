import Graphs from "@/src/components/advertising-analytics/advertising-data/Graphs";
import TopBarFilter from "@/src/components/advertising-analytics/advertising-data/top-bar-filter";
import { defaultDateRange } from "@/src/config";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import {
  getCampaignData,
  getGraphData,
} from "@/src/services/advertising.services";
import { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import moment from "moment";
import DiffTable from "@/src/components/advertising-analytics/advertising-data/DiffTable";

export default function NewAmazonAdvertising() {
  const [dateFilter, setDateFilter] = useState(defaultDateRange());
  const [searchText, setSearchText] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const dispatch = useDispatch();

  const selectedRowsId = selectedRows?.map((item) => item.campaign_id);

  const getList = useCallback(() => {
    dispatch(
      getGraphData({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search: searchText || undefined,
        campaign_ids: selectedRowsId.length > 0 ? selectedRowsId.join(",") : [],
      })
    );
    dispatch(
      getCampaignData({
        start_date: moment(dateFilter[0]["$d"]).format("YYYY-MM-DD"),
        end_date: moment(dateFilter[1]["$d"]).format("YYYY-MM-DD"),
        search: searchText || undefined,
      })
    );
  }, [dateFilter, dispatch, searchText, selectedRowsId]);

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
  }, [dateFilter, selectedRowKeys]);

  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      setSelectedRows(selectedRows);
      setSelectedRowKeys(selectedRowKeys);
    },
    getCheckboxProps: (record) => ({
      disabled: record.campaign_name === "Total",
      name: record.id,
    }),
    selectedRowKeys,
  };

  const resetSelection = () => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  };
  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <TopBarFilter
            setDateFilter={(e) => setDateFilter(e)}
            setSearchText={(e) => {
              setSearchText(e.target.value);
            }}
            searchText={searchText}
            dateFilter={dateFilter}
            getList={resetSelection}
          />

          <Graphs />
          <DiffTable
            onReset={resetSelection}
            showResetButton={selectedRows.length > 0}
            rowSelection={rowSelection}
            selectedRowsId={selectedRowsId}
          />
        </div>
      </div>
    </DashboardLayout>
  );
}
