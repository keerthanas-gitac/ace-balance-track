import { useState, useRef } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Upload, 
  XCircle, 
  Trash2,
  Eye,
  ArrowLeft
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
    if (!selectedFile) {
      toast({
        title: "Missing Information",
        description: "Please select a file",
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
    setShowPreview(false);
    if (fileInputRef.current) fileInputRef.current.value = "";
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
            <div className="space-y-4 max-w-md">
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
                disabled={!selectedFile || isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload File"}
              </Button>
              <Button 
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
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