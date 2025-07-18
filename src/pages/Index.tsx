import { useState } from "react";
import { LoginForm } from "@/components/LoginForm";
import { Dashboard } from "@/components/Dashboard";
import { PatientList } from "@/components/PatientList";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage("dashboard");
  };

  const handleNavigate = (page: string, patientId?: string) => {
    setCurrentPage(page);
    if (patientId) {
      // Store patient ID for detailed view
      console.log("Navigate to patient:", patientId);
    }
  };

  if (!isAuthenticated) {
    return <LoginForm onLogin={handleLogin} />;
  }

  // Main application routing
  switch (currentPage) {
    case "patients":
      return <PatientList onNavigate={handleNavigate} />;
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
