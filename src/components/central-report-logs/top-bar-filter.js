import { selectFilter } from "@/src/helpers/selectFilter";
import { Select } from "antd";

export default function TopBarFilter(
  filter,
  setFilter,
  report_types,
  statuses,
  brands
) {
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
                  defaultValue={filter?.status}
                  size="large"
                  style={{ width: 200 }}
                  value={filter?.status || null}
                  placeholder="Select Report Status"
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      status: e,
                      page: 1,
                    });
                  }}
                  options={statuses}
                />
              </div>
              <div>
                <Select
                  showSearch
                  allowClear
                  options={brands}
                  filterOption={selectFilter}
                  defaultValue={filter?.brand_id}
                  value={filter?.brand_id || null}
                  placeholder="Select Brand"
                  style={{ width: 250 }}
                  onChange={(e) => {
                    setFilter({
                      ...filter,
                      brand_id: e,
                      page: 1,
                    });
                  }}
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
