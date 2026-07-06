import { useState, useCallback } from "react";
import svgPaths from "../imports/Html→Body/svg-7ninsmypt3";
import { Toaster, toast } from "sonner";
import { AnimatePresence, motion } from "motion/react";

// ─── Types ────────────────────────────────────────────────────────────────────

type DocStatus = "pending" | "processing" | "pickup";

interface DocCard {
  id: string;
  lines: string[];
  docType: string;
  dotColor: string;
  timeLines: string[];
  status: DocStatus;
}

interface MissedCall {
  id: string;
  nameLines: string[];
  timeLines: string[];
  callbackDone: boolean;
}

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_DOCS: DocCard[] = [
  {
    id: "d1",
    lines: ["Juan Dela", "Cruz"],
    docType: "Barangay ID",
    dotColor: "#002576",
    timeLines: ["10m", "ago"],
    status: "pending",
  },
  {
    id: "d2",
    lines: ["Maria", "Santos"],
    docType: "Clearance",
    dotColor: "#8d4f11",
    timeLines: ["25m", "ago"],
    status: "processing",
  },
  {
    id: "d3",
    lines: ["Pedro Penduko"],
    docType: "Certificate",
    dotColor: "#62000a",
    timeLines: ["1h ago"],
    status: "pickup",
  },
];

const SEED_CALLS: MissedCall[] = [
  { id: "mc1", nameLines: ["Rosa", "Rosal"], timeLines: ["5m", "ago"], callbackDone: false },
  { id: "mc2", nameLines: ["Jose", "Rizal"], timeLines: ["12m", "ago"], callbackDone: false },
];

// ─── SVG helpers ──────────────────────────────────────────────────────────────

function SvgPath({
  d,
  vb,
  w,
  h,
  fill,
}: {
  d: string;
  vb: string;
  w: number;
  h: number;
  fill: string;
}) {
  return (
    <div className="relative shrink-0" style={{ width: w, height: h }}>
      <svg
        className="absolute block inset-0 size-full"
        fill="none"
        preserveAspectRatio="none"
        viewBox={vb}
      >
        <path d={d} fill={fill} />
      </svg>
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

function SideNavBar({
  open,
  onSimulateCall,
}: {
  open: boolean;
  onSimulateCall: () => void;
}) {
  return (
    <div
      className="fixed bg-[#f8f9ff] left-0 top-0 bottom-0 w-[280px] z-20 transition-transform duration-300 ease-in-out"
      style={{
        borderRight: "1px solid #c4c5d5",
        transform: open ? "translateX(0)" : "translateX(-280px)",
      }}
    >
      <div className="flex flex-col gap-2 items-start pl-4 pr-[17px] py-4 size-full overflow-clip">
        {/* Logo + name */}
        <div className="w-full pb-8 shrink-0">
          <div className="flex items-center gap-4 px-2">
            {/* Avatar placeholder: dark bg, green outline */}
            <div
              className="relative shrink-0 rounded-[12px] overflow-hidden"
              style={{ width: 48, height: 48 }}
            >
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
          <button className="bg-[#002576] flex gap-2 h-12 items-center justify-center w-full rounded-sm hover:opacity-90 transition-opacity">
            <SvgPath
              d={svgPaths.p2bb32400}
              vb="0 0 14 14"
              w={14}
              h={14}
              fill="white"
            />
            <span className="font-medium text-[16px] leading-6 text-white">
              New Record
            </span>
          </button>
        </div>

        {/* Nav links */}
        <div className="flex-1 min-h-0 w-full flex flex-col gap-1">
          {/* Dashboard — active */}
          <div className="pl-1 shrink-0 w-[247px]">
            <div className="bg-[#0038a8] flex gap-4 h-12 items-center px-4 rounded-[12px]">
              <SvgPath
                d={svgPaths.p191dcc80}
                vb="0 0 18 18"
                w={18}
                h={18}
                fill="#96ADFF"
              />
              <span className="font-medium text-[16px] leading-6 text-[#96adff]">
                Dashboard
              </span>
            </div>
          </div>

          {/* Archives */}
          <button className="flex gap-4 h-12 items-center px-4 w-full rounded-[12px] hover:bg-black/5 transition-colors text-left">
            <SvgPath
              d={svgPaths.pf86ae00}
              vb="0 0 18 18"
              w={18}
              h={18}
              fill="#444653"
            />
            <span className="font-medium text-[16px] leading-6 text-[#444653]">
              Archives
            </span>
          </button>

          {/* Settings */}
          <button className="flex gap-4 h-12 items-center px-4 w-full rounded-[12px] hover:bg-black/5 transition-colors text-left">
            <SvgPath
              d={svgPaths.p3cdadd00}
              vb="0 0 20.1 20"
              w={20.1}
              h={20}
              fill="#444653"
            />
            <span className="font-medium text-[16px] leading-6 text-[#444653]">
              Settings
            </span>
          </button>
        </div>

        {/* Bottom section */}
        <div
          className="relative w-full pt-[17px] flex flex-col gap-1 shrink-0"
          style={{ borderTop: "1px solid #c4c5d5" }}
        >
          <button className="flex gap-4 h-12 items-center px-4 w-full rounded-[12px] hover:bg-black/5 transition-colors text-left">
            <SvgPath
              d={svgPaths.p2d9a1e80}
              vb="0 0 17 20"
              w={17}
              h={20}
              fill="#444653"
            />
            <span className="font-medium text-[16px] leading-6 text-[#444653]">
              Support
            </span>
          </button>
          <button className="flex gap-4 h-12 items-center px-4 w-full rounded-[12px] hover:bg-black/5 transition-colors text-left">
            <SvgPath
              d={svgPaths.p3e9df400}
              vb="0 0 18 18"
              w={18}
              h={18}
              fill="#444653"
            />
            <span className="font-medium text-[16px] leading-6 text-[#444653]">
              Logout
            </span>
          </button>

          {/* Demo trigger */}
          <button
            onClick={onSimulateCall}
            className="mt-2 text-[12px] text-[#002576] font-medium underline underline-offset-2 px-4 text-left opacity-60 hover:opacity-100 transition-opacity"
          >
            ▶ Demo: Simulate Incoming Call
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Top Nav Bar ──────────────────────────────────────────────────────────────

function TopNavBar({ onToggleSidebar }: { onToggleSidebar: () => void }) {
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
              onClick={onToggleSidebar}
              className="flex items-center justify-center rounded-[12px] size-10 shrink-0 hover:bg-black/5 transition-colors"
              aria-label="Toggle sidebar"
            >
              <SvgPath
                d={svgPaths.p2bce57c0}
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
                <SvgPath
                  d={svgPaths.p8a35e00}
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
                <SvgPath
                  d={svgPaths.p164b49c0}
                  vb="0 0 16 20"
                  w={16}
                  h={20}
                  fill="#444653"
                />
              </button>
              <button className="flex items-center justify-center rounded-[12px] size-10 hover:bg-black/5 transition-colors">
                <SvgPath
                  d={svgPaths.p2816f2c0}
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

// ─── Photo thumbnail placeholder ─────────────────────────────────────────────

function PhotoThumb() {
  return (
    <div
      className="bg-[#f1f5f9] relative rounded-sm shrink-0 size-12"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-col items-start justify-center overflow-clip p-px rounded-[inherit] size-full">
        <div className="flex-1 min-h-px w-full" />
      </div>
    </div>
  );
}

// ─── Pending card ─────────────────────────────────────────────────────────────

function PendingCard({
  card,
  onApprove,
  onReject,
}: {
  card: DocCard;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div
      className="bg-white relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-col gap-4 items-start p-[17px] size-full">
        {/* Header row */}
        <div className="relative w-full flex items-start justify-between">
          <div className="flex gap-4 items-center shrink-0">
            <PhotoThumb />
            <div className="flex flex-col items-start">
              <div className="font-semibold text-[18px] text-[#0b1c30]">
                {card.lines.map((line, i) => (
                  <p
                    key={i}
                    className={i < card.lines.length - 1 ? "mb-0 leading-[27px]" : "leading-[27px]"}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="h-[25.59px] flex items-center gap-3 w-full">
                <div
                  className="rounded-[12px] size-2 shrink-0"
                  style={{ backgroundColor: card.dotColor }}
                />
                <span className="font-normal text-[16px] leading-[25.6px] text-[#444653] whitespace-nowrap">
                  {card.docType}
                </span>
              </div>
            </div>
          </div>
          <div
            className="font-medium text-[14px] text-[#747685] whitespace-nowrap text-right shrink-0"
            style={{ letterSpacing: "0.14px" }}
          >
            {card.timeLines.map((t, i) => (
              <p
                key={i}
                className={i < card.timeLines.length - 1 ? "mb-0 leading-[19.6px]" : "leading-[19.6px]"}
              >
                {t}
              </p>
            ))}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 items-start w-full">
          <button
            onClick={() => onReject(card.id)}
            className="bg-white flex flex-col h-12 items-center justify-center py-px flex-1 rounded-sm hover:bg-gray-50 transition-colors"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <span className="font-medium text-[16px] leading-6 text-[#0b1c30] text-center whitespace-nowrap">
              Reject
            </span>
          </button>
          <button
            onClick={() => onApprove(card.id)}
            className="bg-[#002576] flex flex-col h-12 items-center justify-center flex-1 rounded-sm hover:opacity-90 transition-opacity"
          >
            <span className="font-medium text-[16px] leading-6 text-white text-center whitespace-nowrap">
              Approve
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Processing card ──────────────────────────────────────────────────────────

function ProcessingCard({ card }: { card: DocCard }) {
  return (
    <div
      className="bg-[#dce1ff] opacity-80 relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #b6c4ff" }}
    >
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="flex flex-col items-start p-[17px] relative size-full">
          <div className="absolute bg-[rgba(0,37,118,0.05)] inset-px" />
          <div className="h-[79.59px] relative w-full">
            {/* Resident + doc type */}
            <div className="absolute flex gap-4 items-center left-0 top-0">
              <PhotoThumb />
              <div className="flex flex-col items-start">
                <div className="font-semibold text-[18px] text-[#0b1c30]">
                  {card.lines.map((line, i) => (
                    <p
                      key={i}
                      className={i < card.lines.length - 1 ? "mb-0 leading-[27px]" : "leading-[27px]"}
                    >
                      {line}
                    </p>
                  ))}
                </div>
                <div className="h-[25.59px] flex items-center gap-3">
                  <div
                    className="rounded-[12px] size-2 shrink-0"
                    style={{ backgroundColor: card.dotColor }}
                  />
                  <span className="font-normal text-[16px] leading-[25.6px] text-[#444653] whitespace-nowrap">
                    {card.docType}
                  </span>
                </div>
              </div>
            </div>

            {/* Processing badge */}
            <div
              className="absolute flex gap-1 items-center"
              style={{ left: "152.97px", top: "-0.5px" }}
            >
              <div
                className="relative shrink-0"
                style={{ width: 10.667, height: 14.667 }}
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 10.6667 14.6667"
                >
                  <path d={svgPaths.p35cda880} fill="#002576" />
                </svg>
              </div>
              <span
                className="font-medium text-[14px] leading-[19.6px] text-[#002576] whitespace-nowrap"
                style={{ letterSpacing: "0.14px" }}
              >
                Processing
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Pickup card ──────────────────────────────────────────────────────────────

function PickupCard({
  card,
  onClaim,
}: {
  card: DocCard;
  onClaim: (id: string) => void;
}) {
  return (
    <div
      className="bg-white relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-col gap-4 items-start p-[17px] size-full">
        {/* Header */}
        <div className="relative w-full flex items-start justify-between">
          <div className="flex gap-4 items-center shrink-0">
            {/* Document file icon */}
            <div
              className="bg-[#f1f5f9] relative rounded-sm shrink-0 size-12 flex items-center justify-center"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div
                className="relative shrink-0"
                style={{ width: 16, height: 20 }}
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 16 20"
                >
                  <path d={svgPaths.pc679c40} fill="#747685" />
                </svg>
              </div>
            </div>
            <div className="flex flex-col items-start">
              <div className="font-semibold text-[18px] text-[#0b1c30]">
                {card.lines.map((line, i) => (
                  <p
                    key={i}
                    className={i < card.lines.length - 1 ? "mb-0 leading-[27px]" : "leading-[27px]"}
                  >
                    {line}
                  </p>
                ))}
              </div>
              <div className="h-[25.59px] flex items-center gap-3">
                <div
                  className="rounded-[12px] size-2 shrink-0"
                  style={{ backgroundColor: card.dotColor }}
                />
                <span className="font-normal text-[16px] leading-[25.6px] text-[#444653] whitespace-nowrap">
                  {card.docType}
                </span>
              </div>
            </div>
          </div>
          <span
            className="font-medium text-[14px] leading-[19.6px] text-[#747685] whitespace-nowrap"
            style={{ letterSpacing: "0.14px" }}
          >
            {card.timeLines.join(" ")}
          </span>
        </div>

        {/* Mark Claimed */}
        <button
          onClick={() => onClaim(card.id)}
          className="bg-white h-12 w-full rounded-sm flex gap-2 items-center justify-center px-px hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <div
            className="relative shrink-0"
            style={{ width: 16.3, height: 12.025 }}
          >
            <svg
              className="absolute block inset-0 size-full"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 16.3 12.025"
            >
              <path d={svgPaths.p2f7dfa00} fill="#0B1C30" />
            </svg>
          </div>
          <span className="font-medium text-[16px] leading-6 text-[#0b1c30] text-center whitespace-nowrap">
            Mark Claimed
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Urgencies / Missed Calls panel ──────────────────────────────────────────

function UrgenciesPanel({
  calls,
  onCallBack,
}: {
  calls: MissedCall[];
  onCallBack: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      {/* Section heading */}
      <div className="flex flex-col items-start pb-2 w-full shrink-0">
        <p className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30]">
          Urgent Actions
        </p>
      </div>

      {/* Panel: amber left shadow */}
      <div
        className="bg-[#fffbeb] relative rounded-sm w-full"
        style={{
          border: "1px solid #e2e8f0",
          boxShadow: "-4px 0px 0px 0px #fbbf24",
        }}
      >
        <div className="flex flex-col items-start overflow-clip p-px rounded-[inherit] size-full">
          {/* Panel header */}
          <div
            className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.5)] relative shrink-0 w-full"
            style={{ borderBottom: "1px solid #e2e8f0" }}
          >
            <div className="flex flex-row items-center size-full">
              <div className="flex gap-2 items-center pb-[17px] pt-4 px-4 size-full">
                <div
                  className="relative shrink-0"
                  style={{ width: 22, height: 19 }}
                >
                  <svg
                    className="absolute block inset-0 size-full"
                    fill="none"
                    preserveAspectRatio="none"
                    viewBox="0 0 22 19"
                  >
                    <path d={svgPaths.p7555480} fill="#F59E0B" />
                  </svg>
                </div>
                <span className="font-semibold text-[18px] leading-[27px] text-[#0b1c30] whitespace-nowrap">
                  Missed Calls
                </span>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="relative w-full overflow-auto">
            <div className="flex flex-col items-start p-1 w-full">
              {/* Header row */}
              <div
                className="bg-[#f1f5f9] flex items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full"
                style={{ borderBottom: "1px solid #e2e8f0" }}
              >
                <div className="flex items-start justify-center w-full">
                  <div className="relative w-[93.48px] shrink-0">
                    <div className="flex flex-col items-start pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">
                        RESIDENT
                      </span>
                    </div>
                  </div>
                  <div className="relative w-[63.5px] shrink-0">
                    <div className="flex flex-col items-start pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">
                        TIME
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-end pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">
                        ACTION
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data rows */}
              {calls.map((call, i) => (
                <div
                  key={call.id}
                  className="relative shrink-0 w-full"
                  style={
                    i < calls.length - 1
                      ? { borderBottom: "1px solid #e2e8f0", marginBottom: -1 }
                      : {}
                  }
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="flex items-center justify-center pb-px pl-2 size-full">
                      {/* Name */}
                      <div className="relative w-[77.48px] shrink-0 flex flex-col items-start">
                        {call.nameLines.map((n, j) => (
                          <p
                            key={j}
                            className={
                              "font-medium text-[16px] leading-6 text-[#0b1c30] " +
                              (j === 0 && call.nameLines.length > 1 ? "mb-0" : "")
                            }
                          >
                            {n}
                          </p>
                        ))}
                      </div>

                      {/* Time */}
                      <div
                        className="flex flex-col items-start pb-[12.8px] pl-4 pr-2 pt-[12.2px] w-[71.5px] shrink-0"
                      >
                        {call.timeLines.map((t, j) => (
                          <p
                            key={j}
                            className={
                              "font-medium text-[14px] leading-[19.6px] text-[#444653] " +
                              (j === 0 && call.timeLines.length > 1 ? "mb-0" : "")
                            }
                            style={{ letterSpacing: "0.14px" }}
                          >
                            {t}
                          </p>
                        ))}
                      </div>

                      {/* Action */}
                      <div className="flex flex-col items-end px-2 py-[11.5px] flex-1 min-w-0">
                        {!call.callbackDone ? (
                          <button
                            onClick={() => onCallBack(call.id)}
                            className="bg-white flex gap-2 h-[42px] items-center px-5 py-1 rounded-sm shrink-0 hover:bg-[#eff4ff] active:bg-[#dce1ff] transition-colors"
                            style={{ border: "1px solid #c4c5d5" }}
                          >
                            <div
                              className="relative shrink-0"
                              style={{ width: 13.5, height: 13.5 }}
                            >
                              <svg
                                className="absolute block inset-0 size-full"
                                fill="none"
                                preserveAspectRatio="none"
                                viewBox="0 0 13.5 13.5"
                              >
                                <path d={svgPaths.pb3c9680} fill="#002576" />
                              </svg>
                            </div>
                            <span className="font-medium text-[16px] leading-6 text-[#002576] whitespace-nowrap">
                              Call Back
                            </span>
                          </button>
                        ) : (
                          <span className="font-medium text-[13px] text-[#16a34a] px-2 py-1 bg-[#f0fdf4] rounded-sm">
                            ✓ Called
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {calls.length === 0 && (
                <div className="flex-1 flex items-center justify-center p-8 text-[#747685] text-[14px]">
                  No missed calls
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Incoming call toast ──────────────────────────────────────────────────────

function IncomingCallToast({
  onAccept,
  onDecline,
}: {
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <motion.div
      key="incoming-call"
      initial={{ opacity: 0, y: -12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -12, scale: 0.97 }}
      transition={{ type: "spring", stiffness: 420, damping: 32 }}
      className="absolute bg-white right-8 rounded-[8px] top-8 w-80 z-50"
      style={{
        border: "1px solid #e2e8f0",
        boxShadow: "0px 8px 30px 0px rgba(0,0,0,0.12)",
      }}
      role="alertdialog"
      aria-label="Incoming video call from Lolo Cardo"
    >
      <div className="flex flex-col items-start overflow-clip p-px rounded-[inherit] size-full">
        {/* Info section */}
        <div className="relative w-full flex gap-4 items-start p-4">
          {/* Camera preview: dark bg + green border */}
          <div className="bg-[#0f172a] flex flex-col items-start justify-center overflow-clip relative rounded-sm shrink-0 size-16">
            <div className="flex-1 min-h-px relative w-full" />
            <div
              className="absolute inset-0 rounded-sm pointer-events-none"
              style={{ border: "2px solid #22c55e" }}
            />
          </div>

          {/* Caller info */}
          <div className="flex flex-col flex-1 items-start min-w-0">
            {/* INCOMING CALL label */}
            <div className="flex gap-1 items-center w-full">
              <div
                className="relative shrink-0"
                style={{ width: 13.333, height: 10.667 }}
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 13.3333 10.6667"
                >
                  <path d={svgPaths.p256d480} fill="#16A34A" />
                </svg>
              </div>
              <span
                className="font-bold text-[14px] leading-[19.6px] text-[#16a34a] uppercase whitespace-nowrap"
                style={{ letterSpacing: "0.7px" }}
              >
                INCOMING CALL
              </span>
            </div>

            {/* Name */}
            <div className="overflow-clip pt-1 w-full">
              <p className="font-semibold text-[18px] leading-[27px] text-[#0b1c30]">
                Lolo Cardo
              </p>
            </div>

            {/* Zone */}
            <p
              className="font-medium text-[14px] leading-[19.6px] text-[#444653]"
              style={{ letterSpacing: "0.14px" }}
            >
              Zone 3 Resident
            </p>
          </div>
        </div>

        {/* Action row */}
        <div
          className="relative shrink-0 w-full"
          style={{ borderTop: "1px solid #e2e8f0" }}
        >
          <div className="flex items-start justify-center pt-px size-full">
            {/* Decline */}
            <button
              onClick={onDecline}
              className="bg-[#f8fafc] h-12 relative shrink-0 w-[159.5px] flex gap-1 items-center justify-center pr-px hover:bg-red-50 transition-colors"
              style={{ borderRight: "1px solid #e2e8f0" }}
              aria-label="Decline call"
            >
              <div
                className="relative shrink-0"
                style={{ width: 22.4, height: 8.703 }}
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 22.4 8.7025"
                >
                  <path d={svgPaths.p8c50c10} fill="#DC2626" />
                </svg>
              </div>
              <span className="font-medium text-[16px] leading-6 text-[#dc2626] text-center whitespace-nowrap">
                Decline
              </span>
            </button>

            {/* Accept */}
            <button
              onClick={onAccept}
              className="bg-[#f0fdf4] h-12 relative shrink-0 w-[158.5px] flex gap-1 items-center justify-center hover:bg-emerald-100 transition-colors"
              aria-label="Accept call"
            >
              <div
                className="relative shrink-0 size-[18px]"
              >
                <svg
                  className="absolute block inset-0 size-full"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 18 18"
                >
                  <path d={svgPaths.p143e1930} fill="#15803D" />
                </svg>
              </div>
              <span className="font-medium text-[16px] leading-6 text-[#15803d] text-center whitespace-nowrap">
                Accept
              </span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── App ─────────────────────────────────────────────────────────────────────

export default function App() {
  const [docs, setDocs] = useState<DocCard[]>(SEED_DOCS);
  const [calls, setCalls] = useState<MissedCall[]>(SEED_CALLS);
  const [showCall, setShowCall] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const pending = docs.filter((d) => d.status === "pending");
  const processing = docs.filter((d) => d.status === "processing");
  const pickup = docs.filter((d) => d.status === "pickup");

  const handleApprove = useCallback(
    (id: string) => {
      setDocs((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status: "processing" as DocStatus } : d))
      );
      const doc = docs.find((d) => d.id === id);
      if (doc)
        toast.success(`${doc.lines.join(" ")} — approved`, {
          description: `${doc.docType} is being processed`,
        });
    },
    [docs]
  );

  const handleReject = useCallback(
    (id: string) => {
      const doc = docs.find((d) => d.id === id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (doc)
        toast.error("Request rejected", {
          description: `${doc.lines.join(" ")} — ${doc.docType}`,
        });
    },
    [docs]
  );

  const handleClaim = useCallback(
    (id: string) => {
      const doc = docs.find((d) => d.id === id);
      setDocs((prev) => prev.filter((d) => d.id !== id));
      if (doc)
        toast.success(
          `${doc.lines.join(" ")} has claimed their ${doc.docType}`
        );
    },
    [docs]
  );

  const handleCallBack = useCallback(
    (id: string) => {
      const call = calls.find((c) => c.id === id);
      setCalls((prev) =>
        prev.map((c) => (c.id === id ? { ...c, callbackDone: true } : c))
      );
      if (call)
        toast.success(`Calling back ${call.nameLines.join(" ")}…`, {
          description: "Starting video call",
        });
    },
    [calls]
  );

  const handleAccept = useCallback(() => {
    setShowCall(false);
    toast.success("Call accepted — Lolo Cardo", {
      description: "Video session started",
    });
  }, []);

  const handleDecline = useCallback(() => {
    setShowCall(false);
    setCalls((prev) => [
      {
        id: `mc-${Date.now()}`,
        nameLines: ["Lolo", "Cardo"],
        timeLines: ["just", "now"],
        callbackDone: false,
      },
      ...prev,
    ]);
    toast("Call declined — Lolo Cardo", {
      description: "Added to missed calls log",
    });
  }, []);

  const handleSimulateCall = useCallback(() => {
    if (!showCall) setShowCall(true);
  }, [showCall]);

  const handleToggleSidebar = useCallback(() => {
    setSidebarOpen((prev) => !prev);
  }, []);

  const pendingCount = pending.length + processing.length;

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
        <TopNavBar onToggleSidebar={handleToggleSidebar} />

        {/* Main workspace */}
        <div className="w-full relative z-[1]">
          <div className="max-w-[1440px] mx-auto p-8">
              {/* 3-column grid — height adapts to card count */}
              <div
                className="gap-x-6 gap-y-6 grid grid-cols-3 w-full items-start"
              >
                {/* Kanban board (col 1–2) */}
                <div className="col-span-2 flex flex-col gap-4 items-start">
                  {/* Heading + filter */}
                  <div className="flex flex-col items-start pb-2 w-full shrink-0">
                    <div className="flex items-center justify-between w-full">
                      <p className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30] whitespace-nowrap">
                        Document Requests
                      </p>
                      <button
                        className="flex gap-2 h-12 items-center px-[17px] py-px rounded-sm shrink-0 hover:bg-black/5 transition-colors"
                        style={{ border: "1px solid #c4c5d5" }}
                      >
                        <div
                          className="relative shrink-0"
                          style={{ width: 18, height: 12 }}
                        >
                          <svg
                            className="absolute block inset-0 size-full"
                            fill="none"
                            preserveAspectRatio="none"
                            viewBox="0 0 18 12"
                          >
                            <path d={svgPaths.p2889b5c0} fill="#444653" />
                          </svg>
                        </div>
                        <span className="font-medium text-[16px] leading-6 text-[#444653] text-center whitespace-nowrap">
                          Filter
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Kanban columns */}
                  <div className="flex gap-4 items-start w-full">
                    {/* Pending Review */}
                    <div
                      className="bg-[#eff4ff] flex-1 min-w-0 relative rounded-[4px]"
                      style={{ border: "1px solid #c4c5d5" }}
                    >
                      <div className="flex flex-col gap-2 items-start p-[9px] w-full">
                        <div className="relative w-full shrink-0">
                          <div className="flex flex-col items-start px-2 py-1">
                            <p className="font-medium text-[16px] leading-6 text-[#444653] uppercase w-full">
                              PENDING REVIEW ({pendingCount})
                            </p>
                          </div>
                        </div>
                        {pending.map((card) => (
                          <PendingCard
                            key={card.id}
                            card={card}
                            onApprove={handleApprove}
                            onReject={handleReject}
                          />
                        ))}
                        {processing.map((card) => (
                          <ProcessingCard key={card.id} card={card} />
                        ))}
                        {pendingCount === 0 && (
                          <div className="py-8 flex items-center justify-center w-full text-[#747685] text-[14px]">
                            No pending requests
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Ready for Pickup */}
                    <div
                      className="bg-[#eff4ff] flex-1 min-w-0 relative rounded-[4px]"
                      style={{ border: "1px solid #c4c5d5" }}
                    >
                      <div className="flex flex-col gap-2 items-start p-[9px] size-full">
                        <div className="relative w-full shrink-0">
                          <div className="flex flex-col items-start px-2 py-1">
                            <p className="font-medium text-[16px] leading-6 text-[#444653] uppercase w-full">
                              READY FOR PICKUP ({pickup.length})
                            </p>
                          </div>
                        </div>
                        {pickup.map((card) => (
                          <PickupCard
                            key={card.id}
                            card={card}
                            onClaim={handleClaim}
                          />
                        ))}
                        {pickup.length === 0 && (
                          <div className="py-8 flex items-center justify-center w-full text-[#747685] text-[14px]">
                            No documents ready
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Urgencies panel (col 3) */}
                <div className="col-span-1">
                  <UrgenciesPanel calls={calls} onCallBack={handleCallBack} />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Sidebar */}
      <SideNavBar open={sidebarOpen} onSimulateCall={handleSimulateCall} />

      {/* Incoming call floating toast */}
      <AnimatePresence>
        {showCall && (
          <IncomingCallToast onAccept={handleAccept} onDecline={handleDecline} />
        )}
      </AnimatePresence>
    </div>
  );
}
