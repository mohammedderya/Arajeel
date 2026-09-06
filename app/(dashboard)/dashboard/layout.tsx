import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import { DashboardTopBar } from "@/components/dashboard/dashboard-top-bar";

export default function DashboardLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex min-h-screen bg-[#141414]">
      <DashboardNav />
      <div className="flex-1 lg:mr-[220px]">
        <DashboardTopBar />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
