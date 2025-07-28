import { useState, useRef } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Upload, 
  XCircle, 
  Trash2,
  Eye,
  ArrowLeft,
  Download
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface CSVUploadProps {
  onNavigate: (page: string) => void;
}

interface ValidationError {
  row: number;
  column: string;
  error: string;
  value: string;
}

const mockValidationErrors: ValidationError[] = [
  {
    row: 3,
    column: "email",
    error: "Invalid email format",
    value: "patient@invalid"
  },
  {
    row: 7,
    column: "phone",
    error: "Phone number must be 10 digits",
    value: "555-123"
  },
  {
    row: 12,
    column: "date_of_birth",
    error: "Invalid date format (expected MM/DD/YYYY)",
    value: "01-15-1990"
  }
];

export const CSVUpload = ({ onNavigate }: CSVUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadType, setUploadType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith('.csv')) {
        toast({
          title: "Invalid File Type",
          description: "Please select a CSV file",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
      setShowPreview(false);
      setValidationErrors([]);
      
      // Simulate reading file for preview
      setTimeout(() => {
        setPreviewData([
          { id: "1", name: "John Doe", email: "john@example.com", phone: "555-0123" },
          { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "555-0124" },
          { id: "3", name: "Bob Johnson", email: "bob@invalid", phone: "555-012" }
        ]);
        setShowPreview(true);
      }, 500);
    }
  };

  const simulateUpload = async () => {
    if (!selectedFile || !uploadType) {
      toast({
        title: "Missing Information",
        description: "Please select a file and upload type",
        variant: "destructive"
      });
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setValidationErrors([]);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    // Simulate validation errors for demo
    if (selectedFile.name.includes("error")) {
      setValidationErrors(mockValidationErrors);
      toast({
        title: "Upload Failed", 
        description: "File contains validation errors",
        variant: "destructive"
      });
    } else {
      toast({
        title: "Upload Successful",
        description: `Data uploaded successfully`
      });
    }

    setIsUploading(false);
    setSelectedFile(null);
    setUploadType("");
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const downloadTemplate = (type: string) => {
    // In a real app, this would download actual templates
    const templates = {
      "Patient Data": "patient_id,first_name,last_name,email,phone,date_of_birth,address",
      "Appointments": "appointment_id,patient_id,provider_id,date,time,status,notes",
      "Provider Data": "provider_id,name,specialty,email,phone,license_number",
      "Insurance Data": "policy_id,patient_id,insurance_company,policy_number,group_number"
    };
    
    const content = templates[type as keyof typeof templates] || "";
    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${type.toLowerCase().replace(' ', '_')}_template.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
    
    toast({
      title: "Template Downloaded",
      description: `${type} template has been downloaded`
    });
  };

  return (
    <Layout title="CSV Import" onNavigate={onNavigate}>
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
            <h1 className="text-3xl font-bold text-medical-dark">CSV Data Import</h1>
          </div>
        </div>

        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload CSV File
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="uploadType">Data Type</Label>
                  <Select value={uploadType} onValueChange={setUploadType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select data type..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Patient Data">Patient Data</SelectItem>
                      <SelectItem value="Appointments">Appointments</SelectItem>
                      <SelectItem value="Provider Data">Provider Data</SelectItem>
                      <SelectItem value="Insurance Data">Insurance Data</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="file">CSV File</Label>
                  <Input
                    ref={fileInputRef}
                    id="file"
                    type="file"
                    accept=".csv"
                    onChange={handleFileSelect}
                    disabled={isUploading}
                  />
                </div>

                {selectedFile && (
                  <div className="p-4 bg-medical-light rounded border">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedFile.name}</p>
                        <p className="text-sm text-medical-muted">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFile(null);
                          setShowPreview(false);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div className="p-4 bg-blue-50 border border-blue-200 rounded">
                  <h3 className="font-medium text-blue-900 mb-2">Upload Guidelines</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• File must be in CSV format</li>
                    <li>• Maximum file size: 10MB</li>
                    <li>• First row should contain column headers</li>
                    <li>• Use our templates for best results</li>
                    <li>• Data will be validated before import</li>
                  </ul>
                </div>

                {uploadType && (
                  <Button 
                    variant="outline" 
                    onClick={() => downloadTemplate(uploadType)}
                    className="w-full"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download {uploadType} Template
                  </Button>
                )}
              </div>
            </div>

            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            {showPreview && previewData.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <h3 className="font-medium">Data Preview (First 3 rows)</h3>
                </div>
                <div className="border rounded overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {Object.keys(previewData[0]).map((key) => (
                          <TableHead key={key}>{key}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {previewData.map((row, index) => (
                        <TableRow key={index}>
                          {Object.values(row).map((value: any, cellIndex) => (
                            <TableCell key={cellIndex}>{value}</TableCell>
                          ))}
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            {validationErrors.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-red-600">
                  <XCircle className="h-4 w-4" />
                  <h3 className="font-medium">Validation Errors</h3>
                </div>
                <div className="border border-red-200 rounded overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Row</TableHead>
                        <TableHead>Column</TableHead>
                        <TableHead>Error</TableHead>
                        <TableHead>Value</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {validationErrors.map((error, index) => (
                        <TableRow key={index}>
                          <TableCell>{error.row}</TableCell>
                          <TableCell>{error.column}</TableCell>
                          <TableCell className="text-red-600">{error.error}</TableCell>
                          <TableCell className="font-mono text-sm">{error.value}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <Button 
                onClick={simulateUpload}
                disabled={!selectedFile || !uploadType || isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setUploadType("");
                  setShowPreview(false);
                  setValidationErrors([]);
                  if (fileInputRef.current) fileInputRef.current.value = "";
                }}
              >
                Reset
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};