import { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  ArrowLeft,
  Users,
  Download
} from "lucide-react";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

// Mock patient list for dropdown
const patientList = [
  { id: "P001", name: "John Smith" },
  { id: "P002", name: "Sarah Wilson" },
  { id: "P003", name: "Mike Davis" },
  { id: "P004", name: "Emma Johnson" },
  { id: "P005", name: "David Brown" }
];

// Mock patient data
const getPatientData = (patientId: string) => {
  const patientDetails = {
    "P001": {
      patient: "John Smith",
      patientId: "P001",
      dateOfBirth: "1985-03-15",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      address: "123 Main St, City, State 12345",
      services: [
        { service: "Consultation", date: "2024-01-10", provider: "Dr. Johnson", amount: "$200", status: "Completed" },
        { service: "X-Ray", date: "2024-01-10", provider: "Dr. Johnson", amount: "$150", status: "Completed" },
        { service: "Follow-up", date: "2024-01-20", provider: "Dr. Johnson", amount: "$100", status: "Scheduled" }
      ],
      totalAmount: "$450"
    },
    "P002": {
      patient: "Sarah Wilson",
      patientId: "P002",
      dateOfBirth: "1992-07-22",
      phone: "(555) 987-6543",
      email: "sarah.wilson@email.com",
      address: "456 Oak Ave, City, State 12345",
      services: [
        { service: "Physical Therapy", date: "2024-01-08", provider: "Dr. Martinez", amount: "$120", status: "Completed" },
        { service: "MRI Scan", date: "2024-01-12", provider: "Dr. Martinez", amount: "$800", status: "Completed" }
      ],
      totalAmount: "$920"
    },
    "P003": {
      patient: "Mike Davis",
      patientId: "P003",
      dateOfBirth: "1978-11-05",
      phone: "(555) 456-7890",
      email: "mike.davis@email.com",
      address: "789 Pine St, City, State 12345",
      services: [
        { service: "Surgery", date: "2024-01-05", provider: "Dr. Thompson", amount: "$2,500", status: "Completed" },
        { service: "Post-op Care", date: "2024-01-15", provider: "Dr. Thompson", amount: "$300", status: "In Progress" }
      ],
      totalAmount: "$2,800"
    }
  };

  return patientDetails[patientId as keyof typeof patientDetails] || null;
};

export const Reports = ({ onNavigate }: ReportsProps) => {
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [generatingReport, setGeneratingReport] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const [patientData, setPatientData] = useState<any>(null);

  const handleGenerateReport = () => {
    if (!selectedPatient) return;
    
    const data = getPatientData(selectedPatient);
    if (data) {
      setPatientData(data);
      setShowReport(true);
    }
  };

  const handleExportPDF = async () => {
    setGeneratingReport(true);
    // Simulate PDF generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(false);
    
    // In real implementation, this would trigger actual PDF download
    console.log(`Generating PDF report for patient ${selectedPatient}`);
  };

  return (
    <Layout title="Patient Reports" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("dashboard")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-foreground">Patient Reports</h1>
            <p className="text-sm text-muted-foreground">
              Generate comprehensive patient reports with all service details
            </p>
          </div>
        </div>

        {/* Report Generation Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Generate Patient Report
            </CardTitle>
            <CardDescription>
              Select a patient to generate their complete report with all services and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="patient-select">Patient Name</Label>
                <Select value={selectedPatient} onValueChange={setSelectedPatient}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patientList.map((patient) => (
                      <SelectItem key={patient.id} value={patient.id}>
                        {patient.name} (ID: {patient.id})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleGenerateReport}
                disabled={!selectedPatient}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Generated Report */}
        {showReport && patientData && (
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    Patient Report: {patientData.patient}
                  </CardTitle>
                  <CardDescription>
                    Complete patient details and service history
                  </CardDescription>
                </div>
                <Button 
                  onClick={handleExportPDF}
                  disabled={generatingReport}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  {generatingReport ? "Generating PDF..." : "Export PDF"}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Patient Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Patient Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/20 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Patient ID</div>
                      <div className="font-medium">{patientData.patientId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Full Name</div>
                      <div className="font-medium">{patientData.patient}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Date of Birth</div>
                      <div className="font-medium">{patientData.dateOfBirth}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Phone</div>
                      <div className="font-medium">{patientData.phone}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Email</div>
                      <div className="font-medium">{patientData.email}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Address</div>
                      <div className="font-medium">{patientData.address}</div>
                    </div>
                  </div>
                </div>

                {/* Service Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-primary/10 rounded-lg p-3">
                      <div className="text-2xl font-bold text-primary">{patientData.services.length}</div>
                      <div className="text-xs text-muted-foreground">Total Services</div>
                    </div>
                    <div className="bg-green-100 rounded-lg p-3">
                      <div className="text-2xl font-bold text-green-600">
                        {patientData.services.filter((s: any) => s.status === "Completed").length}
                      </div>
                      <div className="text-xs text-muted-foreground">Completed</div>
                    </div>
                    <div className="bg-blue-100 rounded-lg p-3">
                      <div className="text-2xl font-bold text-blue-600">{patientData.totalAmount}</div>
                      <div className="text-xs text-muted-foreground">Total Amount</div>
                    </div>
                  </div>
                </div>

                {/* Service Details */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Details</h3>
                  <div className="space-y-3">
                    {patientData.services.map((service: any, index: number) => (
                      <div key={index} className="p-4 bg-background rounded-lg border border-border">
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-foreground">{service.service}</div>
                            <div className="text-sm text-muted-foreground mt-1">
                              Date: {service.date} • Provider: {service.provider}
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge 
                              variant={
                                service.status === "Completed" ? "default" : 
                                service.status === "In Progress" ? "secondary" : "outline"
                              }
                            >
                              {service.status}
                            </Badge>
                            <div className="font-medium text-primary">{service.amount}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions when no report is generated */}
        {!showReport && (
          <Card>
            <CardContent className="text-center py-12">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium text-foreground mb-2">No Report Generated</h3>
              <p className="text-muted-foreground">
                Select a patient from the dropdown above and click "Generate Report" to view their complete details.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};