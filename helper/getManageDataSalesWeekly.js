import request from "@/src/api/request";
import { cookies } from "@/src/constants/cookies";
import { brandsFilterPipe } from "@/src/screen/data/forecast/factory";
import { getCookie } from "cookies-next";

const getManageDataSalesWeekly = async (ctx) => {
  const { req, res, query } = ctx;
  const token = getCookie(cookies.TOKEN, { req, res });

  try {
    const brandIds = brandsFilterPipe(
      query?.brandIds || [
        161, 160, 159, 158, 157, 155, 154, 153, 152, 151, 150, 149, 148, 141,
        138, 135, 100, 95, 94, 92, 91, 90, 89, 87, 85, 84, 83, 80, 79, 78, 75,
        73, 69, 68, 67, 66, 61, 60, 59, 58, 57, 56, 55, 53, 52, 51, 50, 49, 48,
        45, 35, 34, 32, 31, 30, 29, 28, 27, 22, 21, 20, 18, 17, 16, 14, 6, 4, 3,
        2,
      ]
    ).join(",");
    const amIds = brandsFilterPipe(query?.amIds || []);
    const categoryIds = brandsFilterPipe(query?.categoryIds || []);
    const res = await request.post(
      "/all-brands/sales/weekly",
      {},
      {
        params: {
          ams: amIds.join(",") || null,
          categories: categoryIds.join(",") || null,
          brandIds: brandIds,
        },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(res.data);
    return { data: res.data };
  } catch (error) {
    console.log(error.message);
    return Promise.reject(error);
  }
};

export { getManageDataSalesWeekly };
