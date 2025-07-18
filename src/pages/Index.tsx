import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { PatientList } from "@/components/PatientList";
import { PatientDetailedInfo } from "@/components/PatientDetailedInfo";
import { BalanceReductionManagement } from "@/components/BalanceReductionManagement";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedPatientId, setSelectedPatientId] = useState<string>("");
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string>("");

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string, id?: string) => {
    setCurrentPage(page);
    if (page === "patient-details" && id) {
      setSelectedPatientId(id);
    } else if (page === "balance-reduction" && id) {
      setSelectedAppointmentId(id);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Main application routing
  switch (currentPage) {
    case "patients":
      return <PatientList onNavigate={handleNavigate} />;
    case "patient-details":
      return <PatientDetailedInfo onNavigate={handleNavigate} patientId={selectedPatientId} />;
    case "balance-reduction":
      return <BalanceReductionManagement onNavigate={handleNavigate} appointmentId={selectedAppointmentId} />;
    case "import":
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">CSV Import</h1>
            <p className="text-muted-foreground">Import functionality coming soon...</p>
          </div>
        </div>
      );
    case "providers":
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Provider Follow-up</h1>
            <p className="text-muted-foreground">Provider management coming soon...</p>
          </div>
        </div>
      );
    default:
      return <Dashboard onNavigate={handleNavigate} />;
  }
};

export default Index;
