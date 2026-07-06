import { useState } from "react";
import { type BarangayIDRequest } from "../lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { CheckCircle2, XCircle, Clock } from "lucide-react";
import { RequestDetailDialog } from "./RequestDetailDialog";

interface KanbanColumnProps {
  title: string;
  status: "pending_review" | "approved" | "rejected";
  requests: BarangayIDRequest[];
  onStatusChange: (id: string, status: "approved" | "rejected", notes?: string) => void;
}

const statusColors: Record<string, string> = {
  pending_review: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

const statusIcons: Record<string, React.ReactNode> = {
  pending_review: <Clock className="w-4 h-4" />,
  approved: <CheckCircle2 className="w-4 h-4" />,
  rejected: <XCircle className="w-4 h-4" />,
};

export function KanbanColumn({ title, status, requests, onStatusChange }: KanbanColumnProps) {
  const [selectedRequest, setSelectedRequest] = useState<BarangayIDRequest | null>(null);

  return (
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-4">
        {statusIcons[status]}
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <Badge variant="secondary" className="ml-auto">
          {requests.length}
        </Badge>
      </div>

      <div className="space-y-3">
        {requests.length === 0 ? (
          <p className="text-sm text-gray-500 text-center py-8">No requests</p>
        ) : (
          requests.map((req) => (
            <Card
              key={req._id}
              className="shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedRequest(req)}
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{req.fullName}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-xs text-gray-500 space-y-1 mb-3">
                  <p>ID: {req.idNumber}</p>
                  <p>Type: {req.idType}</p>
                  <p className="truncate">{req.address}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={statusColors[req.status]}>
                    {req.status.replace("_", " ")}
                  </Badge>
                  <span className="text-xs text-gray-400 ml-auto">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <RequestDetailDialog
        request={selectedRequest}
        onClose={() => setSelectedRequest(null)}
        onStatusChange={onStatusChange}
      />
    </div>
  );
}
