import { useEffect, useState } from "react";
import ASINTable from "@/src/components/table";
import { defaultYear } from "@/src/config";
import NoData from "@/src/components/no-data";
import _ from "lodash";
import {
  currencyFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { Card, DatePicker, Select, Tooltip, message } from "antd";
import ManageDataWeeklyFilter from "./Filter";
import moment from "moment";
import { useManageData } from "@/src/providers/manageData";
import dayjs from "dayjs";
import { useRouter } from "next/router";
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
const columnToggleInitialValues = ["sales", "spend", "revenue"];

const columnToggleOptions = [
  { label: "Sales", value: "sales" },
  { label: "Ad Spend", value: "spend" },
  { label: "Ad Revenue", value: "revenue" },
];

export default function ManageDataMonthlyScreen() {
  const { monthlyTab } = useManageData();
  const [showColors, setShowColors] = useState(true);
  const [rangeDates, setRangeDates] = useState({});
  const [amsValue, setAMsValue] = useState({});
  const [categoriesValue, setCategoriesValue] = useState({});

  const { query } = useRouter();

  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);

  const onChange = (checkedValues) => {
    const valid = checkedValues.some(
      (item) => item === "sales" || item === "spend" || item === "revenue"
    );
    const data = valid ? checkedValues : columnToggleInitialValues;
    setColumnToggle(data);
  };

  const { monthly, updateEndDate } = monthlyTab;
  const dispatch = useDispatch();

  const userList = useSelector(selectUserList);
  const amOptions = userList.items.map((item) => ({
    value: item.id,
    label: item.u_name,
  }));

  useEffect(() => {
    dispatch(getUserList({ perPage: 999 }));
  }, [dispatch]);

  useEffect(() => {
    const res = JSON.parse(query.q || "{}") || {};
    setRangeDates(res);
  }, [query.q]);

  const [filter, setFilter] = useState({
    month: _.range(1, 13),
    year: [defaultYear()],
  });

  const handleOnAMChange = async (name, accountManagerId, brandId) => {
    setAMsValue((s) => ({ ...s, [name]: accountManagerId }));
    if (accountManagerId) {
      dispatch(assignUserToBrand({ brandId, accountManagerId }));
    } else {
      dispatch(deleteUserOfBrand({ brandId }));
    }
  };

  const handleOnCategoryChange = async (
    name,
    stateId,
    brandId,
    categoriesId
  ) => {
    setCategoriesValue((s) => ({ ...s, [name]: stateId }));
    if (stateId) {
      dispatch(assignCategoryToBrand({ brandId, stateId }));
    } else {
      dispatch(deleteCategoryOfBrand({ brandId, categoriesId }));
    }
  };

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
          (typeof rangeDates?.[text.id]?.to !== "string" &&
            text?.vendoContractEndDate === 0) ||
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
                  : handleOnCategoryChange(
                      name,
                      null,
                      text.id,
                      text?.categoryId
                    )
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
        // console.log(text);
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
    {
      title: "Average",
      children: [
        columnToggle.includes("sales") && {
          title: "Sales",
          width: 150,
          sorter: (a, b) => {
            return a.averageSale - b.averageSale;
          },
          render: (text) => currencyFormat(text.averageSale),
        },
        columnToggle.includes("spend") && {
          title: "Ad Spend",
          width: 150,
          sorter: (a, b) => {
            return a.averageSpend - b.averageSpend;
          },
          render: (text) => {
            return currencyFormat(text.averageSpend);
          },
        },
        columnToggle.includes("revenue") && {
          title: "Ad Revenue",
          width: 150,
          sorter: (a, b) => {
            return a.averageRevenue - b.averageRevenue;
          },
          render: (text) => currencyFormat(text.averageRevenue),
        },
      ].filter(Boolean),
    },
    {
      title: "Total",
      children: [
        columnToggle.includes("sales") && {
          title: "Sales",
          width: 150,
          sorter: (a, b) => {
            return a.totalSale - b.totalSale;
          },
          render: (text) => currencyFormat(text.totalSale),
        },
        columnToggle.includes("spend") && {
          title: "Ad Spend",
          width: 150,
          sorter: (a, b) => {
            return a.totalSpend - b.totalSpend;
          },
          render: (text) => currencyFormat(text.totalSpend),
        },
        columnToggle.includes("revenue") && {
          title: "Ad Revenue",
          width: 150,
          sorter: (a, b) => {
            return a.totalRevenue - b.totalRevenue;
          },
          render: (text) => currencyFormat(text.totalRevenue),
        },
      ].filter(Boolean),
    },
    ...filter.month.map((item) => {
      const iden = moment()
        .month(item - 1)
        .format("MMM");
      return {
        title: iden,
        children: [
          columnToggle.includes("sales") && {
            title: "Sales",
            width: 150,
            sorter: (a, b) => {
              const aValue = a.perMonth?.[item]?.sales || 0;
              const bValue = b.perMonth?.[item]?.sales || 0;
              return aValue - bValue;
            },
            render: (text) => {
              const value = text.perMonth?.[item];
              const color = value?.color;
              return (
                <Tooltip
                  title={percentageFormat((value?.sales / text.total) * 100)}
                >
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
                </Tooltip>
              );
            },
          },
          columnToggle.includes("spend") && {
            title: "Ad Spend",
            width: 150,
            sorter: (a, b) => {
              const aValue = a.perMonth?.[item]?.spend || 0;
              const bValue = b.perMonth?.[item]?.spend || 0;
              return aValue - bValue;
            },
            render: (text) => {
              const value = text.perMonth?.[item];
              return (
                <Tooltip
                  title={percentageFormat((value?.spend / text.total) * 100)}
                >
                  {currencyFormat(value?.spend || "0")}
                </Tooltip>
              );
            },
          },
          columnToggle.includes("revenue") && {
            title: "Ad Revenue",
            width: 150,
            sorter: (a, b) => {
              const aValue = a.perMonth?.[item]?.revenue || 0;
              const bValue = b.perMonth?.[item]?.revenue || 0;
              return aValue - bValue;
            },
            render: (text) => {
              const value = text.perMonth?.[item];
              return (
                <Tooltip
                  title={percentageFormat((value?.revenue / text.total) * 100)}
                >
                  {currencyFormat(value?.revenue || "0")}
                </Tooltip>
              );
            },
          },
        ].filter(Boolean),
      };
    }),
  ];

  return (
    <>
      <div className="d-flex flex-column flex-column-fluid">
        <Card
          title={ManageDataWeeklyFilter(
            filter,
            setFilter,
            {
              year_mode: "multiple",
            },
            showColors,
            setShowColors,
            {
              columnToggleOptions,
              columnToggle,
              onChange,
            }
          )}
          bordered={false}
          bodyStyle={{ padding: "30px 0px 0px 0px" }}
          headStyle={{ padding: "0px 0px 30px 0px" }}
          style={{ boxShadow: "none" }}
        >
          {monthly?.data?.length != 0 ? (
            <ASINTable
              columns={columns}
              dataSource={monthly?.data || []}
              virtual
              rowHeight={60}
              ellipsis
              rowKey="key"
              pagination={false}
              scroll={{
                x:
                  columns?.reduce((acc, item) => {
                    if (item.children) {
                      const childTotals = item.children.reduce(
                        (childAcc, child) => {
                          if (child.width) {
                            childAcc += child.width;
                          }
                          return childAcc;
                        },
                        0
                      );

                      acc += childTotals;
                    } else {
                      acc += item.width;
                    }

                    return acc;
                  }, 0) + 500,
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
