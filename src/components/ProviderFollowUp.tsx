import { useState } from "react";
import { Layout } from "./Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, CalendarIcon, Search, Phone, Mail, FileText, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { format } from "date-fns";

interface ProviderFollowUpProps {
  onNavigate: (page: string) => void;
}

interface FollowUpItem {
  id: string;
  providerName: string;
  providerType: string;
  patientName: string;
  appointmentDate: string;
  status: "pending" | "completed" | "overdue";
  priority: "high" | "medium" | "low";
  lastContact: string;
  notes: string;
  nextAction: string;
  dueDate: string;
}

const mockFollowUps: FollowUpItem[] = [
  {
    id: "1",
    providerName: "Dr. Sarah Johnson",
    providerType: "Primary Care",
    patientName: "John Smith",
    appointmentDate: "2024-01-15",
    status: "pending",
    priority: "high",
    lastContact: "2024-01-10",
    notes: "Patient needs authorization for specialist referral",
    nextAction: "Call to confirm insurance approval",
    dueDate: "2024-01-20"
  },
  {
    id: "2",
    providerName: "Dr. Michael Chen",
    providerType: "Specialist",
    patientName: "Emily Davis",
    appointmentDate: "2024-01-12",
    status: "completed",
    priority: "medium",
    lastContact: "2024-01-18",
    notes: "Follow-up completed successfully",
    nextAction: "Schedule next review",
    dueDate: "2024-01-25"
  },
  {
    id: "3",
    providerName: "Dr. Lisa Wang",
    providerType: "Urgent Care",
    patientName: "Robert Wilson",
    appointmentDate: "2024-01-08",
    status: "overdue",
    priority: "high",
    lastContact: "2024-01-05",
    notes: "Patient missed follow-up appointment",
    nextAction: "Urgent contact required",
    dueDate: "2024-01-15"
  }
];

export const ProviderFollowUp = ({ onNavigate }: ProviderFollowUpProps) => {
  const [followUps, setFollowUps] = useState<FollowUpItem[]>(mockFollowUps);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedFollowUp, setSelectedFollowUp] = useState<FollowUpItem | null>(null);
  const [newNote, setNewNote] = useState("");

  const filteredFollowUps = followUps.filter(item => {
    const matchesSearch = item.providerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.patientName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || item.status === statusFilter;
    const matchesPriority = priorityFilter === "all" || item.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

  const updateFollowUpStatus = (id: string, status: "pending" | "completed" | "overdue") => {
    setFollowUps(prev => prev.map(item => 
      item.id === id ? { ...item, status } : item
    ));
  };

  const addNote = (id: string) => {
    if (!newNote.trim()) return;
    
    setFollowUps(prev => prev.map(item => 
      item.id === id ? { 
        ...item, 
        notes: item.notes + `\n[${format(new Date(), "MM/dd/yyyy")}] ${newNote}`,
        lastContact: format(new Date(), "yyyy-MM-dd")
      } : item
    ));
    setNewNote("");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed": return "bg-medical-success text-white";
      case "pending": return "bg-orange-400 text-white";
      case "overdue": return "bg-red-500 text-white";
      default: return "bg-medical-muted text-white";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700 border-red-300";
      case "medium": return "bg-orange-100 text-orange-700 border-orange-300";
      case "low": return "bg-green-100 text-green-700 border-green-300";
      default: return "bg-medical-muted text-white";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed": return <CheckCircle className="h-4 w-4" />;
      case "pending": return <Clock className="h-4 w-4" />;
      case "overdue": return <AlertCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <Layout onNavigate={onNavigate}>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-medical-dark">Provider Follow-up Management</h1>
          <Badge variant="secondary" className="text-sm">
            {filteredFollowUps.length} Follow-ups
          </Badge>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Filters & Search</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="search">Search</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-medical-muted" />
                  <Input
                    id="search"
                    placeholder="Search provider or patient..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Statuses</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priorities</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="low">Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }} variant="outline">
                  Clear Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Follow-up List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-medical-dark">Follow-up Items</h2>
            {filteredFollowUps.map((item) => (
              <Card 
                key={item.id} 
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedFollowUp?.id === item.id ? 'ring-2 ring-medical-primary' : ''
                }`}
                onClick={() => setSelectedFollowUp(item)}
              >
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-medical-dark">{item.providerName}</h3>
                        <p className="text-sm text-medical-muted">{item.providerType}</p>
                      </div>
                      <div className="flex gap-2">
                        <Badge className={getStatusColor(item.status)}>
                          {getStatusIcon(item.status)}
                          <span className="ml-1 capitalize">{item.status}</span>
                        </Badge>
                        <Badge variant="outline" className={getPriorityColor(item.priority)}>
                          {item.priority.toUpperCase()}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-medium">Patient:</span>
                        <span className="text-medical-dark">{item.patientName}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <CalendarIcon className="h-4 w-4 text-medical-muted" />
                        <span>Appointment: {format(new Date(item.appointmentDate), "MMM dd, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="h-4 w-4 text-medical-muted" />
                        <span>Due: {format(new Date(item.dueDate), "MMM dd, yyyy")}</span>
                      </div>
                    </div>

                    <div className="pt-2 border-t">
                      <p className="text-sm text-medical-dark font-medium">{item.nextAction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Detail Panel */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-medical-dark">Follow-up Details</h2>
            {selectedFollowUp ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{selectedFollowUp.providerName}</span>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateFollowUpStatus(selectedFollowUp.id, "pending")}
                        disabled={selectedFollowUp.status === "pending"}
                      >
                        Mark Pending
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => updateFollowUpStatus(selectedFollowUp.id, "completed")}
                        disabled={selectedFollowUp.status === "completed"}
                      >
                        Mark Complete
                      </Button>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Tabs defaultValue="details" className="w-full">
                    <TabsList className="grid w-full grid-cols-3">
                      <TabsTrigger value="details">Details</TabsTrigger>
                      <TabsTrigger value="notes">Notes</TabsTrigger>
                      <TabsTrigger value="actions">Actions</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="details" className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium">Provider Type</Label>
                          <p className="text-medical-dark">{selectedFollowUp.providerType}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Priority</Label>
                          <Badge variant="outline" className={getPriorityColor(selectedFollowUp.priority)}>
                            {selectedFollowUp.priority.toUpperCase()}
                          </Badge>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Patient</Label>
                          <p className="text-medical-dark">{selectedFollowUp.patientName}</p>
                        </div>
                        <div>
                          <Label className="text-sm font-medium">Last Contact</Label>
                          <p className="text-medical-dark">{format(new Date(selectedFollowUp.lastContact), "MMM dd, yyyy")}</p>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Next Action Required</Label>
                        <p className="text-medical-dark mt-1">{selectedFollowUp.nextAction}</p>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="notes" className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium">Current Notes</Label>
                        <div className="mt-2 p-3 bg-medical-light rounded border min-h-[100px]">
                          <pre className="text-sm text-medical-dark whitespace-pre-wrap">{selectedFollowUp.notes}</pre>
                        </div>
                      </div>
                      
                      <div>
                        <Label className="text-sm font-medium">Add New Note</Label>
                        <Textarea
                          placeholder="Enter your note here..."
                          value={newNote}
                          onChange={(e) => setNewNote(e.target.value)}
                          className="mt-2"
                        />
                        <Button 
                          onClick={() => addNote(selectedFollowUp.id)}
                          className="mt-2"
                          disabled={!newNote.trim()}
                        >
                          Add Note
                        </Button>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="actions" className="space-y-4">
                      <div className="grid grid-cols-1 gap-3">
                        <Button variant="outline" className="justify-start">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Provider
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Mail className="h-4 w-4 mr-2" />
                          Send Email
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <FileText className="h-4 w-4 mr-2" />
                          Generate Report
                        </Button>
                        <Button variant="outline" className="justify-start">
                          <Calendar className="h-4 w-4 mr-2" />
                          Schedule Follow-up
                        </Button>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <div className="text-medical-muted">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Select a follow-up item to view details</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};