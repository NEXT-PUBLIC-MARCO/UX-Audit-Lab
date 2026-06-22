import { Routes, Route, Navigate } from "react-router-dom";
import { AppShell } from "@/components/shell/AppShell";
import { Dashboard } from "@/pages/Dashboard";
import { NewAudit } from "@/pages/NewAudit";
import { Analyzing } from "@/pages/Analyzing";
import { Report } from "@/pages/Report";

export function App() {
  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/new" element={<NewAudit />} />
        <Route path="/analyzing" element={<Analyzing />} />
        <Route path="/audit/:id" element={<Report />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AppShell>
  );
}
