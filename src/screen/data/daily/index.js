import { useCallback, useEffect, useState } from "react";
import ASINTable from "@/src/components/table";
import NoData from "@/src/components/no-data";
import _ from "lodash";
import { currencyFormat } from "@/src/helpers/formatting.helpers";
import {
  Alert,
  Button,
  Card,
  DatePicker,
  Select,
  message,
  notification,
} from "antd";
import ManageDataWeeklyFilter from "./Filter";
import moment from "moment";
import AvgDrawer from "./Avg";
import { useManageData } from "@/src/providers/manageData";
import { useRouter } from "next/router";
import dayjs from "dayjs";
import { updateBrandRequest } from "@/src/api/brands.api";
import { useDispatch, useSelector } from "react-redux";
import { selectUserList } from "@/src/store/slice/users.slice";
import {
  assignCategoryToBrand,
  assignUserToBrand,
  deleteCategoryOfBrand,
  deleteUserOfBrand,
  getUserList,
} from "@/src/services/users.services";
import CategoryField from "../components/CategoryField";

const filterOption = (input, option) =>
  (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

export default function ManageDataDailyScreen() {
  const { dailyTab } = useManageData();
  const [showColors, setShowColors] = useState(true);
  const [rangeDates, setRangeDates] = useState({});
  const { daily, updateEndDate, dailyFilter, setDailyFilter } = dailyTab;
  const [startData, endDate] = daily.dayRange;
  const { push, query } = useRouter();
  // dailyFilter, setDailyFilter

  const [amsValue, setAMsValue] = useState({});
  const [categoriesValue, setCategoriesValue] = useState({});

  const dispatch = useDispatch();

  const userList = useSelector(selectUserList);
  const amOptions = userList.items.map((item) => ({
    value: item.id,
    label: item.u_name,
  }));

  useEffect(() => {
    dispatch(getUserList({ perPage: 999 }));
  }, [dispatch]);

  const handleOnAMChange = async (name, accountManagerId, brandId) => {
    setAMsValue((s) => ({ ...s, [name]: accountManagerId }));
    if (accountManagerId) {
      dispatch(assignUserToBrand({ brandId, accountManagerId }));
    } else {
      dispatch(deleteUserOfBrand({ brandId }));
    }
  };

  const handleOnCategoryChange = async (name, categoriesId, brandId) => {
    setCategoriesValue((s) => ({ ...s, [name]: categoriesId }));
    if (categoriesId) {
      dispatch(assignCategoryToBrand({ brandId, categoriesId }));
    } else {
      dispatch(deleteCategoryOfBrand({ brandId, categoriesId }));
    }
  };

  useEffect(() => {
    const res = JSON.parse(query.q || "{}") || {};
    setRangeDates(res);
  }, [query.q]);

  const rangeChange = async (data, index, type) => {
    if (data) {
      const body = {};
      const value = dayjs(data).valueOf();
      type === "from" && (body["vendo_contract_start_date"] = value);
      type === "to" && (body["vendo_contract_end_date"] = value);

      setRangeDates((s) => {
        const res = {
          ...s,
          [index]: {
            ...s[index],
            [type]: value === 0 ? dayjs() : dayjs(data).format("YYYY-MM-DD"),
          },
        };
        return res;
      });

      message.success({
        content: "Loading...",
        key: "loading",
        duration: 0,
        type: "info",
        icon: <></>,
      });
      const response = await updateBrandRequest(index, body);
      updateEndDate(response.data.id, response.data.vendo_contract_end_date);
      message.destroy("loading");
    }
  };

  const days = useCallback((startDate, endDate) => {
    var dates = [];

    var currDate = moment(startDate.format("ddd M/D/YY")).startOf("day");
    var lastDate = moment(endDate.format("ddd M/D/YY")).startOf("day");

    while (currDate.add(1, "days").diff(lastDate) < 0) {
      dates.push({
        title: currDate.format("ddd M/D/YY"),
        value: currDate.format("YYYY-MM-DD"),
      });
    }

    return [
      {
        title: startDate.format("ddd M/D/YY"),
        value: startDate.format("YYYY-MM-DD"),
      },
      ...dates,
      {
        title: endDate.format("ddd M/D/YY"),
        value: endDate.format("YYYY-MM-DD"),
      },
    ];
  }, []);

  const daysRange = days(startData, endDate);

  const columns = [
    {
      title: "Brand Name",
      width: 200,
      fixed: true,
      align: "left",
      sorter: (a, b) => {
        if (a.brandName < b.brandName) {
          return -1;
        }
        if (a.brandName > b.brandName) {
          return 1;
        }
        return 0;
      },
      render: (text) => {
        return text?.brandName;
      },
    },
    {
      title: "Start Date",
      width: 150,
      align: "center",
      sorter: (a, b) => new Date(a.from).getTime() - new Date(b.from).getTime(),
      render: (text) => {
        const end =
          rangeDates?.[text.id]?.to || text?.vendoContractEndDate || text?.to;
        const start =
          rangeDates?.[text.id]?.from ||
          text?.vendoContractStartDate ||
          text.from;

        return (
          <DatePicker
            clearIcon={false}
            suffixIcon={undefined}
            disabledDate={(current) => {
              return current && current > dayjs(end).endOf("day");
            }}
            value={dayjs(start)}
            format={"ddd YY-M-D"}
            onChange={(e) => rangeChange(e, text.id, "from")}
          />
        );
      },
    },
    {
      title: "End Date",
      width: 150,
      align: "center",
      sorter: (a, b) => new Date(a.to).getTime() - new Date(b.to).getTime(),
      render: (text) => {
        const end =
          text?.vendoContractEndDate === 0 ||
          typeof rangeDates?.[text.id]?.to === "object"
            ? undefined
            : rangeDates?.[text.id]?.to ||
              text?.vendoContractEndDate ||
              text?.to;
        const start =
          rangeDates?.[text.id]?.from ||
          text?.vendoContractStartDate ||
          text.from;

        return (
          <DatePicker
            clearIcon={false}
            suffixIcon={
              end ? undefined : <span style={{ width: 89 }}>Present</span>
            }
            presets={[{ label: "Present", value: dayjs(0) }]}
            disabledDate={(current) => {
              return current && current < dayjs(start).endOf("day");
            }}
            value={dayjs(end)}
            format={"ddd YY-M-D"}
            onChange={(e) => rangeChange(e, text.id, "to")}
          />
        );
      },
    },
    {
      title: "Category",
      width: 250,
      align: "center",
      render: (text) => {
        const name = `${text.brandName}-category`.replace(" ", "");
        const stateValue = categoriesValue?.[name];

        return (
          <>
            <CategoryField
              key={name}
              id={name}
              name={name}
              brandId={text.id}
              textValue={text?.categoryName}
              stateValue={stateValue}
              categoryId={text?.categoryId}
              onChange={(value) =>
                value
                  ? handleOnCategoryChange(name, value, text.id)
                  : handleOnCategoryChange(name, null, text.id)
              }
              filterOption={filterOption}
            />
          </>
        );
      },
    },
    {
      title: "AM",
      width: 250,
      align: "center",
      render: (text) => {
        const name = `${text.brandName}-am`.replace(" ", "");
        const stateValue = amsValue?.[name];
        return (
          <>
            <Select
              id={name}
              allowClear
              name={name}
              value={
                amOptions.length > 0
                  ? stateValue === undefined
                    ? text?.accountManagerId
                    : stateValue
                  : null
              }
              onChange={(value) =>
                value
                  ? handleOnAMChange(name, value, text.id)
                  : handleOnAMChange(name, null, text.id)
              }
              options={amOptions}
              filterOption={filterOption}
              placeholder={"Select AM"}
              showSearch
              style={{ width: 150 }}
            />
          </>
        );
      },
    },
    ...daysRange.map((item) => ({
      title: item.title,
      width: 150,
      align: "center",
      sorter: (a, b) => {
        const aValue = a.perDate?.[item.value]?.sales || 0;
        const bValue = b.perDate?.[item.value]?.sales || 0;

        return aValue - bValue;
      },
      render: (text) => {
        const value = text.perDate?.[item.value];
        const color = value?.color;
        return (
          <span
            style={
              showColors && color
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
    })),
    {
      title: "TTL",
      width: 150,
      align: "center",
      sorter: (a, b) => (a.spend || 0) - (b.spend || 0),
      render: (text) => {
        return currencyFormat(text.total || "0");
      },
    },
    {
      title: "AVG",
      width: 150,
      align: "center",
      sorter: (a, b) => (a?.avg || 0) - (b?.avg || 0),
      render: (text) => {
        return currencyFormat(text.average || "0");
      },
    },
  ];

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <Card
          title={ManageDataWeeklyFilter(
            dailyFilter,
            setDailyFilter,
            showColors,
            setShowColors
          )}
          bordered={false}
          bodyStyle={{ padding: "30px 0px 0px 0px" }}
          headStyle={{ padding: "0px 0px 30px 0px" }}
          style={{ boxShadow: "none" }}
        >
          <div className="d-flex justify-content-end mb-9">
            <AvgDrawer
              opener={<Button size="large">Days of week data</Button>}
              showColors={showColors}
            />
          </div>
          {dailyTab?.data?.length != 0 ? (
            <ASINTable
              columns={columns}
              dataSource={daily?.data || []}
              ellipsis
              virtual
              rowHeight={60}
              rowKey="key"
              // loading={loading}
              pagination={false}
              scroll={{
                x: columns?.reduce((a, b) => a.width + b.width, 0) + 300,
                y:
                  typeof window !== "undefined"
                    ? window.innerHeight - 310
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
