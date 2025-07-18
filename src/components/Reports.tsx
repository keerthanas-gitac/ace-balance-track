import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Download, 
  FileText, 
  FileSpreadsheet, 
  Calendar as CalendarIcon,
  Users, 
  Building,
  Filter,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ReportsProps {
  onNavigate: (page: string) => void;
}

const mockReports = [
  {
    id: "1",
    name: "Provider Performance Report",
    description: "Comprehensive analysis of provider performance metrics",
    type: "provider",
    lastGenerated: "2024-01-15",
    records: 245
  },
  {
    id: "2",
    name: "Attorney Case Summary",
    description: "Summary of cases handled by attorney firms",
    type: "attorney",
    lastGenerated: "2024-01-14",
    records: 89
  },
  {
    id: "3",
    name: "Monthly Provider Revenue",
    description: "Revenue breakdown by healthcare providers",
    type: "provider",
    lastGenerated: "2024-01-13",
    records: 156
  },
  {
    id: "4",
    name: "Attorney Settlement Analysis",
    description: "Analysis of settlements by attorney representation",
    type: "attorney",
    lastGenerated: "2024-01-12",
    records: 73
  }
];

export const Reports = ({ onNavigate }: ReportsProps) => {
  const [selectedGroup, setSelectedGroup] = useState<string>("all");
  const [dateFrom, setDateFrom] = useState<Date>();
  const [dateTo, setDateTo] = useState<Date>();
  const [searchTerm, setSearchTerm] = useState("");
  const [generatingReport, setGeneratingReport] = useState<string | null>(null);

  const filteredReports = mockReports.filter(report => {
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGroup = selectedGroup === "all" || report.type === selectedGroup;
    return matchesSearch && matchesGroup;
  });

  const handleGenerateReport = async (reportId: string, format: "excel" | "pdf") => {
    setGeneratingReport(reportId);
    // Simulate report generation
    await new Promise(resolve => setTimeout(resolve, 2000));
    setGeneratingReport(null);
    
    // In real implementation, this would trigger actual file download
    console.log(`Generating ${format} report for ${reportId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
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
            <div>
              <h1 className="text-2xl font-bold text-foreground">Reports</h1>
              <p className="text-sm text-muted-foreground">
                Generate and download reports grouped by provider or attorney
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
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
                  <Label htmlFor="search">Search Reports</Label>
                  <Input
                    id="search"
                    placeholder="Search by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label htmlFor="group">Group By</Label>
                  <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select grouping" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Reports</SelectItem>
                      <SelectItem value="provider">Provider Reports</SelectItem>
                      <SelectItem value="attorney">Attorney Reports</SelectItem>
                    </SelectContent>
                  </Select>
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
                    setSelectedGroup("all");
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
                  Available Reports ({filteredReports.length})
                </h2>
                <Button className="gap-2">
                  <Download className="h-4 w-4" />
                  Bulk Download
                </Button>
              </div>

              <div className="grid gap-4">
                {filteredReports.map((report) => (
                  <Card key={report.id} className="hover:shadow-md transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <CardTitle className="flex items-center gap-2 text-lg">
                            {report.type === "provider" ? (
                              <Users className="h-5 w-5 text-primary" />
                            ) : (
                              <Building className="h-5 w-5 text-primary" />
                            )}
                            {report.name}
                          </CardTitle>
                          <CardDescription className="mt-1">
                            {report.description}
                          </CardDescription>
                        </div>
                        <Badge variant={report.type === "provider" ? "default" : "secondary"}>
                          {report.type === "provider" ? "Provider" : "Attorney"}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-muted-foreground">
                          <p>Last Generated: {format(new Date(report.lastGenerated), "PPP")}</p>
                          <p>{report.records} records</p>
                        </div>
                        
                        <div className="flex gap-2">
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
                    </CardContent>
                  </Card>
                ))}
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
    </div>
  );
};