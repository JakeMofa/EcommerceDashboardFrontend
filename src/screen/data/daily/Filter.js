import _ from "lodash";
import { DatePicker, Form, Switch } from "antd";
import { rangePresets } from "@/src/constants/rangePresets";
import { useRouter } from "next/router";

const { RangePicker } = DatePicker;

export default function ManageDataMonthlyFilter(
  filter,
  setDateFilter,
  showColors,
  setShowColors
) {
  const { push, query } = useRouter();

  const onRangeChange = (dates) => {
    if (dates) {
      setDateFilter(dates);
      push({
        pathname: "/data/daily",
        query: {
          ...query,
          q: JSON.stringify({
            from: dates[0].toISOString(),
            to: dates[1].toISOString(),
          }),
        },
      });
    }
  };
  // console.log(filter);
  return (
    <div className="d-flex flex-wrap gap-3">
      <div>
        <RangePicker
          presets={rangePresets}
          value={filter || []}
          onChange={onRangeChange}
          allowClear={false}
          size="large"
        />
      </div>
      {/* <div className="ms-3">
        <Select
          size="large"
          placeholder={"Select Brand"}
          style={{ width: 250 }}
          value={
            brandOptions.length > 0
              ? Number(query?.dBrandId?.toString()) || null
              : null
          }
          allowClear
          onClear={() => {
            push({
              pathname: "/data/daily",
              query: {
                ...query,
                dFrom: undefined,
                dTo: undefined,
                dBrandId: undefined,
              },
            });
          }}
          onChange={(e) => {
            push({
              pathname: "/data/daily",
              query: {
                ...query,
                dBrandId: e,
              },
            });
          }}
          options={brandOptions}
        />
      </div> */}
      <div className="mt-2">
        <Form>
          <Form.Item label="Colors">
            <Switch
              checked={showColors}
              onChange={(checked) => setShowColors(checked)}
            />
          </Form.Item>
        </Form>
      </div>
    </div>
  );
}
