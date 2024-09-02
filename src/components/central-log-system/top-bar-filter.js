import { Select, Input, DatePicker } from "antd";
const { RangePicker } = DatePicker;

export default function TopBarFilter(
  filter,
  setFilter,
  dateFilter,
  setDateFilter,
  report_types
) {
  const reportRequestStatuses = [
    { label: "All", value: "" },
    { label: "waiting for amazon", value: "0" },
    { label: "In-process", value: "2" },
    { label: "Got error from Amazon", value: "3" },
    { label: "Done", value: "4" },
    { label: "Error while processing", value: "5" },
  ];

  return (
    <div className="row gx-5 gx-xl-5 fadeInRight">
      <div className="col-xl-12 mb-5 mb-xl-5">
        <div className="card card-flush h-xl-100">
          <div className="card-body px-4 py-4">
            <div className="d-flex flex-wrap gap-3">
              <div>
                <Select
                  defaultValue={filter?.reportType}
                  size="large"
                  style={{ width: 300 }}
                  value={filter?.reportType || null}
                  placeholder="Select Report Type"
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      reportType: e,
                      page: 1,
                    });
                  }}
                  options={report_types}
                />
              </div>
              <div>
                <Select
                  defaultValue={filter?.reportRequestStatus}
                  size="large"
                  style={{ width: 200 }}
                  value={filter?.reportRequestStatus || null}
                  placeholder="Select Report Status"
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      reportRequestStatus: e,
                      page: 1,
                    });
                  }}
                  options={reportRequestStatuses}
                />
              </div>
              <div className="position-relative">
                <Input
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      marketplace: e.target.value,
                      page: 1,
                    });
                  }}
                  value={filter.marketplace}
                  size="large"
                  placeholder="Marketplace"
                />
              </div>
              <div className="position-relative">
                <RangePicker
                  value={dateFilter || []}
                  onChange={setDateFilter}
                  allowClear={false}
                  size="large"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
