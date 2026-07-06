import { useState, useCallback } from "react";
import { toast } from "sonner";

type StaffRole = "admin" | "staff" | "secretary";

interface StaffMember {
  id: string;
  name: string;
  email: string;
  role: StaffRole;
  isAvailable: boolean;
  lastActive: string;
}

const ROLE_LABELS: Record<StaffRole, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "#7c3aed", bg: "#ede9fe" },
  staff: { label: "Staff", color: "#1e40af", bg: "#dbeafe" },
  secretary: { label: "Secretary", color: "#166534", bg: "#dcfce7" },
};

const MOCK_STAFF: StaffMember[] = [
  { id: "s1", name: "Admin User", email: "admin@ekap.gov.ph", role: "admin", isAvailable: true, lastActive: new Date().toISOString() },
  { id: "s2", name: "Maria Santos", email: "maria@ekap.gov.ph", role: "staff", isAvailable: true, lastActive: new Date(Date.now() - 300000).toISOString() },
  { id: "s3", name: "Pedro Cruz", email: "pedro@ekap.gov.ph", role: "staff", isAvailable: false, lastActive: new Date(Date.now() - 3600000).toISOString() },
  { id: "s4", name: "Ana Reyes", email: "ana@ekap.gov.ph", role: "secretary", isAvailable: true, lastActive: new Date(Date.now() - 600000).toISOString() },
];

export default function StaffManagementPage() {
  const [staffList, setStaffList] = useState<StaffMember[]>(MOCK_STAFF);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formName, setFormName] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formRole, setFormRole] = useState<StaffRole>("staff");

  const handleAdd = useCallback(() => {
    if (!formName.trim() || !formEmail.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    const newStaff: StaffMember = {
      id: `s-${Date.now()}`,
      name: formName,
      email: formEmail,
      role: formRole,
      isAvailable: false,
      lastActive: new Date().toISOString(),
    };

    setStaffList((prev) => [...prev, newStaff]);
    setFormName("");
    setFormEmail("");
    setFormRole("staff");
    setShowAddForm(false);
    toast.success("Staff member added");
  }, [formName, formEmail, formRole]);

  const handleEdit = useCallback((staff: StaffMember) => {
    setEditingId(staff.id);
    setFormName(staff.name);
    setFormEmail(staff.email);
    setFormRole(staff.role);
    setShowAddForm(true);
  }, []);

  const handleUpdate = useCallback(() => {
    if (!editingId || !formName.trim() || !formEmail.trim()) return;

    setStaffList((prev) =>
      prev.map((s) =>
        s.id === editingId ? { ...s, name: formName, email: formEmail, role: formRole } : s
      )
    );
    setEditingId(null);
    setFormName("");
    setFormEmail("");
    setFormRole("staff");
    setShowAddForm(false);
    toast.success("Staff member updated");
  }, [editingId, formName, formEmail, formRole]);

  const handleDelete = useCallback((id: string) => {
    setStaffList((prev) => prev.filter((s) => s.id !== id));
    toast.success("Staff member removed");
  }, []);

  const handleToggleAvailability = useCallback((id: string) => {
    setStaffList((prev) =>
      prev.map((s) => (s.id === id ? { ...s, isAvailable: !s.isAvailable } : s))
    );
  }, []);

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingId(null);
    setFormName("");
    setFormEmail("");
    setFormRole("staff");
  };

  const availableCount = staffList.filter((s) => s.isAvailable).length;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[24px] text-[#0b1c30]">Staff Management</h1>
          <p className="text-[14px] text-[#747685]">
            {staffList.length} total staff &middot; {availableCount} available for calls
          </p>
        </div>
        <button
          onClick={() => {
            setEditingId(null);
            setFormName("");
            setFormEmail("");
            setFormRole("staff");
            setShowAddForm(true);
          }}
          className="bg-[#002576] h-10 px-4 rounded-sm text-[14px] font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          + Add Staff
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div className="bg-white rounded-sm p-6" style={{ border: "1px solid #e2e8f0" }}>
          <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">
            {editingId ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">Name</label>
              <input
                type="text"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="Full name"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">Email</label>
              <input
                type="email"
                value={formEmail}
                onChange={(e) => setFormEmail(e.target.value)}
                placeholder="email@ekap.gov.ph"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">Role</label>
              <select
                value={formRole}
                onChange={(e) => setFormRole(e.target.value as StaffRole)}
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30] bg-white cursor-pointer"
                style={{ border: "1px solid #c4c5d5" }}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="secretary">Secretary</option>
              </select>
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={handleCancel}
              className="h-10 px-6 rounded-sm text-[14px] font-medium text-[#444653] bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors"
              style={{ border: "1px solid #c4c5d5" }}
            >
              Cancel
            </button>
            <button
              onClick={editingId ? handleUpdate : handleAdd}
              className="h-10 px-6 rounded-sm text-[14px] font-medium text-white bg-[#002576] hover:opacity-90 cursor-pointer transition-opacity"
            >
              {editingId ? "Update" : "Add Staff"}
            </button>
          </div>
        </div>
      )}

      {/* Staff List */}
      <div className="grid gap-3">
        {staffList.map((staff) => (
          <div
            key={staff.id}
            className="bg-white rounded-sm p-4 flex items-center justify-between"
            style={{ border: "1px solid #e2e8f0" }}
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-[#0b1c30] flex items-center justify-center">
                <span className="text-white text-[14px] font-semibold">
                  {staff.name.split(" ").map((n) => n[0]).join("")}
                </span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[16px] text-[#0b1c30]">{staff.name}</span>
                  <span
                    className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                    style={{
                      color: ROLE_LABELS[staff.role].color,
                      backgroundColor: ROLE_LABELS[staff.role].bg,
                    }}
                  >
                    {ROLE_LABELS[staff.role].label}
                  </span>
                </div>
                <p className="text-[13px] text-[#747685]">{staff.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {/* Availability toggle */}
              <button
                onClick={() => handleToggleAvailability(staff.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-colors ${
                  staff.isAvailable
                    ? "bg-[#dcfce7] text-[#166534]"
                    : "bg-[#f1f5f9] text-[#747685]"
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    staff.isAvailable ? "bg-[#16a34a]" : "bg-[#9ca3af]"
                  }`}
                />
                {staff.isAvailable ? "Available" : "Offline"}
              </button>

              <button
                onClick={() => handleEdit(staff)}
                className="text-[13px] text-[#002576] font-medium hover:underline cursor-pointer"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(staff.id)}
                className="text-[13px] text-[#dc2626] font-medium hover:underline cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
