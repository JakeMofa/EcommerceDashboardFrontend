import { composeMiddleware } from "next-compose-middleware";
import { NextResponse } from "next/server";
import authorize from "./lib/authorize";
import validatebrandID from "./lib/validatebrandID";

export default async function middleware(req) {
  return composeMiddleware(req, NextResponse.next(), {
    scripts: [],
    "/login": [authorize("reverse")],

    "/users": [authorize("default")],
    "/users/create": [authorize("default")],
    "/users/edit": [authorize("default")],

    "/dashboard": [authorize("default")],

    "/brands": [authorize("default")],
    "/brands/create": [authorize("default")],
    "/brands/edit": [authorize("default"), validatebrandID],

    "/data": [authorize("default")],
    "/data/forecast": [authorize("default")],
    "/data/daily": [authorize("default")],
    "/data/weekly": [authorize("default")],
    "/data/monthly": [authorize("default")],

    "/central-report-logs": [authorize("default")],

    "/sales-analytics": [authorize("default"), validatebrandID],
    "/sales-analytics/month": [authorize("default")],
    "/sales-analytics/product": [authorize("default")],
    "/sales-analytics/sales": [authorize("default")],
    "/sales-analytics/sku": [authorize("default")],
    "/sales-analytics/week": [authorize("default")],

    "/inventory-management/inventory-dashboard": [authorize("default")],
    "/inventory-management/planning": [authorize("default")],

    "/customer-acquisition": [authorize("default"), validatebrandID],
    "/customer-acquisition/ltv": [authorize("default")],
    "/customer-acquisition/new-vs-repeat": [authorize("default")],
    "/customer-acquisition/product-breakdown": [authorize("default")],
    "/customer-acquisition/category-breakdown": [authorize("default")],
    "/customer-acquisition/import-data": [authorize("default")],

    "/advertising-analytics": [authorize("default"), validatebrandID],
    "/advertising-analytics/advertising-data": [authorize("default")],
    "/advertising-analytics/total-revenue-acos": [authorize("default")],
    "/advertising-analytics/import": [authorize("default")],

    "/central-log-system": [authorize("default"), validatebrandID],

    "/category-reports": [authorize("default"), validatebrandID],
    "/category-reports/category-performance-report": [authorize("default")],
    "/category-reports/product-report": [authorize("default")],
    "/category-reports/category-product-list": [authorize("default")],
    "/category-reports/manage-categories": [authorize("default")],
    "/category-reports/manage-categories/create-category": [
      authorize("default"),
    ],
  });
}
