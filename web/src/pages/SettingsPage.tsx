export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6 max-w-2xl">
      <h1 className="font-semibold text-[24px] leading-[31.2px] text-[#0b1c30]">
        Settings
      </h1>

      <div className="bg-white rounded-sm p-6" style={{ border: "1px solid #e2e8f0" }}>
        <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">API Configuration</h2>
        
        <div className="flex flex-col gap-3">
          <div>
            <label className="font-medium text-[14px] text-[#444653] block mb-1">
              Backend API URL
            </label>
            <input
              type="text"
              readOnly
              value={import.meta.env.VITE_API_URL ?? "http://localhost:3000/api"}
              className="bg-[#f8f9ff] h-10 w-full rounded-sm px-3 font-normal text-[14px] text-[#0b1c30]"
              style={{ border: "1px solid #c4c5d5" }}
            />
          </div>
          <div>
            <label className="font-medium text-[14px] text-[#444653] block mb-1">
              WebSocket URL
            </label>
            <input
              type="text"
              readOnly
              value={import.meta.env.VITE_WS_URL ?? "ws://localhost:3001"}
              className="bg-[#f8f9ff] h-10 w-full rounded-sm px-3 font-normal text-[14px] text-[#0b1c30]"
              style={{ border: "1px solid #c4c5d5" }}
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-sm p-6" style={{ border: "1px solid #e2e8f0" }}>
        <h2 className="font-medium text-[18px] text-[#0b1c30] mb-4">System Info</h2>
        <div className="text-[14px] text-[#444653] space-y-1">
          <p>Version: 1.0.0</p>
          <p>Dashboard: e-Kap Admin</p>
          <p>Stack: React 19 + Vite 8 + Tailwind CSS v4</p>
        </div>
      </div>
    </div>
  );
}
