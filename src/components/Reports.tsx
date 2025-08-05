import { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar as CalendarIcon,
  Users, 
  BarChart3,
  Filter,
  ArrowLeft,
  Eye,
  Clock,
  AlertTriangle
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

const mockPatientWiseReports = [
  {
    id: "1",
    name: "Patient Wise Report",
    description: "Comprehensive patient details and all services taken with complete system data",
    type: "patient-wise",
    lastGenerated: "2024-01-15",
    records: 89,
    status: "available",
    totalPatients: 89
  }
];

export const Reports = ({ onNavigate }: ReportsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);
  const [viewingReport, setViewingReport] = useState<string | null>(null);

  const getFilteredPatientData = () => {
    const reportData = getReportDetails("1");
    if (!reportData) return [];
    
    if (!searchTerm) return reportData.details.patientDetails;
    
    return reportData.details.patientDetails.filter(patient => {
      const searchLower = searchTerm.toLowerCase();
      return (
        patient.patient.toLowerCase().includes(searchLower) ||
        patient.patientId.toLowerCase().includes(searchLower) ||
        patient.phone.includes(searchTerm) ||
        patient.services.some(service => 
          service.service.toLowerCase().includes(searchLower) ||
          service.provider.toLowerCase().includes(searchLower) ||
          service.status.toLowerCase().includes(searchLower)
        )
      );
    });
  };

  const filteredReports = mockPatientWiseReports;

  const handleGenerateReport = async (reportId: string, format: "excel" | "pdf") => {
    setGeneratingReport(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(null);
    
    // In real implementation, this would trigger actual file download
    console.log(`Generating ${format} report for ${reportId}`);
  };

  const handleViewReport = (reportId: string) => {
    setViewingReport(viewingReport === reportId ? null : reportId);
  };

  const getReportDetails = (reportId: string) => {
    const report = mockPatientWiseReports.find(r => r.id === reportId);
    if (!report) return null;

    // Mock detailed patient data for the report
    const mockPatientData = {
      summary: {
        totalPatients: report.totalPatients,
        totalServices: 245,
        totalRevenue: "$156,780",
        avgServicesPerPatient: "2.8"
      },
      patientDetails: [
        { 
          patient: "John Smith", 
          patientId: "P001",
          dateOfBirth: "1985-03-15",
          phone: "(555) 123-4567",
          services: [
            { service: "Consultation", date: "2024-01-10", provider: "Dr. Johnson", amount: "$200", status: "Completed" },
            { service: "X-Ray", date: "2024-01-10", provider: "Dr. Johnson", amount: "$150", status: "Completed" },
            { service: "Follow-up", date: "2024-01-20", provider: "Dr. Johnson", amount: "$100", status: "Scheduled" }
          ],
          totalAmount: "$450"
        },
        { 
          patient: "Sarah Wilson", 
          patientId: "P002",
          dateOfBirth: "1992-07-22",
          phone: "(555) 987-6543",
          services: [
            { service: "Physical Therapy", date: "2024-01-08", provider: "Dr. Martinez", amount: "$120", status: "Completed" },
            { service: "MRI Scan", date: "2024-01-12", provider: "Dr. Martinez", amount: "$800", status: "Completed" }
          ],
          totalAmount: "$920"
        },
        { 
          patient: "Mike Davis", 
          patientId: "P003",
          dateOfBirth: "1978-11-05",
          phone: "(555) 456-7890",
          services: [
            { service: "Surgery", date: "2024-01-05", provider: "Dr. Thompson", amount: "$2,500", status: "Completed" },
            { service: "Post-op Care", date: "2024-01-15", provider: "Dr. Thompson", amount: "$300", status: "In Progress" }
          ],
          totalAmount: "$2,800"
        }
      ]
    };

    return { report, details: mockPatientData };
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
              Comprehensive patient details and all services data from the system
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Filter className="h-5 w-5" />
                  Filters
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="search">Search Patients</Label>
                  <Input
                    id="search"
                    placeholder="Search by patient name, ID, phone, service, or provider..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>


                <div>
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-1 gap-2 mt-1">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !dateFrom && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateFrom ? format(dateFrom, "PPP") : "From date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateFrom}
                          onSelect={setDateFrom}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !dateTo && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {dateTo ? format(dateTo, "PPP") : "To date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateTo}
                          onSelect={setDateTo}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => {
                    setSearchTerm("");
                    setDateFrom(undefined);
                    setDateTo(undefined);
                  }}
                >
                  Clear Filters
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Reports List */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-foreground">
                  Patient Reports ({filteredReports.length})
                </h2>
              </div>

              <div className="grid gap-4">
                {filteredReports.map((report) => {
                  const reportDetails = getReportDetails(report.id);
                  const isViewing = viewingReport === report.id;
                  
                  return (
                    <Card key={report.id} className="hover:shadow-md transition-shadow">
                       <CardHeader>
                         <div className="flex justify-between items-start">
                           <div className="flex-1">
                             <CardTitle className="flex items-center gap-2 text-lg">
                               {report.type === "patient-wise" ? (
                                 <Users className="h-5 w-5 text-primary" />
                               ) : (
                                 <BarChart3 className="h-5 w-5 text-primary" />
                               )}
                               {report.name}
                             </CardTitle>
                             <CardDescription className="mt-1">
                               {report.description}
                             </CardDescription>
                           </div>
                          </div>
                       </CardHeader>
                       <CardContent>
                         <div className="flex justify-between items-center">
                            <div className="text-sm text-muted-foreground">
                              <p>Last Generated: {format(new Date(report.lastGenerated), "PPP")}</p>
                              <p>{report.totalPatients} total patients with comprehensive service data</p>
                            </div>
                           
                           <div className="flex gap-2">
                             <Button
                               variant={isViewing ? "default" : "outline"}
                               size="sm"
                               onClick={() => handleViewReport(report.id)}
                               className="gap-2"
                             >
                               <Eye className="h-4 w-4" />
                               {isViewing ? "Hide" : "View"}
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleGenerateReport(report.id, "excel")}
                               disabled={generatingReport === report.id}
                               className="gap-2"
                             >
                               <FileSpreadsheet className="h-4 w-4" />
                               {generatingReport === report.id ? "Generating..." : "Excel"}
                             </Button>
                             <Button
                               variant="outline"
                               size="sm"
                               onClick={() => handleGenerateReport(report.id, "pdf")}
                               disabled={generatingReport === report.id}
                               className="gap-2"
                             >
                               <FileText className="h-4 w-4" />
                               {generatingReport === report.id ? "Generating..." : "PDF"}
                             </Button>
                           </div>
                         </div>
                         
                         {/* Expanded view section */}
                         {isViewing && reportDetails && (
                           <div className="mt-4 pt-4 border-t border-border">
                             <div className="space-y-4">
                                {/* Summary Stats */}
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                  <div className="bg-accent/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-primary">{reportDetails.details.summary.totalPatients}</div>
                                    <div className="text-xs text-muted-foreground">Total Patients</div>
                                  </div>
                                  <div className="bg-accent/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-green-600">{reportDetails.details.summary.totalServices}</div>
                                    <div className="text-xs text-muted-foreground">Total Services</div>
                                  </div>
                                  <div className="bg-accent/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-blue-600">{reportDetails.details.summary.totalRevenue}</div>
                                    <div className="text-xs text-muted-foreground">Total Revenue</div>
                                  </div>
                                  <div className="bg-accent/30 rounded-lg p-3">
                                    <div className="text-2xl font-bold text-purple-600">{reportDetails.details.summary.avgServicesPerPatient}</div>
                                    <div className="text-xs text-muted-foreground">Avg Services/Patient</div>
                                  </div>
                                </div>
                               
                                {/* Patient Details */}
                                <div>
                                  <h4 className="font-semibold text-foreground mb-3">
                                    Patient Details {searchTerm && `(Filtered: ${getFilteredPatientData().length} of ${reportDetails.details.patientDetails.length})`}
                                  </h4>
                                  <div className="space-y-4">
                                    {getFilteredPatientData().map((patient, index) => (
                                      <div key={index} className="p-4 bg-background rounded-lg border border-border">
                                        <div className="flex justify-between items-start mb-3">
                                          <div className="flex-1">
                                            <div className="font-medium text-foreground">{patient.patient}</div>
                                            <div className="text-sm text-muted-foreground">ID: {patient.patientId} • DOB: {patient.dateOfBirth} • Phone: {patient.phone}</div>
                                          </div>
                                          <div className="text-right">
                                            <div className="font-medium text-primary">{patient.totalAmount}</div>
                                            <div className="text-xs text-muted-foreground">Total Amount</div>
                                          </div>
                                        </div>
                                        <div className="space-y-2">
                                          <h5 className="text-sm font-medium text-foreground">Services:</h5>
                                          {patient.services.map((service, serviceIndex) => (
                                            <div key={serviceIndex} className="flex justify-between items-center text-sm p-2 bg-accent/20 rounded">
                                              <div>
                                                <span className="font-medium">{service.service}</span>
                                                <span className="text-muted-foreground ml-2">• {service.date} • {service.provider}</span>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <Badge variant={service.status === "Completed" ? "default" : service.status === "In Progress" ? "secondary" : "outline"}>
                                                  {service.status}
                                                </Badge>
                                                <span className="font-medium">{service.amount}</span>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>
                                    ))}
                                    {getFilteredPatientData().length === 0 && searchTerm && (
                                      <div className="text-center py-8">
                                        <p className="text-muted-foreground">No patients found matching "{searchTerm}"</p>
                                      </div>
                                    )}
                                  </div>
                                </div>
                             </div>
                           </div>
                         )}
                       </CardContent>
                    </Card>
                  );
                })}
              </div>

              {filteredReports.length === 0 && (
                <Card>
                  <CardContent className="text-center py-8">
                    <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-foreground mb-2">No Reports Found</h3>
                    <p className="text-muted-foreground">
                      Try adjusting your filters to find the reports you're looking for.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};