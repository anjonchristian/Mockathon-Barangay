import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useRequests } from "@/hooks/useRequests";
import { useMissedCalls } from "@/hooks/useMissedCalls";
import { useSignaling } from "@/hooks/useSignaling";
import { SvgIcon } from "@/components/icons/SvgIcon";
import type { KanbanCard } from "@/types";

// ─── Photo thumbnail ──────────────────────────────────────────────────────────

function PhotoThumb({ photoBase64 }: { photoBase64?: string }) {
  return (
    <div
      className="bg-[#f1f5f9] relative rounded-sm shrink-0 size-12 overflow-clip"
      style={{ border: "1px solid #e2e8f0" }}
    >
      {photoBase64 ? (
        <img
          src={
            photoBase64.startsWith("data:")
              ? photoBase64
              : `data:image/jpeg;base64,${photoBase64}`
          }
          alt="ID photo"
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-start justify-center overflow-clip p-px rounded-[inherit] size-full">
          <div className="flex-1 min-h-px w-full" />
        </div>
      )}
    </div>
  );
}

// ─── Pending card ─────────────────────────────────────────────────────────────

function PendingCard({
  card,
  onApprove,
  onReject,
}: {
  card: KanbanCard;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  const nameParts = card.fullName.split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div
      className="bg-white relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-col gap-4 items-start p-[17px] size-full">
        <div className="relative w-full flex items-start justify-between">
          <div className="flex gap-4 items-center shrink-0">
            <PhotoThumb photoBase64={card.photoBase64} />
            <div className="flex flex-col items-start">
              <div className="font-semibold text-[18px] text-[#0b1c30]">
                {lastName ? (
                  <>
                    <p className="mb-0 leading-[27px]">{firstName}</p>
                    <p className="leading-[27px]">{lastName}</p>
                  </>
                ) : (
                  <p className="leading-[27px]">{card.fullName}</p>
                )}
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
          <span className="font-medium text-[14px] leading-[19.6px] text-[#747685] whitespace-nowrap text-right shrink-0" style={{ letterSpacing: "0.14px" }}>
            {card.timeAgo}
          </span>
        </div>

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

function ProcessingCard({ card }: { card: KanbanCard }) {
  const nameParts = card.fullName.split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div
      className="bg-[#dce1ff] opacity-80 relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #b6c4ff" }}
    >
      <div className="overflow-clip rounded-[inherit] size-full">
        <div className="flex flex-col items-start p-[17px] relative size-full">
          <div className="absolute bg-[rgba(0,37,118,0.05)] inset-px" />
          <div className="h-[79.59px] relative w-full">
            <div className="absolute flex gap-4 items-center left-0 top-0">
              <PhotoThumb photoBase64={card.photoBase64} />
              <div className="flex flex-col items-start">
                <div className="font-semibold text-[18px] text-[#0b1c30]">
                  {lastName ? (
                    <>
                      <p className="mb-0 leading-[27px]">{firstName}</p>
                      <p className="leading-[27px]">{lastName}</p>
                    </>
                  ) : (
                    <p className="leading-[27px]">{card.fullName}</p>
                  )}
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

            <div className="absolute flex gap-1 items-center" style={{ left: "152.97px", top: "-0.5px" }}>
              <SvgIcon
                name="p35cda880"
                vb="0 0 10.6667 14.6667"
                w={10.667}
                h={14.667}
                fill="#002576"
              />
              <span className="font-medium text-[14px] leading-[19.6px] text-[#002576] whitespace-nowrap" style={{ letterSpacing: "0.14px" }}>
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
  card: KanbanCard;
  onClaim: (id: string) => void;
}) {
  const nameParts = card.fullName.split(" ");
  const firstName = nameParts[0] ?? "";
  const lastName = nameParts.slice(1).join(" ") || "";

  return (
    <div
      className="bg-white relative rounded-sm shrink-0 w-full"
      style={{ border: "1px solid #e2e8f0" }}
    >
      <div className="flex flex-col gap-4 items-start p-[17px] size-full">
        <div className="relative w-full flex items-start justify-between">
          <div className="flex gap-4 items-center shrink-0">
            <div
              className="bg-[#f1f5f9] relative rounded-sm shrink-0 size-12 flex items-center justify-center"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <SvgIcon name="pc679c40" vb="0 0 16 20" w={16} h={20} fill="#747685" />
            </div>
            <div className="flex flex-col items-start">
              <div className="font-semibold text-[18px] text-[#0b1c30]">
                {lastName ? (
                  <>
                    <p className="mb-0 leading-[27px]">{firstName}</p>
                    <p className="leading-[27px]">{lastName}</p>
                  </>
                ) : (
                  <p className="leading-[27px]">{card.fullName}</p>
                )}
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
          <span className="font-medium text-[14px] leading-[19.6px] text-[#747685] whitespace-nowrap" style={{ letterSpacing: "0.14px" }}>
            {card.timeAgo}
          </span>
        </div>

        <button
          onClick={() => onClaim(card.id)}
          className="bg-white h-12 w-full rounded-sm flex gap-2 items-center justify-center px-px hover:bg-gray-50 transition-colors"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <SvgIcon name="p2f7dfa00" vb="0 0 16.3 12.025" w={16.3} h={12.025} fill="#0B1C30" />
          <span className="font-medium text-[16px] leading-6 text-[#0b1c30] text-center whitespace-nowrap">
            Mark Claimed
          </span>
        </button>
      </div>
    </div>
  );
}

// ─── Incoming call toast ──────────────────────────────────────────────────────

function IncomingCallToast({
  callerName,
  callerInfo,
  onAccept,
  onDecline,
}: {
  callerName: string;
  callerInfo?: string;
  onAccept: () => void;
  onDecline: () => void;
}) {
  return (
    <div
      className="fixed bg-white right-8 rounded-[8px] top-8 w-80 z-50"
        style={{
          border: "1px solid #e2e8f0",
          boxShadow: "0px 8px 30px 0px rgba(0,0,0,0.12)",
        }}
        role="alertdialog"
        aria-label={`Incoming video call from ${callerName}`}
      >
        <div className="flex flex-col items-start overflow-clip p-px rounded-[inherit] size-full">
          <div className="relative w-full flex gap-4 items-start p-4">
            <div className="bg-[#0f172a] flex flex-col items-start justify-center overflow-clip relative rounded-sm shrink-0 size-16">
              <div className="flex-1 min-h-px relative w-full" />
              <div
                className="absolute inset-0 rounded-sm pointer-events-none"
                style={{ border: "2px solid #22c55e" }}
              />
            </div>
            <div className="flex flex-col flex-1 items-start min-w-0">
              <div className="flex gap-1 items-center w-full">
                <SvgIcon name="p256d480" vb="0 0 13.3333 10.6667" w={13.333} h={10.667} fill="#16A34A" />
                <span className="font-bold text-[14px] leading-[19.6px] text-[#16a34a] uppercase whitespace-nowrap" style={{ letterSpacing: "0.7px" }}>
                  INCOMING CALL
                </span>
              </div>
              <div className="overflow-clip pt-1 w-full">
                <p className="font-semibold text-[18px] leading-[27px] text-[#0b1c30]">
                  {callerName}
                </p>
              </div>
              {callerInfo && (
                <p className="font-medium text-[14px] leading-[19.6px] text-[#444653]" style={{ letterSpacing: "0.14px" }}>
                  {callerInfo}
                </p>
              )}
            </div>
          </div>
          <div className="relative shrink-0 w-full" style={{ borderTop: "1px solid #e2e8f0" }}>
            <div className="flex items-start justify-center pt-px size-full">
              <button
                onClick={onDecline}
                className="bg-[#f8fafc] h-12 relative shrink-0 w-[159.5px] flex gap-1 items-center justify-center pr-px hover:bg-red-50 transition-colors"
                style={{ borderRight: "1px solid #e2e8f0" }}
                aria-label="Decline call"
              >
                <SvgIcon name="p8c50c10" vb="0 0 22.4 8.7025" w={22.4} h={8.703} fill="#DC2626" />
                <span className="font-medium text-[16px] leading-6 text-[#dc2626] text-center whitespace-nowrap">
                  Decline
                </span>
              </button>
              <button
                onClick={onAccept}
                className="bg-[#f0fdf4] h-12 relative shrink-0 w-[158.5px] flex gap-1 items-center justify-center hover:bg-emerald-100 transition-colors"
                aria-label="Accept call"
              >
                <SvgIcon name="p143e1930" vb="0 0 18 18" w={18} h={18} fill="#15803D" />
                <span className="font-medium text-[16px] leading-6 text-[#15803d] text-center whitespace-nowrap">
                  Accept
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
  );
}

// ─── Urgencies Panel ──────────────────────────────────────────────────────────

function UrgenciesPanel({
  missedCalls,
  onCallBack,
}: {
  missedCalls: Array<{ id: string; name: string; timeAgo: string; callbackDone: boolean }>;
  onCallBack: (id: string) => void;
}) {
  return (
    <div className="flex flex-col gap-4 items-start w-full">
      <div className="flex flex-col items-start pb-2 w-full shrink-0">
        <p className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30]">
          Urgent Actions
        </p>
      </div>

      <div
        className="bg-[#fffbeb] relative rounded-sm w-full"
        style={{
          border: "1px solid #e2e8f0",
          boxShadow: "-4px 0px 0px 0px #fbbf24",
        }}
      >
        <div className="flex flex-col items-start overflow-clip p-px rounded-[inherit] size-full">
          <div
            className="backdrop-blur-[4px] bg-[rgba(255,255,255,0.5)] relative shrink-0 w-full"
            style={{ borderBottom: "1px solid #e2e8f0" }}
          >
            <div className="flex flex-row items-center size-full">
              <div className="flex gap-2 items-center pb-[17px] pt-4 px-4 size-full">
                <SvgIcon name="p7555480" vb="0 0 22 19" w={22} h={19} fill="#F59E0B" />
                <span className="font-semibold text-[18px] leading-[27px] text-[#0b1c30] whitespace-nowrap">
                  Missed Calls
                </span>
              </div>
            </div>
          </div>

          <div className="relative w-full overflow-auto">
            <div className="flex flex-col items-start p-1 w-full">
              <div
                className="bg-[#f1f5f9] flex items-start justify-center mb-[-1px] pb-px relative shrink-0 w-full"
                style={{ borderBottom: "1px solid #e2e8f0" }}
              >
                <div className="flex items-start justify-center w-full">
                  <div className="relative w-[93.48px] shrink-0">
                    <div className="flex flex-col items-start pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">RESIDENT</span>
                    </div>
                  </div>
                  <div className="relative w-[63.5px] shrink-0">
                    <div className="flex flex-col items-start pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">TIME</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col items-end pb-[9.75px] pt-[9.25px] px-2">
                      <span className="font-bold text-[14px] leading-[21px] text-[#444653] uppercase whitespace-nowrap">ACTION</span>
                    </div>
                  </div>
                </div>
              </div>

              {missedCalls.map((call, i) => (
                <div
                  key={call.id}
                  className="relative shrink-0 w-full"
                  style={
                    i < missedCalls.length - 1
                      ? { borderBottom: "1px solid #e2e8f0", marginBottom: -1 }
                      : {}
                  }
                >
                  <div className="flex flex-row items-center justify-center size-full">
                    <div className="flex items-center justify-center pb-px pl-2 size-full">
                      <div className="relative w-[77.48px] shrink-0 flex flex-col items-start">
                        {call.name.split(" ").map((n, j) => (
                          <p
                            key={j}
                            className={
                              "font-medium text-[16px] leading-6 text-[#0b1c30] " +
                              (j === 0 ? "mb-0" : "")
                            }
                          >
                            {n}
                          </p>
                        ))}
                      </div>
                      <div className="flex flex-col items-start pb-[12.8px] pl-4 pr-2 pt-[12.2px] w-[71.5px] shrink-0">
                        <p className="font-medium text-[14px] leading-[19.6px] text-[#444653]" style={{ letterSpacing: "0.14px" }}>
                          {call.timeAgo}
                        </p>
                      </div>
                      <div className="flex flex-col items-end px-2 py-[11.5px] flex-1 min-w-0">
                        {!call.callbackDone ? (
                          <button
                            onClick={() => onCallBack(call.id)}
                            className="bg-white flex gap-2 h-[42px] items-center px-5 py-1 rounded-sm shrink-0 hover:bg-[#eff4ff] active:bg-[#dce1ff] transition-colors"
                            style={{ border: "1px solid #c4c5d5" }}
                          >
                            <SvgIcon name="pb3c9680" vb="0 0 13.5 13.5" w={13.5} h={13.5} fill="#002576" />
                            <span className="font-medium text-[16px] leading-6 text-[#002576] whitespace-nowrap">Call Back</span>
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

              {missedCalls.length === 0 && (
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

// ─── Dashboard Page ───────────────────────────────────────────────────────────

export default function DashboardPage() {
  const {
    cards,
    loading,
    error,
    approve,
    reject,
    markClaimed,
  } = useRequests();

  const {
    calls: missedCalls,
    handleCallBack,
  } = useMissedCalls();

  const {
    incomingCall,
    connected,
    acceptCall,
    declineCall,
  } = useSignaling();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const filteredCards = searchQuery
    ? cards.filter((c) =>
        c.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        c.docType.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : cards;

  const pending = filteredCards.filter((c) => c.status === "pending");
  const processing = filteredCards.filter((c) => c.status === "processing");
  const pickup = filteredCards.filter((c) => c.status === "pickup");
  const pendingCount = pending.length + processing.length;

  const handleBatchApprove = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await approve(id);
    }
    setSelectedIds(new Set());
    toast.success(`Approved ${ids.length} request(s)`);
  }, [selectedIds, approve]);

  const handleBatchReject = useCallback(async () => {
    const ids = Array.from(selectedIds);
    for (const id of ids) {
      await reject(id);
    }
    setSelectedIds(new Set());
    toast.success(`Rejected ${ids.length} request(s)`);
  }, [selectedIds, reject]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full size-8 border-2 border-[#002576] border-t-transparent" />
          <p className="text-[#747685] text-[14px]">Loading requests...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4 max-w-md text-center">
          <div className="bg-red-100 rounded-full size-12 flex items-center justify-center">
            <span className="text-red-600 text-xl font-bold">!</span>
          </div>
          <p className="text-[#0b1c30] font-semibold text-[16px]">Failed to load data</p>
          <p className="text-[#747685] text-[14px]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* 3-column grid */}
      <div className="gap-x-6 gap-y-6 grid grid-cols-3 w-full items-start">
        {/* Kanban board (col 1–2) */}
        <div className="col-span-2 flex flex-col gap-4 items-start">
          {/* Heading + search + batch actions */}
          <div className="flex flex-col gap-2 items-start pb-2 w-full shrink-0">
            <div className="flex items-center justify-between w-full">
              <p className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30] whitespace-nowrap">
                Document Requests
              </p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Search requests..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="h-10 w-48 rounded-sm px-3 text-[14px] text-[#0b1c30] bg-white"
                  style={{ border: "1px solid #c4c5d5" }}
                />
                <button
                  className="flex gap-2 h-10 items-center px-[17px] py-px rounded-sm shrink-0 hover:bg-black/5 transition-colors"
                  style={{ border: "1px solid #c4c5d5" }}
                >
                  <SvgIcon name="p2889b5c0" vb="0 0 18 12" w={18} h={12} fill="#444653" />
                  <span className="font-medium text-[14px] leading-6 text-[#444653] text-center whitespace-nowrap">
                    Filter
                  </span>
                </button>
              </div>
            </div>
            {selectedIds.size > 0 && (
              <div className="flex items-center gap-3 bg-[#eff4ff] px-4 py-2 rounded-sm w-full" style={{ border: "1px solid #c4c5d5" }}>
                <span className="text-[14px] font-medium text-[#0b1c30]">
                  {selectedIds.size} selected
                </span>
                <button
                  onClick={handleBatchApprove}
                  className="bg-[#002576] text-white text-[13px] font-medium px-4 py-1.5 rounded-sm hover:opacity-90 transition-opacity cursor-pointer"
                >
                  Approve All
                </button>
                <button
                  onClick={handleBatchReject}
                  className="bg-white text-[#dc2626] text-[13px] font-medium px-4 py-1.5 rounded-sm hover:bg-red-50 transition-colors cursor-pointer"
                  style={{ border: "1px solid #dc2626" }}
                >
                  Reject All
                </button>
                <button
                  onClick={() => setSelectedIds(new Set())}
                  className="text-[13px] text-[#747685] hover:text-[#0b1c30] cursor-pointer ml-auto"
                >
                  Clear Selection
                </button>
              </div>
            )}
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
                    onApprove={approve}
                    onReject={reject}
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
                    onClaim={markClaimed}
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
          <UrgenciesPanel
            missedCalls={missedCalls}
            onCallBack={handleCallBack}
          />
        </div>
      </div>

      {/* Incoming call floating toast from WebSocket signaling */}
      {incomingCall && (
        <IncomingCallToast
          callerName="Incoming Call"
          callerInfo="A resident is requesting a video call"
          onAccept={() => {
            acceptCall();
            toast.success("Call accepted", {
              description: "Video session started",
            });
          }}
          onDecline={() => {
            declineCall();
            toast("Call declined", {
              description: "Added to missed calls log",
            });
          }}
        />
      )}

      {/* Connection indicator */}
      {!connected && (
        <div className="fixed bottom-4 left-4 z-30 flex items-center gap-2 text-[12px] text-[#dc2626] font-medium">
          <div className="animate-pulse rounded-full size-2 bg-[#dc2626]" />
          Signaling disconnected — reconnecting...
        </div>
      )}
    </>
  );
}
