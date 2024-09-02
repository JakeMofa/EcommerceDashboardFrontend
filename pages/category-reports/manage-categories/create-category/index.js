import _ from "lodash";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import CreateCategoryScreen from "@/src/components/CreateCategory";

export default function CreateNewCategory() {
  return (
    <DashboardLayout>
      <div className="content d-flex flex-column flex-column-fluid">
        <div className="container-fluid">
          <div className="row">
            <div className="col-lg-12">
              <div className="card mb-7">
                <div className="card-body">
                  <CreateCategoryScreen />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
