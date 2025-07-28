import { useState, useEffect } from "react";
import { ArrowLeft, Plus, ChevronDown, ChevronUp, CheckCircle, Clock, FileText, DollarSign, Calendar, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Layout } from "@/components/Layout";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

interface BalanceReductionManagementProps {
  onNavigate: (page: string, appointmentId?: string) => void;
  appointmentId: string;
}

interface CaseProgress {
  currentStep: number;
  stepCompletionStatus: { [key: number]: boolean };
  totalBillValue: number;
}

export const BalanceReductionManagement = ({ onNavigate, appointmentId }: BalanceReductionManagementProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [reductionAmount, setReductionAmount] = useState(0);
  const [stepCompletionStatus, setStepCompletionStatus] = useState({
    1: false,
    2: false,
    3: false,
    4: false
  });

  // Load progress from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem('appointmentProgress');
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress);
      const appointmentData = progressData[appointmentId];
      if (appointmentData?.caseProgress) {
        setCurrentStep(appointmentData.caseProgress.currentStep);
        setStepCompletionStatus(appointmentData.caseProgress.stepCompletionStatus);
      }
    }
  }, [appointmentId]);

  // Save progress to localStorage whenever state changes
  const saveProgressToLocalStorage = (progress: CaseProgress, updatedBalance?: number, newStatus?: string) => {
    const savedProgress = localStorage.getItem('appointmentProgress');
    const progressData = savedProgress ? JSON.parse(savedProgress) : {};
    
    progressData[appointmentId] = {
      caseProgress: progress,
      currentBalance: updatedBalance,
      status: newStatus
    };
    
    localStorage.setItem('appointmentProgress', JSON.stringify(progressData));
  };

  const [appointmentHistory, setAppointmentHistory] = useState([
    {
      id: "1",
      dateOfEntry: "2024-01-15",
      dateRangeStart: "2024-01-15",
      dateRangeEnd: "2024-02-15",
      status: "Completed",
      notes: "Initial consultation - Active case",
      typeOfRequest: "Billing Update",
      facilityProvider: "Texas Ortho Spine Center (Bashir)",
      procedureDate: "2024-01-10",
      billAmount: 2450.00
    },
    {
      id: "2",
      dateOfEntry: "2024-01-20",
      dateRangeStart: "2024-01-20",
      dateRangeEnd: "2024-02-20",
      status: "Pending",
      notes: "Follow-up treatment - Active",
      typeOfRequest: "Balance Only",
      facilityProvider: "NuAdvance Orthopedics",
      procedureDate: "2024-01-18",
      billAmount: 1200.00
    }
  ]);

  // Function to calculate final balance after reductions
  const calculateFinalBalance = (billAmount: number) => {
    const completedSteps = Object.values(stepCompletionStatus).filter(Boolean).length;
    // Reduce by 10% per completed step
    return billAmount * (1 - (completedSteps * 0.1));
  };

  const [expandedSteps, setExpandedSteps] = useState<number[]>([]);

  const milestones = [
    { id: 1, title: "Active Care", status: "completed" },
    { id: 2, title: "Closed Records Sent", status: currentStep >= 2 ? "completed" : "pending" },
    { id: 3, title: "Settled Pending Reductions", status: currentStep >= 3 ? "completed" : "pending" },
    { id: 4, title: "Reductions Sent Pending Checks", status: currentStep >= 4 ? "completed" : "pending" },
    { id: 5, title: "Closed Checks Received", status: currentStep >= 5 ? "completed" : "pending" }
  ];

  const statusSteps = [
    {
      id: 1,
      title: "Closed Records Sent",
      details: "Medical records have been collected and sent to insurance companies for review.",
      completed: stepCompletionStatus[1]
    },
    {
      id: 2,
      title: "Settled Pending Reductions",
      details: "Negotiating with providers for bill reductions and settlements.",
      completed: stepCompletionStatus[2]
    },
    {
      id: 3,
      title: "Reductions Sent Pending Checks",
      details: "Reduction agreements sent to providers, awaiting payment confirmations.",
      completed: stepCompletionStatus[3]
    },
    {
      id: 4,
      title: "Closed Checks Received",
      details: "Final payments received and case closed successfully.",
      completed: stepCompletionStatus[4]
    }
  ];

  const totalBillValue = appointmentHistory.reduce((sum, item) => sum + item.billAmount, 0);

  const toggleStepExpansion = (stepId: number) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const handleCloseCase = () => {
    const newCurrentStep = 2;
    setCurrentStep(newCurrentStep);
    
    // Save progress to localStorage
    saveProgressToLocalStorage({
      currentStep: newCurrentStep,
      stepCompletionStatus,
      totalBillValue
    });
    
    alert("Case has been closed and moved to Step 1!");
  };

  const markStepComplete = (stepId: number) => {
    // Validation: Check if previous steps are completed before allowing current step completion
    const canCompleteStep = validateStepCompletion(stepId);
    
    if (!canCompleteStep.isValid) {
      alert(canCompleteStep.message);
      return;
    }

    const newStepCompletionStatus = {
      ...stepCompletionStatus,
      [stepId]: true
    };

    setStepCompletionStatus(newStepCompletionStatus);
    
    // Update current step to next step if this wasn't the last step
    const newCurrentStep = stepId < 4 ? stepId + 1 : currentStep;
    if (newCurrentStep !== currentStep) {
      setCurrentStep(newCurrentStep);
    }

    // Calculate new balance (reduce by 10% per completed step for demo)
    const completedSteps = Object.values(newStepCompletionStatus).filter(Boolean).length;
    const newBalance = totalBillValue * (1 - (completedSteps * 0.1));
    
    // Determine new status based on completion
    let newStatus = "Active";
    if (completedSteps === 4) {
      newStatus = "Completed";
    } else if (completedSteps > 0) {
      newStatus = "In Progress";
    }

    // Save progress to localStorage
    saveProgressToLocalStorage({
      currentStep: newCurrentStep,
      stepCompletionStatus: newStepCompletionStatus,
      totalBillValue: totalBillValue
    }, newBalance, newStatus);

    alert(`Step ${stepId} has been marked as complete!`);
  };

  const validateStepCompletion = (stepId: number) => {
    // Step 1 can always be completed
    if (stepId === 1) {
      return { isValid: true, message: "" };
    }

    // For steps 2-4, check if previous step is completed
    const previousStepId = stepId - 1;
    const isPreviousStepCompleted = stepCompletionStatus[previousStepId as keyof typeof stepCompletionStatus];

    if (!isPreviousStepCompleted) {
      return {
        isValid: false,
        message: `You must complete Step ${previousStepId} before proceeding to Step ${stepId}.`
      };
    }

    return { isValid: true, message: "" };
  };

  const canAccessStep = (stepId: number) => {
    // Step 1 is always accessible
    if (stepId === 1) return true;
    
    // For other steps, check if previous step is completed
    const previousStepId = stepId - 1;
    return stepCompletionStatus[previousStepId as keyof typeof stepCompletionStatus];
  };

  const addNewRow = () => {
    const newRow = {
      id: (appointmentHistory.length + 1).toString(),
      dateOfEntry: new Date().toISOString().split('T')[0],
      dateRangeStart: "",
      dateRangeEnd: "",
      status: "Pending",
      notes: "",
      typeOfRequest: "Billing Update",
      facilityProvider: "",
      procedureDate: "",
      billAmount: 0
    };
    setAppointmentHistory([...appointmentHistory, newRow]);
  };

  const updateRow = (id: string, field: string, value: any) => {
    setAppointmentHistory(prev =>
      prev.map(row => row.id === id ? { ...row, [field]: value } : row)
    );
  };

  return (
    <Layout title="Balance Reduction Management" onNavigate={onNavigate}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onNavigate("patient-details")}
            className="text-medical-primary hover:text-medical-primary/80"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Patient Details
          </Button>
          <h1 className="text-3xl font-bold text-medical-dark">Balance & Reduction Management</h1>
        </div>

        {/* Milestone Progress Bar */}
        <Card className="border-medical-border">
          <CardHeader>
            <CardTitle className="text-medical-dark">Case Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between relative">
              {milestones.map((milestone, index) => (
                <div key={milestone.id} className="flex flex-col items-center relative z-10">
                  <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center ${
                    milestone.status === "completed" 
                      ? "bg-medical-success border-medical-success text-white" 
                      : "bg-orange-100 border-orange-400 text-orange-600"
                  }`}>
                    {milestone.status === "completed" ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <Clock className="h-5 w-5" />
                    )}
                  </div>
                  <span className={`mt-2 text-xs text-center max-w-[100px] ${
                    milestone.status === "completed" ? "text-medical-success font-medium" : "text-orange-600"
                  }`}>
                    {milestone.title}
                  </span>
                  {index < milestones.length - 1 && (
                    <div className={`absolute top-5 left-10 w-[calc(100vw/5-2.5rem)] h-0.5 ${
                      milestones[index + 1].status === "completed" ? "bg-medical-success" : "bg-medical-border"
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Appointment History Table */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-medical-dark">Appointment History</CardTitle>
            <Button onClick={addNewRow} size="sm" className="bg-medical-primary hover:bg-medical-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="text-medical-dark font-semibold min-w-[120px]">Date of Entry</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[120px]">Status</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[150px]">Notes</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[140px]">Type of Request</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[200px]">Facility/Provider</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[120px]">Procedure Date</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[140px]">Current Balance</TableHead>
                    <TableHead className="text-medical-dark font-semibold min-w-[200px]">Date Range</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {appointmentHistory.map((row) => (
                    <TableRow key={row.id} className="hover:bg-medical-background/50">
                      <TableCell>
                        <Input
                          type="date"
                          value={row.dateOfEntry}
                          onChange={(e) => updateRow(row.id, "dateOfEntry", e.target.value)}
                          className="border-medical-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={row.status} onValueChange={(value) => updateRow(row.id, "status", value)}>
                          <SelectTrigger className="border-medical-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Pending">Pending</SelectItem>
                            <SelectItem value="Completed">Completed</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Textarea
                          value={row.notes}
                          onChange={(e) => updateRow(row.id, "notes", e.target.value)}
                          className="border-medical-border min-h-[60px]"
                          placeholder="Case notes..."
                        />
                      </TableCell>
                      <TableCell>
                        <Select value={row.typeOfRequest} onValueChange={(value) => updateRow(row.id, "typeOfRequest", value)}>
                          <SelectTrigger className="border-medical-border">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="with Affidavit">with Affidavit</SelectItem>
                            <SelectItem value="without Affidavit">without Affidavit</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Select value={row.facilityProvider} onValueChange={(value) => updateRow(row.id, "facilityProvider", value)}>
                          <SelectTrigger className="border-medical-border">
                            <SelectValue placeholder="Select provider..." />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Texas Ortho Spine Center (Bashir)">Texas Ortho Spine Center (Bashir)</SelectItem>
                            <SelectItem value="NuAdvance Orthopedics">NuAdvance Orthopedics</SelectItem>
                            <SelectItem value="Metro Pain Management">Metro Pain Management</SelectItem>
                            <SelectItem value="Dallas Sports Medicine">Dallas Sports Medicine</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={row.procedureDate}
                          onChange={(e) => updateRow(row.id, "procedureDate", e.target.value)}
                          className="border-medical-border"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={row.billAmount}
                          onChange={(e) => updateRow(row.id, "billAmount", parseFloat(e.target.value) || 0)}
                          className="border-medical-border"
                          placeholder="0.00"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <div className="flex-1">
                            <label className="text-xs text-medical-muted">Start Date</label>
                            <Input
                              type="date"
                              value={row.dateRangeStart}
                              onChange={(e) => updateRow(row.id, "dateRangeStart", e.target.value)}
                              className="border-medical-border"
                            />
                          </div>
                          <div className="flex-1">
                            <label className="text-xs text-medical-muted">End Date</label>
                            <Input
                              type="date"
                              value={row.dateRangeEnd}
                              onChange={(e) => updateRow(row.id, "dateRangeEnd", e.target.value)}
                              className="border-medical-border"
                            />
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Total Bill Value */}
            <div className="mt-6 p-4 bg-medical-card rounded-lg border border-medical-border">
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold text-medical-dark">Total Bill Value:</span>
                <span className="text-2xl font-bold text-medical-primary">
                  ${totalBillValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Close Case Button - Moved outside of card for better visibility */}
        <div className="flex justify-center">
          <Button
            onClick={handleCloseCase}
            size="lg"
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 font-semibold shadow-lg"
            disabled={currentStep >= 5}
          >
            {currentStep >= 5 ? "Case Closed" : "Close the Case"}
          </Button>
        </div>

        {/* Reopening card structure for status cards */}
        <Card className="border-0 shadow-none bg-transparent">
          <CardContent className="p-0">
          </CardContent>
        </Card>

        {/* Status Cards */}
        <div className="grid gap-4">
          <h2 className="text-xl font-semibold text-medical-dark">Case Status Steps</h2>
          {statusSteps.map((step) => {
            const isAccessible = canAccessStep(step.id);
            const cardOpacity = isAccessible ? 'opacity-100' : 'opacity-50';
            const cursorStyle = isAccessible ? 'cursor-pointer' : 'cursor-not-allowed';
            
            return (
            <Card key={step.id} className={`border ${step.completed ? 'border-medical-success bg-medical-success/5' : 'border-orange-300 bg-orange-50/30'} ${cardOpacity} transition-opacity`}>
              <Collapsible
                open={expandedSteps.includes(step.id)}
                onOpenChange={() => isAccessible && toggleStepExpansion(step.id)}
                disabled={!isAccessible}
              >
                <CollapsibleTrigger asChild disabled={!isAccessible}>
                  <CardHeader className={`${isAccessible ? 'hover:bg-medical-background/30' : ''} transition-colors ${cursorStyle}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed ? 'bg-medical-success text-white' : 
                          isAccessible ? 'bg-orange-400 text-white' : 'bg-gray-400 text-white'
                        }`}>
                          {step.completed ? (
                            <CheckCircle className="h-4 w-4" />
                          ) : isAccessible ? (
                            <Clock className="h-4 w-4" />
                          ) : (
                            <Lock className="h-4 w-4" />
                          )}
                        </div>
                        <CardTitle className={`text-lg ${
                          step.completed ? 'text-medical-success' : 
                          isAccessible ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          Step {step.id}: {step.title}
                          {!isAccessible && step.id > 1 && (
                            <span className="text-xs text-gray-400 ml-2">
                              (Complete Step {step.id - 1} first)
                            </span>
                          )}
                        </CardTitle>
                        <Badge variant={step.completed ? "default" : "secondary"} className={
                          step.completed ? "bg-medical-success text-white" : 
                          isAccessible ? "bg-orange-400 text-white" : "bg-gray-400 text-white"
                        }>
                          {step.completed ? "Completed" : isAccessible ? "Pending" : "Locked"}
                        </Badge>
                      </div>
                      {expandedSteps.includes(step.id) ? (
                        <ChevronUp className="h-4 w-4 text-medical-muted" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-medical-muted" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <p className="text-medical-muted mb-4">{step.details}</p>
                    
                    {/* Step 2 (Settled Pending Reductions) - Reduction Amount Entry */}
                    {step.id === 2 && (
                      <div className="space-y-4 p-4 bg-medical-background rounded-lg">
                        <h4 className="font-semibold text-medical-dark">Reduction Management</h4>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-medical-dark">Total Bill Value</label>
                            <Input 
                              value={`$${totalBillValue.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
                              disabled
                              className="bg-gray-100"
                            />
                          </div>
                          <div>
                            <label className="text-sm font-medium text-medical-dark">Reduction Amount</label>
                            <Input
                              type="number"
                              value={reductionAmount}
                              onChange={(e) => setReductionAmount(parseFloat(e.target.value) || 0)}
                              placeholder="Enter reduction amount"
                              className="border-medical-border"
                              step="0.01"
                            />
                          </div>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <div className="flex justify-between text-sm">
                            <span>Final Amount After Reduction:</span>
                            <span className="font-semibold">
                              ${(totalBillValue - reductionAmount).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </span>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    {/* Mark as Complete Button - Show for any step that is not completed */}
                    {!step.completed && (
                      <div className="mt-4">
                        <Button
                          onClick={() => markStepComplete(step.id)}
                          className="bg-medical-success hover:bg-medical-success/90 text-white"
                        >
                          Mark Step {step.id} as Complete
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Collapsible>
            </Card>
            );
          })}
        </div>
      </div>
    </Layout>
  );
};
