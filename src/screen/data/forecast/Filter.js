import { Select } from "antd";
import moment from "moment";
import _ from "lodash";
import { defaultMonth } from "@/src/config";

import { useMemo } from "react";

import { useRouter } from "next/router";

export default function ManageDataMonthlyFilter({ months, setMonths }) {
  const { push, query } = useRouter();

  const selectAll = () => {
    const range = _.range(1, 13);
    push({ query: { ...query, months: range }, pathname: "/data/forecast/" });
  };

  const onMonthsChange = useMemo(() => {
    return _.debounce((e) => {
      setMonths(e);
      push({
        query: { ...query, months: e },
        pathname: "/data/forecast/",
      });
    }, 300);
  }, [setMonths, push, query]);
  return (
    <div className="d-flex flex-wrap gap-3">
      <div>
        <Select
          style={{ width: 300 }}
          size="large"
          placeholder={`Select months`}
          mode="multiple"
          maxTagCount="responsive"
          value={months}
          onChange={onMonthsChange}
          options={moment.months()?.map((d, i) => {
            return { label: d, value: i + 1 };
          })}
        />
      </div>
      <div>
        <button
          className="btn btn-secondary ml-auto mr-10px"
          onClick={selectAll}
        >
          Select All months
        </button>
      </div>
    </div>
  );
}
