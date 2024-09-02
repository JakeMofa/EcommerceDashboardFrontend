import DashboardLayout from "@/src/layouts/DashboardLayout";
import { General } from "@/src/components/users";

export default function Users() {
  return (
    <DashboardLayout>
      <div className="mt-6">
        <General />
      </div>
    </DashboardLayout>
  );
}
