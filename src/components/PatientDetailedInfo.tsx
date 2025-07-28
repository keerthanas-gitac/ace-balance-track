import { useState, useEffect } from "react";
import { ArrowLeft, Upload, FileText, Edit, Eye, Trash2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Layout } from "@/components/Layout";

interface PatientDetailedInfoProps {
  onNavigate: (page: string, appointmentId?: string) => void;
  patientId: string;
}

interface CaseProgress {
  currentStep: number;
  stepCompletionStatus: { [key: number]: boolean };
  totalBillValue: number;
}

interface Appointment {
  id: string;
  serviceProvider: string;
  treatmentDetails: string;
  currentBalance: number;
  status: string;
  caseProgress: CaseProgress;
}

export const PatientDetailedInfo = ({ onNavigate, patientId }: PatientDetailedInfoProps) => {
  // Mock patient data - in real app this would come from props or API
  const patient = {
    name: "John Doe",
    dob: "1985-03-15",
    registrationDate: "2024-01-10",
    gender: "Male",
    caseNumber: "ACE-2024-001"
  };

  // Mock appointments data with progress tracking
  const [appointments, setAppointments] = useState([
    {
      id: "1",
      serviceProvider: "Texas Ortho Spine Center (Dr. Bashir)",
      treatmentDetails: "Lumbar Spine MRI with Contrast",
      currentBalance: 2450.00,
      status: "Active",
      caseProgress: {
        currentStep: 1,
        stepCompletionStatus: { 1: false, 2: false, 3: false, 4: false },
        totalBillValue: 2450.00
      }
    },
    {
      id: "2", 
      serviceProvider: "NuAdvance Orthopedics",
      treatmentDetails: "Physical Therapy Sessions (10)",
      currentBalance: 1200.00,
      status: "Pending",
      caseProgress: {
        currentStep: 1,
        stepCompletionStatus: { 1: false, 2: false, 3: false, 4: false },
        totalBillValue: 1200.00
      }
    },
    {
      id: "3",
      serviceProvider: "Metro Pain Management",
      treatmentDetails: "Epidural Steroid Injection",
      currentBalance: 850.00,
      status: "Completed",
      caseProgress: {
        currentStep: 5,
        stepCompletionStatus: { 1: true, 2: true, 3: true, 4: true },
        totalBillValue: 850.00
      }
    }
  ]);

  // Load appointment progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('appointmentProgress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      setAppointments(prev => 
        prev.map(appointment => ({
          ...appointment,
          caseProgress: progressData[appointment.id]?.caseProgress || appointment.caseProgress,
          currentBalance: progressData[appointment.id]?.currentBalance || appointment.currentBalance,
          status: progressData[appointment.id]?.status || appointment.status
        }))
      );
    }
  }, []);

  // Function to calculate progress percentage
  const getProgressPercentage = (progress: CaseProgress) => {
    const completedSteps = Object.values(progress.stepCompletionStatus).filter(Boolean).length;
    return Math.round((completedSteps / 4) * 100);
  };

  // Function to get progress status text
  const getProgressStatus = (progress: CaseProgress) => {
    const completedSteps = Object.values(progress.stepCompletionStatus).filter(Boolean).length;
    if (completedSteps === 0) return "Not Started";
    if (completedSteps === 4) return "Completed";
    return `${completedSteps}/4 Steps Complete`;
  };

  // Function to calculate final balance after reductions
  const calculateFinalBalance = (originalBalance: number, progress: CaseProgress) => {
    const completedSteps = Object.values(progress.stepCompletionStatus).filter(Boolean).length;
    // Reduce by 10% per completed step
    return originalBalance * (1 - (completedSteps * 0.1));
  };

  const [uploadedFiles, setUploadedFiles] = useState<string[]>([
    "medical_records_2024.pdf",
    "insurance_claim_form.pdf"
  ]);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const newFiles = files.map(file => file.name);
    setUploadedFiles(prev => [...prev, ...newFiles]);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-medical-success text-medical-success-foreground";
      case "Pending": return "bg-medical-warning text-medical-warning-foreground";
      case "Completed": return "bg-medical-info text-medical-info-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <Layout title="Patient Details" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("patients")}
            className="text-medical-primary hover:text-medical-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patients
          </Button>
          <h1 className="text-3xl font-bold text-medical-dark">Patient's Detailed Info</h1>
        </div>

        {/* Patient Information Card */}
        <Card className="border-medical-border bg-gradient-to-r from-medical-card to-medical-card/80">
          <CardHeader>
            <CardTitle className="text-medical-dark flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Patient Case Details
            </CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Patient Details */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-medical-muted">Patient Name</label>
                <p className="text-lg font-semibold text-medical-dark">{patient.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-medical-muted">Date of Birth</label>
                <p className="text-medical-dark">{new Date(patient.dob).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-medical-muted">Gender</label>
                <p className="text-medical-dark">{patient.gender}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-medical-muted">Date of Registration</label>
                <p className="text-medical-dark">{new Date(patient.registrationDate).toLocaleDateString()}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-medical-muted">Case Number</label>
                <p className="text-lg font-mono text-medical-primary">{patient.caseNumber}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-medical-muted">Total Account Balance</label>
                <div className="space-y-2">
                  <div className="text-xl font-bold text-medical-dark">
                    ${appointments.reduce((total, appointment) => total + appointment.currentBalance, 0).toLocaleString()}
                  </div>
                  <div className="text-lg font-semibold text-medical-primary">
                    Final: ${appointments.reduce((total, appointment) => 
                      total + calculateFinalBalance(appointment.currentBalance, appointment.caseProgress), 0
                    ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                  <div className="text-sm text-medical-muted">
                    Total Savings: ${(
                      appointments.reduce((total, appointment) => total + appointment.currentBalance, 0) -
                      appointments.reduce((total, appointment) => 
                        total + calculateFinalBalance(appointment.currentBalance, appointment.caseProgress), 0
                      )
                    ).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </div>
                </div>
              </div>
            </div>

            {/* Document Upload Section */}
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-medical-muted">Import Case Date</label>
                <div className="mt-2 p-4 border-2 border-dashed border-medical-border rounded-lg bg-medical-background/50">
                  <div className="text-center">
                    <Upload className="h-8 w-8 text-medical-muted mx-auto mb-2" />
                    <input
                      type="file"
                      multiple
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx,.jpg,.png"
                    />
                    <label
                      htmlFor="file-upload"
                      className="cursor-pointer text-sm text-medical-primary hover:text-medical-primary/80"
                    >
                      Upload Documents
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Table */}
        <Card>
          <CardHeader>
            <CardTitle className="text-medical-dark">Appointment History</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-medical-dark font-semibold">Service Provider Name</TableHead>
                  <TableHead className="text-medical-dark font-semibold">Treatment Details</TableHead>
                  <TableHead className="text-medical-dark font-semibold">Current Balance</TableHead>
                  <TableHead className="text-medical-dark font-semibold">Final Balance</TableHead>
                  <TableHead className="text-medical-dark font-semibold">Status</TableHead>
                  <TableHead className="text-medical-dark font-semibold">Case Progress</TableHead>
                  <TableHead className="text-medical-dark font-semibold text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow key={appointment.id} className="hover:bg-medical-background/50">
                    <TableCell className="font-medium text-medical-dark">
                      {appointment.serviceProvider}
                    </TableCell>
                    <TableCell className="text-medical-muted">
                      {appointment.treatmentDetails}
                    </TableCell>
                    <TableCell className="font-semibold text-medical-dark">
                      ${appointment.currentBalance.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <div className="font-semibold text-medical-primary">
                        ${calculateFinalBalance(appointment.currentBalance, appointment.caseProgress).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                      </div>
                      {Object.values(appointment.caseProgress.stepCompletionStatus).filter(Boolean).length > 0 && (
                        <div className="text-xs text-medical-muted mt-1">
                          {(((appointment.currentBalance - calculateFinalBalance(appointment.currentBalance, appointment.caseProgress)) / appointment.currentBalance) * 100).toFixed(1)}% reduction
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(appointment.status)}>
                        {appointment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2 min-w-[200px]">
                        <div className="flex items-center gap-2">
                          <BarChart3 className="h-4 w-4 text-medical-primary" />
                          <span className="text-sm font-medium text-medical-dark">
                            {getProgressStatus(appointment.caseProgress)}
                          </span>
                        </div>
                        <Progress 
                          value={getProgressPercentage(appointment.caseProgress)} 
                          className="h-2" 
                        />
                        <div className="text-xs text-medical-muted">
                          {getProgressPercentage(appointment.caseProgress)}% Complete
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onNavigate("balance-reduction", appointment.id)}
                          className="h-8 w-8 p-0 text-medical-primary hover:text-medical-primary/80"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-medical-info hover:text-medical-info/80"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-medical-danger hover:text-medical-danger/80"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {appointments.length === 0 && (
              <div className="text-center py-8 text-medical-muted">
                No appointments found for this patient.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};