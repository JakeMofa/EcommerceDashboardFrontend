import dayjs from "dayjs";
const weekOfYear = require("dayjs/plugin/weekOfYear");
dayjs.extend(weekOfYear);

export const API_URL = "https://api2.Vendo.com/api/v1/";
export const KeepaGraph = "https://graph.keepa.com/pricehistory.png";
export const AmazonawsList =
  "https://urrmjlumse.execute-api.eu-west-2.amazonaws.com/prod/api/";
export const pageDropdown = [10, 25, 50, 100];
export const DefaultPerPage = 10;
export const priceCommonSign = "€";

export const defaultYear = () => {
  return dayjs().year();
};

export const defaultWeek = () => {
  return Math.max(dayjs().week(), 0);
};

export const defaultMonth = () => {
  return dayjs().month();
};

export const defaultDateRange = () => {
  return [
    dayjs().add(-7 - dayjs().day(), "d"),
    dayjs().add(-1 - dayjs().day(), "d"),
  ];
};
