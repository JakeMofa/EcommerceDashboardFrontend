import {
  currencyFormat,
  numberFormat,
  percentageFormat,
} from "@/src/helpers/formatting.helpers";
import { Button, Checkbox, Table, Tooltip } from "antd";
import NoData from "../../no-data";
import {
  ExportToExcel,
  exportToExcel,
  exportToExcelTest,
} from "@/src/hooks/Excelexport";
import { useSelector } from "react-redux";
import { selectAdvertisementCampaignData } from "@/src/store/slice/advertising.slice";
import Loading from "../../loading";
import ASINTable from "../../table";
import _ from "lodash";
import { isValidElement, useMemo, useState } from "react";

const idens = [
  { key: "spend", formater: currencyFormat },
  { key: "revenue", formater: currencyFormat },
  { key: "impression", formater: numberFormat },
  { key: "clicks", formater: numberFormat },
  { key: "conversions", formater: numberFormat },
  { key: "unit_ordered", formater: numberFormat },
];

const columnToggleOptions = [
  { label: "Current", value: "current" },
  { label: "Previous", value: "previous" },
  { label: "DIFF", value: "diff" },
  { label: "PCT", value: "pct" },
];

const columnToggleInitialValues = ["current", "previous", "diff", "pct"];

export default function DiffTable(props) {
  const { rowSelection, onReset, showResetButton, selectedRowsId } = props;
  const { data: tableList, status: loading } = useSelector(
    selectAdvertisementCampaignData
  );
  const [columnToggle, setColumnToggle] = useState(columnToggleInitialValues);

  const onChange = (checkedValues) => {
    const valid = checkedValues.some(
      (item) => item === "current" || item === "previous" || item === "diff"
    );
    const data = valid ? checkedValues : columnToggleInitialValues;
    setColumnToggle(data);
  };

  const columns = useMemo(() => {
    return [
      {
        title: "Name",
        width: 210,
        fixed: "left",
        render: (text) => (
          <Tooltip title={text?.campaign_name}>
            <span
              style={{
                maxWidth: 210,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
                display: "block",
              }}
            >
              {text?.campaign_name}
            </span>
          </Tooltip>
        ),
      },
      ...idens.map((item) => ({
        title: <span style={{ textTransform: "capitalize" }}>{item.key}</span>,
        children: [
          columnToggle.includes("current") && {
            title: "Current",
            width: 100,
            sorter: (a, b) =>
              a?.[`current_${item.key}`] - b?.[`current_${item.key}`],
            render: (text) => item.formater(text?.[`current_${item.key}`]),
          },
          columnToggle.includes("previous") && {
            title: "Previous",
            width: 100,
            sorter: (a, b) =>
              a?.[`previous_${item.key}`] - b?.[`previous_${item.key}`],
            render: (text) => item.formater(text?.[`previous_${item.key}`]),
          },
          columnToggle.includes("diff") && {
            title: "DIFF",
            width: 100,
            sorter: (a, b) => a?.[`${item.key}_diff`] - b?.[`${item.key}_diff`],
            render: (text) => item.formater(text?.[`${item.key}_diff`]),
          },
          columnToggle.includes("pct") && {
            title: "PCT",
            width: 100,
            sorter: (a, b) => a?.[`${item.key}_pct`] - b?.[`${item.key}_pct`],
            render: (text) => percentageFormat(text?.[`${item.key}_pct`]),
          },
        ].filter(Boolean),
      })),
    ];
  }, [columnToggle]);

  const tableWidth = useMemo(() => {
    return columns?.reduce((acc, item) => {
      if (item.width) {
        acc += item.width;
      }
      if (item.children) {
        const childrenWidths = item.children.map((item) => item.width);
        acc += _.sum(childrenWidths);
      }

      return acc;
    }, 0);
  }, [columns]);

  const totals = tableList.reduce((acc, item) => {
    let selected = false;
    const allIdens = idens.reduce((bacc, iden) => {
      const currentKEY = `current_${iden.key}`;
      const previousKEY = `previous_${iden.key}`;
      const diffKEY = `${iden.key}_diff`;
      const pctKEY = `${iden.key}_pct`;

      selected = selectedRowsId.includes(item.campaign_id);

      if (selected) {
        const temp = {
          [currentKEY]:
            (acc?.[currentKEY] || 0) + _.toNumber(item?.[currentKEY] || 0),
          [previousKEY]:
            (acc?.[previousKEY] || 0) + _.toNumber(item?.[previousKEY] || 0),
          [diffKEY]: (acc?.[diffKEY] || 0) + _.toNumber(item?.[diffKEY] || 0),
          [pctKEY]: 0,
        };
        bacc = { ...bacc, ...temp };
        return bacc;
      }
      if (selectedRowsId.length === 0) {
        const current =
          (acc?.[currentKEY] || 0) + _.toNumber(item?.[currentKEY] || 0);
        const previous =
          (acc?.[previousKEY] || 0) + _.toNumber(item?.[previousKEY] || 0);
        const temp = {
          [currentKEY]: current,
          [previousKEY]: previous,
          [diffKEY]: (acc?.[diffKEY] || 0) + _.toNumber(item?.[diffKEY] || 0),
          [pctKEY]: {
            0: current,
            1: previous,
          },
        };

        bacc = { ...bacc, ...temp };
        return bacc;
      }
      return bacc;
    }, {});
    acc = { ...acc, ...allIdens };

    return acc;
  }, {});

  const excelColumns = columns.reduce((acc, item, key) => {
    const title = isValidElement(item.title)
      ? item.title.props.children
      : item.title;

    acc.push({
      title,
      render:
        item.render ||
        function () {
          return "-";
        },
    });
    if (item.children) {
      item.children.forEach((child) =>
        acc.push({
          title: `${title}-${child.title}`,
          render:
            child.render ||
            function () {
              return "-";
            },
        })
      );
    }
    return acc;
  }, []);

  return (
    <div className="row fadeInRight">
      <div className="col-lg-12">
        <div className="card" style={{}}>
          <div className="card-header">
            <h3 className="d-flex align-items-sm-center">
              <span className="card-label fw-bolder fs-3 mb-1">
                Campaigns Comparison
              </span>

              {showResetButton && (
                <Button
                  onClick={onReset}
                  size="small"
                  type="dashed"
                  className="ms-4"
                >
                  Reset
                </Button>
              )}
            </h3>
            <div className="card-toolbar">
              <div className="dropdown">
                <Checkbox.Group
                  options={columnToggleOptions}
                  value={columnToggle}
                  onChange={onChange}
                />
                <ExportToExcel
                  loading={loading}
                  fileName={"advertising-data"}
                  rows={
                    tableList?.reduce((acc, item, key) => {
                      const row = excelColumns.reduce((a, c) => {
                        const res = c.render(item);
                        a[c.title] = isValidElement(res)
                          ? res.props.title || res.props.children
                          : res;
                        return a;
                      }, {});
                      acc.push(row);

                      return acc;
                    }, []) || []
                  }
                  columns={excelColumns?.map((item) => item.title) || []}
                >
                  <button
                    className="btn btn-light-danger fs-7 px-10"
                    type="button"
                    id="dropdownMenuButton1"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Export
                  </button>
                </ExportToExcel>
              </div>
            </div>
          </div>
          <div className="card-body pt-0 px-4" style={{}}>
            {loading ? (
              <Loading />
            ) : tableList?.length != 0 ? (
              <ASINTable
                bordered
                columns={columns}
                dataSource={tableList}
                ellipsis
                rowKey="key"
                loading={loading}
                pagination={false}
                scroll={{
                  x: tableWidth + 300,
                  y:
                    typeof window !== "undefined"
                      ? window.innerHeight - 410
                      : undefined,
                }}
                isCheckBoxRow
                rowSelection={rowSelection}
                summary={() => (
                  <Table.Summary fixed>
                    <Table.Summary.Row className={"position-relative"}>
                      <Table.Summary.Cell className="position-sticky left-0 bg-white z-index-1" />
                      <Table.Summary.Cell className="position-sticky left-52 bg-white z-index-1">
                        <b>Total</b>
                      </Table.Summary.Cell>
                      {Object.keys(totals).map((k) => {
                        const formatter = idens.find((fid) =>
                          k.includes(fid.key)
                        ).formater;
                        const current = columnToggle.includes("current");
                        const previous = columnToggle.includes("previous");
                        const diff = columnToggle.includes("diff");
                        const pct = columnToggle.includes("pct");
                        if (
                          (k.includes("current") && current) ||
                          (k.includes("previous") && previous) ||
                          (k.includes("diff") && diff) ||
                          (k.includes("pct") && pct)
                        ) {
                          if (k.includes("pct")) {
                            const val =
                              ((totals[k][0] - totals[k][1]) / totals[k][1]) *
                              100;
                            return (
                              <Table.Summary.Cell
                                align="center"
                                className="z-index-0"
                                key={k}
                              >
                                <b>{percentageFormat(val)}</b>
                              </Table.Summary.Cell>
                            );
                          } else {
                            return (
                              <Table.Summary.Cell
                                align="center"
                                className="z-index-0"
                                key={k}
                              >
                                <b>
                                  {formatter ? formatter(totals[k]) : totals[k]}
                                </b>
                              </Table.Summary.Cell>
                            );
                          }
                        }
                      })}
                    </Table.Summary.Row>
                  </Table.Summary>
                )}
              />
            ) : (
              <div>
                <NoData />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
