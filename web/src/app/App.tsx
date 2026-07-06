import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "@/context/AppContext";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import DashboardPage from "@/pages/DashboardPage";
import ArchivesPage from "@/pages/ArchivesPage";
import SettingsPage from "@/pages/SettingsPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="archives" element={<ArchivesPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </AppProvider>
    </BrowserRouter>
  );
}
