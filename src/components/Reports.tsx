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
          currentBalance: 2190,
          status: "Completed",
          caseProgress: {
            currentStep: 5,
            stepCompletionStatus: { 1: true, 2: true, 3: true, 4: true, 5: true },
            totalBillValue: 2190
          }
        },
        {
          id: "A002",
          serviceProvider: "NuAdvance Orthopedics",
          treatmentDetails: "Physical Therapy Sessions (10)",
          currentBalance: 2190,
          status: "Completed",
          caseProgress: {
            currentStep: 5,
            stepCompletionStatus: { 1: true, 2: true, 3: true, 4: true, 5: true },
            totalBillValue: 2190
          }
        },
        {
          id: "A003",
          serviceProvider: "Metro Pain Management",
          treatmentDetails: "Epidural Steroid Injection",
          currentBalance: 850,
          status: "Completed",
          caseProgress: {
            currentStep: 5,
            stepCompletionStatus: { 1: true, 2: true, 3: true, 4: true, 5: true },
            totalBillValue: 850
          }
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
          id: "A004",
          serviceProvider: "Regional Medical Center",
          treatmentDetails: "Knee Arthroscopy",
          currentBalance: 3500,
          status: "In Progress",
          caseProgress: {
            currentStep: 3,
            stepCompletionStatus: { 1: true, 2: true, 3: true, 4: false, 5: false },
            totalBillValue: 3500
          }
        },
        {
          id: "A005",
          serviceProvider: "Physical Therapy Associates",
          treatmentDetails: "Post-Surgery Rehabilitation",
          currentBalance: 1200,
          status: "Scheduled",
          caseProgress: {
            currentStep: 1,
            stepCompletionStatus: { 1: false, 2: false, 3: false, 4: false, 5: false },
            totalBillValue: 1200
          }
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
          id: "A006",
          serviceProvider: "Heart Surgery Center",
          treatmentDetails: "Cardiac Catheterization",
          currentBalance: 8500,
          status: "Completed",
          caseProgress: {
            currentStep: 5,
            stepCompletionStatus: { 1: true, 2: true, 3: true, 4: true, 5: true },
            totalBillValue: 8500
          }
        }
      ]
    }
  };

  return patientDetails[patientId as keyof typeof patientDetails] || null;
};

// Helper functions for calculations
const getProgressPercentage = (progress: any) => {
  const completedSteps = Object.values(progress.stepCompletionStatus).filter(Boolean).length;
  const totalSteps = Object.keys(progress.stepCompletionStatus).length;
  return Math.round((completedSteps / totalSteps) * 100);
};

const calculateFinalBalance = (originalBalance: number, progress: any) => {
  const percentage = getProgressPercentage(progress);
  const reductionRate = percentage === 100 ? 0.4 : percentage >= 60 ? 0.3 : percentage >= 40 ? 0.2 : 0.1;
  return originalBalance * (1 - reductionRate);
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

                {/* Detailed Service Information */}
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-3">Service Details</h3>
                  <div className="border rounded-lg overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/50">
                          <TableHead className="font-semibold">Service Provider Name</TableHead>
                          <TableHead className="font-semibold">Treatment Details</TableHead>
                          <TableHead className="font-semibold">Current Balance</TableHead>
                          <TableHead className="font-semibold">Final Balance</TableHead>
                          <TableHead className="font-semibold">Status</TableHead>
                          <TableHead className="font-semibold">Case Progress</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {patientData.appointments.map((appointment: any, index: number) => {
                          const progressPercentage = getProgressPercentage(appointment.caseProgress);
                          const finalBalance = calculateFinalBalance(appointment.currentBalance, appointment.caseProgress);
                          const reductionRate = progressPercentage === 100 ? 40 : progressPercentage >= 60 ? 30 : progressPercentage >= 40 ? 20 : 10;
                          
                          return (
                            <TableRow key={appointment.id} className="border-b">
                              <TableCell className="font-medium">
                                {appointment.serviceProvider}
                              </TableCell>
                              <TableCell>
                                {appointment.treatmentDetails}
                              </TableCell>
                              <TableCell className="font-medium">
                                ${appointment.currentBalance.toLocaleString()}
                              </TableCell>
                              <TableCell>
                                <div className="space-y-1">
                                  <div className="font-medium text-blue-600">
                                    ${finalBalance.toLocaleString()}
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    {reductionRate}% reduction
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge 
                                  variant={
                                    appointment.status === "Completed" ? "default" : 
                                    appointment.status === "In Progress" ? "secondary" : "outline"
                                  }
                                >
                                  {appointment.status}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <BarChart3 className="h-4 w-4 text-blue-600" />
                                    <span className="text-sm font-medium">
                                      {appointment.status}
                                    </span>
                                  </div>
                                  <div className="space-y-1">
                                    <Progress 
                                      value={progressPercentage} 
                                      className="h-2 bg-muted"
                                    />
                                    <div className="text-xs text-muted-foreground">
                                      {progressPercentage}% Complete
                                    </div>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
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