import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Layout } from "@/components/Layout";
import { 
  Search, 
  Upload, 
  FileText, 
  Calendar,
  Eye,
  ArrowLeft,
  Users
} from "lucide-react";

interface Patient {
  id: string;
  name: string;
  dob: string;
  gender: string;
  caseNumber: string;
  registrationDate: string;
  status: 'active' | 'pending' | 'completed';
  providersCount: number;
}

interface PatientListProps {
  onNavigate: (page: string, patientId?: string) => void;
}

export const PatientList = ({ onNavigate }: PatientListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Sample data - in real app this would come from CSV import/API
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "John Smith",
      dob: "1985-03-15",
      gender: "Male",
      caseNumber: "ACE-2024-001",
      registrationDate: "2024-01-15",
      status: "active",
      providersCount: 3
    },
    {
      id: "2", 
      name: "Sarah Johnson",
      dob: "1992-07-22",
      gender: "Female",
      caseNumber: "ACE-2024-002",
      registrationDate: "2024-01-18",
      status: "pending",
      providersCount: 2
    },
    {
      id: "3",
      name: "Michael Brown",
      dob: "1978-11-08",
      gender: "Male", 
      caseNumber: "ACE-2024-003",
      registrationDate: "2024-01-20",
      status: "active",
      providersCount: 4
    },
    {
      id: "4",
      name: "Emily Davis",
      dob: "1990-05-12",
      gender: "Female",
      caseNumber: "ACE-2024-004", 
      registrationDate: "2024-01-22",
      status: "completed",
      providersCount: 2
    }
  ]);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.caseNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-medical-warning/20 text-medical-warning';
      case 'pending': return 'bg-primary/20 text-primary';
      case 'completed': return 'bg-medical-success/20 text-medical-success';
      default: return 'bg-medical-neutral/20 text-medical-neutral';
    }
  };

  return (
    <Layout title="Patient Management" onNavigate={onNavigate}>
      <div className="space-y-6 animate-fade-in">
        {/* Header Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              onClick={() => onNavigate("dashboard")}
              className="text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search patients or case numbers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full sm:w-80"
              />
            </div>
            <Button variant="medical" onClick={() => onNavigate("import")}>
              <Upload className="h-4 w-4 mr-2" />
              Import CSV
            </Button>
          </div>
        </div>

        {/* Patients Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <Card key={patient.id} className="shadow-card hover:shadow-elegant transition-all duration-300 group">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg group-hover:text-primary transition-colors">
                      {patient.name}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      Case: {patient.caseNumber}
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(patient.status)}>
                    {patient.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Patient Details */}
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">DOB:</span>
                  </div>
                  <span className="font-medium">{new Date(patient.dob).toLocaleDateString()}</span>
                  
                  <div className="flex items-center space-x-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Gender:</span>
                  </div>
                  <span className="font-medium">{patient.gender}</span>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-muted-foreground">Registered:</span>
                  </div>
                  <span className="font-medium">{new Date(patient.registrationDate).toLocaleDateString()}</span>
                </div>

                {/* Provider Info */}
                <div className="bg-accent/30 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Users className="h-4 w-4 text-primary" />
                    <span className="text-sm font-medium">Providers</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {patient.providersCount} provider{patient.providersCount !== 1 ? 's' : ''}
                  </div>
                </div>

                {/* Action Button */}
                <Button 
                  variant="outline" 
                  className="w-full group-hover:border-primary group-hover:text-primary transition-colors"
                  onClick={() => onNavigate("patient-details", patient.id)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  View Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredPatients.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No patients found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm ? "Try adjusting your search criteria" : "Import a CSV file to get started"}
              </p>
              <Button variant="medical" onClick={() => onNavigate("import")}>
                <Upload className="h-4 w-4 mr-2" />
                Import Patient Data
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Summary Stats */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Patient Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">{patients.length}</div>
                <div className="text-sm text-muted-foreground">Total Patients</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-warning">
                  {patients.filter(p => p.status === 'active').length}
                </div>
                <div className="text-sm text-muted-foreground">Active Cases</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-medical-success">
                  {patients.filter(p => p.status === 'completed').length}
                </div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};