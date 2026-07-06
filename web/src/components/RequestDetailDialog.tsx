import { useState } from "react";
import { type BarangayIDRequest } from "../lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { CheckCircle2, XCircle } from "lucide-react";

interface RequestDetailDialogProps {
  request: BarangayIDRequest | null;
  onClose: () => void;
  onStatusChange: (id: string, status: "approved" | "rejected", notes?: string) => void;
}

export function RequestDetailDialog({
  request,
  onClose,
  onStatusChange,
}: RequestDetailDialogProps) {
  const [staffNotes, setStaffNotes] = useState("");
  const [showRejectConfirm, setShowRejectConfirm] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  if (!request) return null;

  const handleApprove = async () => {
    setActionLoading(true);
    await onStatusChange(request._id, "approved", staffNotes);
    setActionLoading(false);
    onClose();
  };

  const handleReject = async () => {
    if (!showRejectConfirm) {
      setShowRejectConfirm(true);
      return;
    }
    setActionLoading(true);
    await onStatusChange(request._id, "rejected", staffNotes);
    setActionLoading(false);
    onClose();
  };

  return (
    <Dialog open={!!request} onOpenChange={() => { setShowRejectConfirm(false); onClose(); }}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{request.fullName}</DialogTitle>
          <DialogDescription>
            Request #{request._id.slice(-8)} &middot; Submitted{" "}
            {new Date(request.createdAt).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* ID Photo */}
          <div className="bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={`data:image/jpeg;base64,${request.idPhotoBase64}`}
              alt="ID Photo"
              className="w-full max-h-80 object-contain"
            />
          </div>

          {/* Fields */}
          <div className="space-y-3 text-sm">
            <div>
              <span className="text-gray-500">Full Name</span>
              <p className="font-medium text-base">{request.fullName}</p>
            </div>
            <div>
              <span className="text-gray-500">Address</span>
              <p className="font-medium">{request.address}</p>
            </div>
            <div>
              <span className="text-gray-500">Birth Date</span>
              <p className="font-medium">{request.birthDate}</p>
            </div>
            <div>
              <span className="text-gray-500">Gender</span>
              <p className="font-medium">{request.gender}</p>
            </div>
            <div>
              <span className="text-gray-500">Nationality</span>
              <p className="font-medium">{request.nationality}</p>
            </div>
            <div>
              <span className="text-gray-500">ID Number</span>
              <p className="font-medium">{request.idNumber}</p>
            </div>
            <div>
              <span className="text-gray-500">ID Type</span>
              <p className="font-medium capitalize">{request.idType.replace("_", " ")}</p>
            </div>
          </div>
        </div>

        {/* Staff notes */}
        <div className="mt-2">
          <label className="text-sm text-gray-500 block mb-1">Staff Notes</label>
          <Textarea
            placeholder="Add notes (optional)..."
            value={staffNotes}
            onChange={(e) => setStaffNotes(e.target.value)}
            rows={2}
          />
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {request.status === "pending_review" && (
            <>
              {showRejectConfirm ? (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowRejectConfirm(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Confirm Reject
                  </Button>
                </div>
              ) : (
                <>
                  <Button
                    variant="destructive"
                    onClick={handleReject}
                    disabled={actionLoading}
                  >
                    <XCircle className="w-4 h-4 mr-1" />
                    Reject
                  </Button>
                  <Button
                    className="bg-green-600 hover:bg-green-700"
                    onClick={handleApprove}
                    disabled={actionLoading}
                  >
                    <CheckCircle2 className="w-4 h-4 mr-1" />
                    Approve
                  </Button>
                </>
              )}
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
