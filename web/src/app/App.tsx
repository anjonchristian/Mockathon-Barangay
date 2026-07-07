import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import RegistrationVerificationPage from "@/pages/RegistrationVerificationPage";
import ArchivesPage from "@/pages/ArchivesPage";
import EBlotterPage from "@/pages/EBlotterPage";
import EmergencyBroadcastPage from "@/pages/EmergencyBroadcastPage";
import StaffManagementPage from "@/pages/StaffManagementPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="registrations" element={<RegistrationVerificationPage />} />
            <Route path="archives" element={<ArchivesPage />} />
            <Route path="e-blotter" element={<EBlotterPage />} />
            <Route path="emergency" element={<EmergencyBroadcastPage />} />
            <Route path="staff" element={<StaffManagementPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
