import React from "react";
import _ from "lodash";
import CategoryPerformanceReport from "@/src/components/Category-Reports/CategoryPerformanceReport";
import DashboardLayout from "@/src/layouts/DashboardLayout";

export default function CategoryPerformanceReportPage() {
  return (
    <DashboardLayout>
      <CategoryPerformanceReport />
    </DashboardLayout>
  );
}
