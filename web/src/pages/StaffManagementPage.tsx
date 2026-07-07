import { useState, useCallback } from "react";
import { toast } from "sonner";
import { useStaff } from "@/hooks/useStaff";
import type { StaffRole } from "@/types";

const ROLE_LABELS: Record<StaffRole, { label: string; color: string; bg: string }> = {
  admin: { label: "Admin", color: "#7c3aed", bg: "#ede9fe" },
  staff: { label: "Staff", color: "#1e40af", bg: "#dbeafe" },
  captain: { label: "Captain", color: "#166534", bg: "#dcfce7" },
};

interface FormState {
  fullName: string;
  email: string;
  role: StaffRole;
  position: string;
  phoneNumber: string;
}

const EMPTY_FORM: FormState = {
  fullName: "",
  email: "",
  role: "staff",
  position: "",
  phoneNumber: "",
};

export default function StaffManagementPage() {
  const {
    staff: staffList,
    loading,
    error,
    addStaff,
    editStaff,
    removeStaff,
    toggleActive,
  } = useStaff();

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setEditingId(null);
    setShowAddForm(false);
  };

  const openAddForm = () => {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setShowAddForm(true);
  };

  const openEditForm = (staff: (typeof staffList)[number]) => {
    setEditingId(staff._id);
    setForm({
      fullName: staff.fullName,
      email: staff.email,
      role: staff.role,
      position: staff.position,
      phoneNumber: staff.phoneNumber,
    });
    setShowAddForm(true);
  };

  const handleSubmit = useCallback(async () => {
    if (!form.fullName.trim() || !form.email.trim()) {
      toast.error("Please fill in name and email");
      return;
    }
    setSubmitting(true);
    try {
      if (editingId) {
        await editStaff(editingId, {
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          position: form.position,
          phoneNumber: form.phoneNumber,
        });
      } else {
        await addStaff({
          fullName: form.fullName,
          email: form.email,
          role: form.role,
          position: form.position,
          phoneNumber: form.phoneNumber,
        });
      }
      resetForm();
    } catch {
      // toast handled in hook
    } finally {
      setSubmitting(false);
    }
  }, [editingId, form, addStaff, editStaff]);

  const handleDelete = useCallback(
    async (id: string) => {
      try {
        await removeStaff(id);
      } catch {
        // toast handled in hook
      }
    },
    [removeStaff]
  );

  const availableCount = staffList.filter((s) => s.isActive).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full size-8 border-2 border-[#002576] border-t-transparent" />
          <p className="text-[#747685] text-[14px]">Loading staff...</p>
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
          <p className="text-[#0b1c30] font-semibold text-[16px]">
            Failed to load staff
          </p>
          <p className="text-[#747685] text-[14px]">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-semibold text-[24px] text-[#0b1c30]">
            Staff Management
          </h1>
          <p className="text-[14px] text-[#747685]">
            {staffList.length} total staff &middot; {availableCount} available
            for calls
          </p>
        </div>
        <button
          onClick={openAddForm}
          className="bg-[#002576] h-10 px-4 rounded-sm text-[14px] font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
        >
          + Add Staff
        </button>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <div
          className="bg-white rounded-sm p-6"
          style={{ border: "1px solid #e2e8f0" }}
        >
          <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">
            {editingId ? "Edit Staff Member" : "Add New Staff Member"}
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">
                Name
              </label>
              <input
                type="text"
                value={form.fullName}
                onChange={(e) =>
                  setForm((f) => ({ ...f, fullName: e.target.value }))
                }
                placeholder="Full name"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">
                Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm((f) => ({ ...f, email: e.target.value }))
                }
                placeholder="email@ekap.gov.ph"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">
                Role
              </label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value as StaffRole }))
                }
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30] bg-white cursor-pointer"
                style={{ border: "1px solid #c4c5d5" }}
              >
                <option value="admin">Admin</option>
                <option value="staff">Staff</option>
                <option value="captain">Captain</option>
              </select>
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">
                Position
              </label>
              <input
                type="text"
                value={form.position}
                onChange={(e) =>
                  setForm((f) => ({ ...f, position: e.target.value }))
                }
                placeholder="e.g. Secretary, Kagawad"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
            <div>
              <label className="font-medium text-[14px] text-[#444653] block mb-1">
                Phone
              </label>
              <input
                type="text"
                value={form.phoneNumber}
                onChange={(e) =>
                  setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                }
                placeholder="09xx xxx xxxx"
                className="h-10 w-full rounded-sm px-3 text-[14px] text-[#0b1c30]"
                style={{ border: "1px solid #c4c5d5" }}
              />
            </div>
          </div>
          <div className="flex gap-3 mt-4">
            <button
              onClick={resetForm}
              disabled={submitting}
              className="h-10 px-6 rounded-sm text-[14px] font-medium text-[#444653] bg-white hover:bg-[#f1f5f9] cursor-pointer transition-colors disabled:opacity-50"
              style={{ border: "1px solid #c4c5d5" }}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="h-10 px-6 rounded-sm text-[14px] font-medium text-white bg-[#002576] hover:opacity-90 cursor-pointer transition-opacity disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : editingId
                  ? "Update"
                  : "Add Staff"}
            </button>
          </div>
        </div>
      )}

      {/* Staff List */}
      {staffList.length === 0 ? (
        <div
          className="bg-white rounded-sm p-10 text-center text-[#747685] text-[14px]"
          style={{ border: "1px solid #e2e8f0" }}
        >
          No staff members yet. Click "Add Staff" to create one.
        </div>
      ) : (
        <div className="grid gap-3">
          {staffList.map((staff) => (
            <div
              key={staff._id}
              className="bg-white rounded-sm p-4 flex items-center justify-between"
              style={{ border: "1px solid #e2e8f0" }}
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#0b1c30] flex items-center justify-center">
                  <span className="text-white text-[14px] font-semibold">
                    {staff.fullName
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)
                      .toUpperCase()}
                  </span>
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-[16px] text-[#0b1c30]">
                      {staff.fullName}
                    </span>
                    <span
                      className="text-[12px] font-medium px-2 py-0.5 rounded-full"
                      style={{
                        color: ROLE_LABELS[staff.role].color,
                        backgroundColor: ROLE_LABELS[staff.role].bg,
                      }}
                    >
                      {ROLE_LABELS[staff.role].label}
                    </span>
                    {staff.position && (
                      <span className="text-[12px] text-[#747685]">
                        {staff.position}
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-[#747685]">{staff.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Availability toggle */}
                <button
                  onClick={() => toggleActive(staff._id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-[13px] font-medium cursor-pointer transition-colors ${
                    staff.isActive
                      ? "bg-[#dcfce7] text-[#166534]"
                      : "bg-[#f1f5f9] text-[#747685]"
                  }`}
                >
                  <div
                    className={`w-2 h-2 rounded-full ${
                      staff.isActive ? "bg-[#16a34a]" : "bg-[#9ca3af]"
                    }`}
                  />
                  {staff.isActive ? "Available" : "Offline"}
                </button>

                <button
                  onClick={() => openEditForm(staff)}
                  className="text-[13px] text-[#002576] font-medium hover:underline cursor-pointer"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(staff._id)}
                  className="text-[13px] text-[#dc2626] font-medium hover:underline cursor-pointer"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
