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
  Download,
  BarChart3
} from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Progress } from "@/components/ui/progress";

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

// Mock patient data with detailed appointment information
const getPatientData = (patientId: string) => {
  const patientDetails = {
    "P001": {
      patient: "John Smith",
      patientId: "P001",
      dateOfBirth: "1985-03-15",
      phone: "(555) 123-4567",
      email: "john.smith@email.com",
      address: "123 Main St, City, State 12345",
      accountBalance: "$2,500",
      appointments: [
        {
          id: "A001",
          serviceProvider: "Texas Ortho Spine Center (Dr. Bashir)",
          treatmentDetails: "Lumbar Spine MRI with Contrast",
          appointmentDate: "2024-01-15",
          currentBalance: 2190,
          finalBalance: 1314,
          status: "Completed",
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        },
        {
          id: "A002", 
          serviceProvider: "Texas Ortho Spine Center (Dr. Bashir)",
          treatmentDetails: "Follow-up Consultation",
          appointmentDate: "2024-01-22",
          currentBalance: 300,
          finalBalance: 180,
          status: "Completed",
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        },
        {
          id: "A003",
          serviceProvider: "NuAdvance Orthopedics", 
          treatmentDetails: "Physical Therapy Sessions (10)",
          appointmentDate: "2024-01-25",
          currentBalance: 2190,
          finalBalance: 1314,
          status: "Completed",
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        },
        {
          id: "A004",
          serviceProvider: "Metro Pain Management",
          treatmentDetails: "Epidural Steroid Injection",
          appointmentDate: "2024-02-01",
          currentBalance: 850,
          finalBalance: 510,
          status: "Completed", 
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        }
      ]
    },
    "P002": {
      patient: "Sarah Wilson",
      patientId: "P002",
      dateOfBirth: "1992-07-22",
      phone: "(555) 987-6543",
      email: "sarah.wilson@email.com",
      address: "456 Oak Ave, City, State 12345",
      accountBalance: "$1,800",
      appointments: [
        {
          id: "A005",
          serviceProvider: "Regional Medical Center",
          treatmentDetails: "Knee Arthroscopy",
          appointmentDate: "2024-01-10",
          currentBalance: 3500,
          finalBalance: 2450,
          status: "In Progress",
          reductionPercentage: "30.0%",
          caseProgress: "60% Complete"
        },
        {
          id: "A006",
          serviceProvider: "Physical Therapy Associates",
          treatmentDetails: "Post-Surgery Rehabilitation",
          appointmentDate: "2024-01-20",
          currentBalance: 1200,
          finalBalance: 1080,
          status: "Scheduled",
          reductionPercentage: "10.0%",
          caseProgress: "20% Complete"
        }
      ]
    },
    "P003": {
      patient: "Mike Davis",
      patientId: "P003", 
      dateOfBirth: "1978-11-05",
      phone: "(555) 456-7890",
      email: "mike.davis@email.com",
      address: "789 Pine St, City, State 12345",
      accountBalance: "$5,200",
      appointments: [
        {
          id: "A007",
          serviceProvider: "Heart Surgery Center",
          treatmentDetails: "Cardiac Catheterization",
          appointmentDate: "2024-01-05",
          currentBalance: 8500,
          finalBalance: 5100,
          status: "Completed",
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        },
        {
          id: "A008",
          serviceProvider: "Heart Surgery Center", 
          treatmentDetails: "Post-Surgery Follow-up",
          appointmentDate: "2024-01-12",
          currentBalance: 500,
          finalBalance: 300,
          status: "Completed",
          reductionPercentage: "40.0%",
          caseProgress: "100% Complete"
        }
      ]
    }
  };

  return patientDetails[patientId as keyof typeof patientDetails] || null;
};

// Group appointments by provider
const groupAppointmentsByProvider = (appointments: any[]) => {
  const grouped: { [key: string]: any[] } = {};
  appointments.forEach(appointment => {
    if (!grouped[appointment.serviceProvider]) {
      grouped[appointment.serviceProvider] = [];
    }
    grouped[appointment.serviceProvider].push(appointment);
  });
  return grouped;
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

                {/* Account Balance Summary */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Account Balance</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-accent/20 rounded-lg">
                    <div>
                      <div className="text-sm text-muted-foreground">Current Account Balance</div>
                      <div className="font-medium text-xl text-primary">{patientData.accountBalance}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Appointments</div>
                      <div className="font-medium text-xl">{patientData.appointments.length}</div>
                    </div>
                  </div>
                </div>

                {/* Provider-wise Appointment History */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Provider-wise Appointment History & Case Status</h3>
                  <div className="border border-border bg-background">
                    {/* Excel-style header */}
                    <div className="grid grid-cols-7 border-b border-border bg-muted/30">
                      <div className="p-3 border-r border-border font-semibold text-sm">Service Provider Name</div>
                      <div className="p-3 border-r border-border font-semibold text-sm">Treatment Details</div>
                      <div className="p-3 border-r border-border font-semibold text-sm">Appointment Date</div>
                      <div className="p-3 border-r border-border font-semibold text-sm">Current Balance</div>
                      <div className="p-3 border-r border-border font-semibold text-sm">Final Balance</div>
                      <div className="p-3 border-r border-border font-semibold text-sm">Status</div>
                      <div className="p-3 font-semibold text-sm">Case Progress</div>
                    </div>
                    
                    {/* Group by provider and display */}
                    {(() => {
                      const groupedAppointments = groupAppointmentsByProvider(patientData.appointments);
                      return Object.entries(groupedAppointments).map(([provider, appointments], providerIndex) => (
                        <div key={provider}>
                          {/* Provider header row */}
                          <div className="grid grid-cols-7 bg-primary/5 border-b border-border">
                            <div className="p-3 border-r border-border font-bold text-primary col-span-7">
                              {provider} ({appointments.length} appointment{appointments.length > 1 ? 's' : ''})
                            </div>
                          </div>
                          
                          {/* Appointments for this provider */}
                          {appointments.map((appointment: any, index: number) => (
                            <div key={appointment.id} className="grid grid-cols-7 border-b border-border hover:bg-muted/20">
                              <div className="p-3 border-r border-border text-sm">
                                {appointment.serviceProvider}
                              </div>
                              <div className="p-3 border-r border-border text-sm">
                                {appointment.treatmentDetails}
                              </div>
                              <div className="p-3 border-r border-border text-sm">
                                {appointment.appointmentDate}
                              </div>
                              <div className="p-3 border-r border-border text-sm font-medium">
                                ${appointment.currentBalance.toLocaleString()}
                              </div>
                              <div className="p-3 border-r border-border text-sm">
                                <div className="font-medium text-blue-600">
                                  ${appointment.finalBalance.toLocaleString()}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {appointment.reductionPercentage} reduction
                                </div>
                              </div>
                              <div className="p-3 border-r border-border text-sm">
                                <Badge 
                                  variant={
                                    appointment.status === "Completed" ? "default" : 
                                    appointment.status === "In Progress" ? "secondary" : "outline"
                                  }
                                  className="text-xs"
                                >
                                  {appointment.status}
                                </Badge>
                              </div>
                              <div className="p-3 text-sm">
                                <div className="font-medium text-blue-600">
                                  {appointment.caseProgress}
                                </div>
                              </div>
                            </div>
                          ))}
                          
                          {/* Provider summary row */}
                          <div className="grid grid-cols-7 bg-accent/30 border-b-2 border-border">
                            <div className="p-3 border-r border-border text-sm font-semibold col-span-3">
                              {provider} - Total Summary
                            </div>
                            <div className="p-3 border-r border-border text-sm font-bold">
                              ${appointments.reduce((sum: number, app: any) => sum + app.currentBalance, 0).toLocaleString()}
                            </div>
                            <div className="p-3 border-r border-border text-sm font-bold text-blue-600">
                              ${appointments.reduce((sum: number, app: any) => sum + app.finalBalance, 0).toLocaleString()}
                            </div>
                            <div className="p-3 border-r border-border text-sm">
                              <div className="text-xs">
                                {appointments.filter((app: any) => app.status === "Completed").length} Completed, {" "}
                                {appointments.filter((app: any) => app.status === "In Progress").length} In Progress, {" "}
                                {appointments.filter((app: any) => app.status === "Scheduled").length} Scheduled
                              </div>
                            </div>
                            <div className="p-3 text-sm">
                              <div className="text-xs font-medium">
                                Overall Progress
                              </div>
                            </div>
                          </div>
                        </div>
                      ));
                    })()}
                    
                    {/* Grand Total Row */}
                    <div className="grid grid-cols-7 bg-primary/10 border-t-2 border-primary">
                      <div className="p-4 border-r border-border font-bold text-primary col-span-3">
                        GRAND TOTAL - All Providers
                      </div>
                      <div className="p-4 border-r border-border font-bold text-lg">
                        ${patientData.appointments.reduce((sum: number, app: any) => sum + app.currentBalance, 0).toLocaleString()}
                      </div>
                      <div className="p-4 border-r border-border font-bold text-lg text-blue-600">
                        ${patientData.appointments.reduce((sum: number, app: any) => sum + app.finalBalance, 0).toLocaleString()}
                      </div>
                      <div className="p-4 border-r border-border">
                        <div className="text-sm font-medium">
                          Total: {patientData.appointments.length} appointments
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="text-sm font-medium">
                          Account Balance: {patientData.accountBalance}
                        </div>
                      </div>
                    </div>
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