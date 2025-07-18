import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { PatientList } from "@/components/PatientList";
import { PatientDetailedInfo } from "@/components/PatientDetailedInfo";
import { BalanceReductionManagement } from "@/components/BalanceReductionManagement";
import { Reports } from "@/components/Reports";
import { CSVUpload } from "@/components/CSVUpload";

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
      return <CSVUpload onNavigate={handleNavigate} />;
    case "reports":
      return <Reports onNavigate={handleNavigate} />;
    default:
      return <Dashboard onNavigate={handleNavigate} />;
  }
};

export default Index;
