import { Outlet } from "react-router-dom";
import { Toaster } from "sonner";
import { useAppContext } from "@/context/AppContext";
import { SideNavBar } from "./SideNavBar";
import { TopNavBar } from "./TopNavBar";

export function DashboardLayout() {
  const { sidebarOpen } = useAppContext();

  return (
    <div
      className="flex items-start justify-center relative min-h-screen transition-[padding-left] duration-300 ease-in-out"
      style={{
        paddingLeft: sidebarOpen ? 280 : 0,
        backgroundImage:
          "linear-gradient(90deg, rgb(248,250,252) 0%, rgb(248,250,252) 100%)",
      }}
    >
      <Toaster position="bottom-right" richColors />

      {/* Main content area */}
      <div className="flex flex-col flex-1 min-w-0 relative self-stretch isolate">
        <TopNavBar />

        {/* Main workspace */}
        <div className="w-full relative z-[1]">
          <div className="max-w-[1440px] mx-auto p-8">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <SideNavBar />
    </div>
  );
}
