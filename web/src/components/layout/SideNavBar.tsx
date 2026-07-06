import { useState, useCallback } from "react";
import { NavLink } from "react-router-dom";
import { useAppContext } from "@/context/AppContext";
import svgPaths from "../../imports/Html→Body/svg-7ninsmypt3";
import { SvgIcon } from "@/components/icons/SvgIcon";
import { NewRecordDialog } from "@/components/NewRecordDialog";

const NAV_ITEMS = [
  {
    to: "/",
    label: "Dashboard",
    icon: { name: "p191dcc80" as keyof typeof svgPaths, vb: "0 0 18 18", w: 18, h: 18 },
  },
  {
    to: "/archives",
    label: "Archives",
    icon: { name: "pf86ae00" as keyof typeof svgPaths, vb: "0 0 18 18", w: 18, h: 18 },
  },
  {
    to: "/e-blotter",
    label: "e-Blotter",
    icon: { name: "pf86ae00" as keyof typeof svgPaths, vb: "0 0 18 18", w: 18, h: 18 },
  },
  {
    to: "/emergency",
    label: "Broadcast",
    icon: { name: "p2d9a1e80" as keyof typeof svgPaths, vb: "0 0 17 20", w: 17, h: 20 },
  },
  {
    to: "/staff",
    label: "Staff",
    icon: { name: "p2d9a1e80" as keyof typeof svgPaths, vb: "0 0 17 20", w: 17, h: 20 },
  },
  {
    to: "/analytics",
    label: "Analytics",
    icon: { name: "p191dcc80" as keyof typeof svgPaths, vb: "0 0 18 18", w: 18, h: 18 },
  },
  {
    to: "/settings",
    label: "Settings",
    icon: { name: "p3cdadd00" as keyof typeof svgPaths, vb: "0 0 20.1 20", w: 20.1, h: 20 },
  },
] as const;

const BOTTOM_ITEMS = [
  {
    label: "Support",
    icon: { name: "p2d9a1e80" as keyof typeof svgPaths, vb: "0 0 17 20", w: 17, h: 20 },
  },
  {
    label: "Logout",
    icon: { name: "p3e9df400" as keyof typeof svgPaths, vb: "0 0 18 18", w: 18, h: 18 },
  },
] as const;

export function SideNavBar() {
  const { sidebarOpen } = useAppContext();
  const [newRecordOpen, setNewRecordOpen] = useState(false);

  const handleRecordCreated = useCallback(() => {
    // The dialog auto-closes on success — this hook could trigger a refetch
  }, []);

  return (
    <>
      <NewRecordDialog
        open={newRecordOpen}
        onOpenChange={setNewRecordOpen}
        onCreated={handleRecordCreated}
      />
      <div
      className="fixed bg-[#f8f9ff] left-0 top-0 bottom-0 w-[280px] z-20 transition-transform duration-300 ease-in-out"
      style={{
        borderRight: "1px solid #c4c5d5",
        transform: sidebarOpen ? "translateX(0)" : "translateX(-280px)",
      }}
    >
      <div className="flex flex-col gap-2 items-start pl-4 pr-[17px] py-4 size-full overflow-clip">
        {/* Logo + name */}
        <div className="w-full pb-8 shrink-0">
          <div className="flex items-center gap-4 px-2">
            <div className="relative shrink-0 rounded-[12px] overflow-hidden" style={{ width: 48, height: 48 }}>
              <div className="bg-[#0f172a] absolute inset-0 rounded-sm">
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none rounded-sm"
                  style={{ border: "2px solid #22c55e" }}
                />
              </div>
            </div>
            <div className="flex flex-col items-start">
              <p className="font-bold text-[20px] leading-[28px] text-[#002576] whitespace-nowrap">
                e-Kap Admin
              </p>
              <p
                className="font-medium text-[14px] leading-[19.6px] text-[#444653] whitespace-nowrap"
                style={{ letterSpacing: "0.14px" }}
              >
                District 1 Office
              </p>
            </div>
          </div>
        </div>

        {/* New Record button */}
        <div className="h-[72px] w-full flex flex-col items-start pb-6 shrink-0">
          <button
            onClick={() => setNewRecordOpen(true)}
            className="bg-[#002576] flex gap-2 h-12 items-center justify-center w-full rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
          >
            <SvgIcon name="p2bb32400" vb="0 0 14 14" w={14} h={14} fill="white" />
            <span className="font-medium text-[16px] leading-6 text-white">
              New Record
            </span>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 min-h-0 w-full flex flex-col gap-1">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/"}
              className={({ isActive }) =>
                `flex gap-4 h-12 items-center px-4 w-full rounded-[12px] transition-colors ${
                  isActive
                    ? "bg-[#0038a8]"
                    : "hover:bg-black/5"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <SvgIcon
                    name={item.icon.name}
                    vb={item.icon.vb}
                    w={item.icon.w}
                    h={item.icon.h}
                    fill={isActive ? "#96ADFF" : "#444653"}
                  />
                  <span
                    className={`font-medium text-[16px] leading-6 ${
                      isActive ? "text-[#96adff]" : "text-[#444653]"
                    }`}
                  >
                    {item.label}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </div>

        {/* Bottom section */}
        <div
          className="relative w-full pt-[17px] flex flex-col gap-1 shrink-0"
          style={{ borderTop: "1px solid #c4c5d5" }}
        >
          {BOTTOM_ITEMS.map((item) => (
            <button
              key={item.label}
              className="flex gap-4 h-12 items-center px-4 w-full rounded-[12px] hover:bg-black/5 transition-colors text-left"
            >
              <SvgIcon
                name={item.icon.name}
                vb={item.icon.vb}
                w={item.icon.w}
                h={item.icon.h}
                fill="#444653"
              />
              <span className="font-medium text-[16px] leading-6 text-[#444653]">
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
    </>
  );
}
