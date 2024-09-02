import Loading from "@/src/components/loading";
import { useState, useEffect } from "react";
import { fetchMeRequest } from "@/src/api/auth.api";
import { fetchUserBrandList } from "@/src/api/brands.api";
import { useRouter } from "next/router";
import { isClient } from "@/src/helpers/isClient";
import DashboardLayout from "@/src/layouts/DashboardLayout";
import { DashboardSvg } from "@/src/assets";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    fetchMeRequest()
      .then((res) => {
        if (res.status == 200 && res.data.user_status === 1 && isClient) {
          let user = JSON.parse(localStorage.getItem("user"));
          user.user_status = 1;
          localStorage.setItem("user", JSON.stringify(user));
          fetchUserBrandList().then((res) => {
            if (
              res.status >= 200 &&
              res.status <= 299 &&
              res.data.brands?.length > 0
            ) {
              if (res.data.brands?.length === 1) {
                localStorage.setItem(
                  "brand",
                  JSON.stringify({
                    ...res.data.brands[0].brand,
                    role: res.data.brands[0].role,
                  })
                );
                router.push("/sales-analytics/sales");
              } else {
                localStorage.setItem(
                  "user",
                  JSON.stringify({
                    ...user,
                    role: user.role === "Admin" ? "Admin" : "Manager",
                  })
                );
                router.push("/brands");
              }
            } else {
              setLoading(false);
            }
          });
        } else {
          setLoading(false);
        }
      })
      .catch((err) => message.error(err?.response?.message));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <DashboardLayout>
      {loading ? (
        <Loading />
      ) : (
        <div className="content d-flex flex-column flex-column-fluid">
          <div className="container-fluid" id="kt_content_container">
            <div className="row">
              <div className="col-lg-12">
                <div className="card mb-7">
                  <div className="card-body">
                    <div className="col-12 d-flex flex-row mb-5">
                      <DashboardSvg />
                      <h1>Dashboard</h1>
                    </div>
                    <div className="col-12 d-flex flex-row mb-5">
                      <h4>Your account is under review. Please wait...</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
