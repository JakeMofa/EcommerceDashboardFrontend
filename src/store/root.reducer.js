import { combineReducers, createAction } from "@reduxjs/toolkit";

import UsersReducer from "./slice/users.slice";
import BrandsReducer from "./slice/brands.slice";
import SalesReducer from "./slice/sales.slice";
import SalesBySku from "./slice/salesBySku.slice";
import SalesByProduct from "./slice/salesByProduct.slice";
import SalesByWeek from "./slice/salesByWeek.slice";
import SalesByMonth from "./slice/salesByMonth.slice";
import InventoryPlanning from "./slice/planning.slice";
import shipping from "./slice/shipping.slice";
import ProductReportList from "./slice/productReport.slice";
import CategoryList from "./slice/categoryList.slice";
import CategoryProductList from "./slice/categoryProductList.slice";
import AsinAndSkuList from "./slice/asinAndSkuList.slice";
import CategoryPerformanceReport from "./slice/categoryPerformanceReport.slice";
import Advertising from "./slice/advertising.slice";
import AdvertisingTotalRevenue from "./slice/advertisingTotalRevenue.slice";
import CustomerAcquisitionMonthly from "./slice/customerAcquisitionMonthly.slice";
import CustomerAcquisitionWeekly from "./slice/customerAcquisitionWeekly.slice";
import InventoryDashboard from "./slice/inventoryDashboard.slice";
import PoTemplateSlice from "./slice/poTemplate.slice";
import CustomerAcquisitionLTV from "./slice/customerAcquisitionLTV.slice";
import CustomerAcquisitionBreakdownMonthly from "./slice/customerAcquisitionBreakdownMonthly.slice";
import CustomerAcquisitionBreakdownWeekly from "./slice/customerAcquisitionBreakdownWeekly.slice";
import CustomerAcquisitionCategoryBreakdownMonthly from "./slice/customerAcquisitionCategoryBreakdownMonthly.slice";
import CustomerAcquisitionCategoryBreakdownWeekly from "./slice/customerAcquisitionCategoryBreakdownWeekly.slice";
import ReportLogs from "./slice/reportLogs.slice";
import CentralReportLogs from "./slice/centralReportLogs.slice";
import InventoryRestockReport from "./slice/inventoryRestockReport.slice";

const appReducer = combineReducers({
  users: UsersReducer,
  brands: BrandsReducer,
  sales: SalesReducer,
  salesBySku: SalesBySku,
  salesByProduct: SalesByProduct,
  salesByWeek: SalesByWeek,
  salesByMonth: SalesByMonth,
  planning: InventoryPlanning,
  shipping: shipping,
  categoryList: CategoryList,
  customerAcquisitionMonthly: CustomerAcquisitionMonthly,
  customerAcquisitionWeekly: CustomerAcquisitionWeekly,
  customerAcquisitionLTV: CustomerAcquisitionLTV,
  customerAcquisitionBreakdownMonthly: CustomerAcquisitionBreakdownMonthly,
  customerAcquisitionBreakdownWeekly: CustomerAcquisitionBreakdownWeekly,
  customerAcquisitionCategoryBreakdownMonthly:
    CustomerAcquisitionCategoryBreakdownMonthly,
  customerAcquisitionCategoryBreakdownWeekly:
    CustomerAcquisitionCategoryBreakdownWeekly,
  productReportList: ProductReportList,
  categoryProductList: CategoryProductList,
  asinAndSkuList: AsinAndSkuList,
  categoryPerformanceReport: CategoryPerformanceReport,
  advertising: Advertising,
  advertisingTotalRevenue: AdvertisingTotalRevenue,
  inventoryDashboard: InventoryDashboard,
  poTemplate: PoTemplateSlice,
  reportLogs: ReportLogs,
  centralReportLogs: CentralReportLogs,
  inventoryRestockReport: InventoryRestockReport,
});

export const reset = createAction("reset");

const rootReducer = (state, action) => {
  if (action.type === reset.type) {
    state = undefined;
  }
  return appReducer(state, action);
};

export { rootReducer };
