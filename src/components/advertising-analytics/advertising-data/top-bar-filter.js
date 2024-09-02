import { rangePresets } from "@/src/constants/rangePresets";
import { Input, DatePicker } from "antd";

const { RangePicker } = DatePicker;

export default function TopBarFilter({
  setDateFilter,
  setSearchText,
  dateFilter,
  searchText,
  getList,
}) {
  const onRangeChange = (dates, dateStrings) => {
    if (dates) {
      setDateFilter(dates);
    }
  };

  return (
    <>
      <div className="row gx-5 gx-xl-5">
        <div className="col-xl-12 mb-5 mb-xl-5">
          <div className="card card-flush h-xl-100">
            <div className="card-body px-4 py-4">
              <div className="d-flex flex-wrap gap-4 ">
                <div className="position-relative my-1">
                  <Input
                    placeholder="Search by Campaign"
                    style={{
                      width: 250,
                    }}
                    value={searchText || null}
                    onChange={setSearchText}
                    onPressEnter={() => {
                      getList();
                    }}
                    size="large"
                  />
                </div>
                <div className="position-relative my-1">
                  <RangePicker
                    presets={rangePresets}
                    value={dateFilter || []}
                    onChange={onRangeChange}
                    allowClear={false}
                    size="large"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
