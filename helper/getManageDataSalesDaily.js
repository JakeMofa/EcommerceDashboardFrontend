import request from "@/src/api/request";
import { cookies } from "@/src/constants/cookies";
import { brandsFilterPipe } from "@/src/screen/data/forecast/factory";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";

const getManageDataSalesDaily = async (ctx) => {
  const { req, res, query } = ctx;
  const token = getCookie(cookies.TOKEN, { req, res });

  try {
    const { brandIds } = query;

    const filters = query?.q
      ? JSON.parse(query?.q)
      : {
          // from: dayjs().weekday(-7).format("DD/MM/YYYY"),
          // to: dayjs().format("DD/MM/YYYY"),
        };

    const brands = brandsFilterPipe(
      brandIds || [
        161, 160, 159, 158, 157, 155, 154, 153, 152, 151, 150, 149, 148, 141,
        138, 135, 100, 95, 94, 92, 91, 90, 89, 87, 85, 84, 83, 80, 79, 78, 75,
        73, 69, 68, 67, 66, 61, 60, 59, 58, 57, 56, 55, 53, 52, 51, 50, 49, 48,
        45, 35, 34, 32, 31, 30, 29, 28, 27, 22, 21, 20, 18, 17, 16, 14, 6, 4, 3,
        2,
      ]
    );
    const res = await request.post(
      "/all-brands/sales/daily",
      {
        filters,
        brands: brands,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return { data: res.data };
  } catch (error) {
    return Promise.reject(error);
  }
};

export { getManageDataSalesDaily };
