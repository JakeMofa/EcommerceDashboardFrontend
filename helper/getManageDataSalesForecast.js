import request from "@/src/api/request";
import { defaultMonth, defaultYear } from "@/src/config";
import { cookies } from "@/src/constants/cookies";
import {
  brandsFilterPipe,
  monthFilterPipe,
} from "@/src/screen/data/forecast/factory";
import { getCookie } from "cookies-next";
import _ from "lodash";

const getManageDataSalesForecast = async (ctx) => {
  const { req, res, query } = ctx;
  const token = getCookie(cookies.TOKEN, { req, res });

  try {
    const months = monthFilterPipe(
      query?.months || _.range(1, defaultMonth() + 1)
    );
    const brandIds = brandsFilterPipe(query?.brandIds || []);
    const amIds = brandsFilterPipe(query?.amIds || []);
    const categoryIds = brandsFilterPipe(query?.categoryIds || []);
    const res = await request.get("/forecast", {
      params: {
        months: months.length > 0 ? months.join(",") : null,
        year: defaultYear(),
        brandIds: brandIds.length > 0 ? brandIds.join(",") : null,
        amIds: amIds.length > 0 ? amIds.join(",") : null,
        categoryIds: categoryIds.length > 0 ? categoryIds.join(",") : null,
      },
      headers: { Authorization: `Bearer ${token}` },
    });
    return { data: res.data };
  } catch (error) {
    return Promise.reject(error);
  }
};

export { getManageDataSalesForecast };
