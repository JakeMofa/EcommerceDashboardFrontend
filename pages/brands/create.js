import DashboardLayout from "@/src/layouts/DashboardLayout";
import General from "@/src/components/brands/general-settings";

export default function Brands() {

  return (
    <DashboardLayout>
      <div className="mt-6">
        <General />
      </div>
    </DashboardLayout>
  );
}
