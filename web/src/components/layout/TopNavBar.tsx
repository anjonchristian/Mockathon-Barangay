import { useAppContext } from "@/context/AppContext";
import { SvgIcon } from "@/components/icons/SvgIcon";

export function TopNavBar() {
  const { toggleSidebar } = useAppContext();

  return (
    <div
      className="bg-white h-12 w-full relative z-[2] shrink-0"
      style={{ borderBottom: "1px solid #c4c5d5" }}
    >
      <div className="flex flex-row items-center size-full">
        <div className="flex items-center justify-between pb-px px-8 size-full">
          {/* Left: hamburger + search */}
          <div className="flex flex-1 items-center gap-4 min-w-0">
            <button
              onClick={toggleSidebar}
              className="flex items-center justify-center rounded-[12px] size-10 shrink-0 hover:bg-black/5 transition-colors"
              aria-label="Toggle sidebar"
            >
              <SvgIcon
                name="p2bce57c0"
                vb="0 0 18 12"
                w={18}
                h={12}
                fill="#444653"
              />
            </button>

            <div className="relative max-w-[448px] w-[448px]">
              <input
                type="search"
                placeholder="Search records..."
                className="bg-[#f8f9ff] h-10 w-full rounded-sm pl-[41px] pr-[17px] py-[10px] font-normal text-[16px] text-[#0b1c30] placeholder:text-[#747685] outline-none focus:ring-1 focus:ring-[#002576]"
                style={{ border: "1px solid #c4c5d5" }}
              />
              <div className="absolute bottom-[20%] left-4 top-[20%] flex flex-col items-start">
                <SvgIcon
                  name="p8a35e00"
                  vb="0 0 18 18"
                  w={18}
                  h={18}
                  fill="#747685"
                />
              </div>
            </div>
          </div>

          {/* Right */}
          <div className="flex gap-6 items-center shrink-0">
            {/* Online indicator */}
            <div className="flex gap-1 items-center">
              <div className="bg-[#16a34a] rounded-[12px] size-2" />
              <span className="font-medium text-[16px] leading-6 text-[#444653]">
                Online
              </span>
            </div>

            <div className="flex gap-2 items-center">
              <button className="flex items-center justify-center rounded-[12px] size-10 hover:bg-black/5 transition-colors">
                <SvgIcon
                  name="p164b49c0"
                  vb="0 0 16 20"
                  w={16}
                  h={20}
                  fill="#444653"
                />
              </button>
              <button className="flex items-center justify-center rounded-[12px] size-10 hover:bg-black/5 transition-colors">
                <SvgIcon
                  name="p2816f2c0"
                  vb="0 0 20 20"
                  w={20}
                  h={20}
                  fill="#444653"
                />
              </button>
              {/* Profile pic placeholder */}
              <div className="flex flex-col h-8 items-start pl-2 shrink-0 w-10">
                <div
                  className="relative rounded-[12px] size-8"
                  style={{ border: "1px solid #c4c5d5" }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
