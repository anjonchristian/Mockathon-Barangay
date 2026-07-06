import { useState, useEffect } from "react";
import { listRequests, type BarangayIDRequest, extractErrorMessage } from "@/lib/api";
import { timeAgo } from "@/types";

export default function ArchivesPage() {
  const [approved, setApproved] = useState<BarangayIDRequest[]>([]);
  const [rejected, setRejected] = useState<BarangayIDRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchArchives() {
      try {
        const [approvedRes, rejectedRes] = await Promise.all([
          listRequests({ status: "approved", limit: 50 }),
          listRequests({ status: "rejected", limit: 50 }),
        ]);
        setApproved(approvedRes.data);
        setRejected(rejectedRes.data);
        setError(null);
      } catch (err) {
        setError(extractErrorMessage(err));
      } finally {
        setLoading(false);
      }
    }
    fetchArchives();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full size-8 border-2 border-[#002576] border-t-transparent" />
          <p className="text-[#747685] text-[14px]">Loading archives...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-[#dc2626]">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30]">
        Archives
      </h1>

      {/* Approved Section */}
      <section>
        <h2 className="font-medium text-[18px] text-[#16a34a] mb-3">
          Approved ({approved.length})
        </h2>
        {approved.length === 0 ? (
          <p className="text-[#747685] text-[14px]">No approved requests yet</p>
        ) : (
          <div className="grid gap-3">
            {approved.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-sm p-4 flex items-center justify-between"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div>
                  <p className="font-semibold text-[16px] text-[#0b1c30]">{req.fullName}</p>
                  <p className="text-[14px] text-[#444653]">{req.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-[14px] text-[#747685]">{timeAgo(req.createdAt)}</p>
                  <span className="text-[13px] text-[#16a34a] font-medium">Approved</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Rejected Section */}
      <section>
        <h2 className="font-medium text-[18px] text-[#dc2626] mb-3">
          Rejected ({rejected.length})
        </h2>
        {rejected.length === 0 ? (
          <p className="text-[#747685] text-[14px]">No rejected requests</p>
        ) : (
          <div className="grid gap-3">
            {rejected.map((req) => (
              <div
                key={req._id}
                className="bg-white rounded-sm p-4 flex items-center justify-between"
                style={{ border: "1px solid #e2e8f0" }}
              >
                <div>
                  <p className="font-semibold text-[16px] text-[#0b1c30]">{req.fullName}</p>
                  <p className="text-[14px] text-[#444653]">{req.address}</p>
                  {req.staffNotes && (
                    <p className="text-[13px] text-[#747685] mt-1 italic">
                      Note: {req.staffNotes}
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-[14px] text-[#747685]">{timeAgo(req.createdAt)}</p>
                  <span className="text-[13px] text-[#dc2626] font-medium">Rejected</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
