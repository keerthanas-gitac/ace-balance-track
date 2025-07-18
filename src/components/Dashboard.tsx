import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Layout } from "@/components/Layout";
import { 
  Upload, 
  Users, 
  FileText, 
  DollarSign, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Activity
} from "lucide-react";

interface DashboardProps {
  onNavigate: (page: string) => void;
}

export const Dashboard = ({ onNavigate }: DashboardProps) => {
  const [stats] = useState({
    totalPatients: 124,
    activeCases: 89,
    pendingReductions: 23,
    completedCases: 35,
    pendingFollowUps: 12
  });

  const quickActions = [
    {
      title: "Import Case Data",
      description: "Upload CSV file with patient information",
      icon: Upload,
      action: () => onNavigate("import"),
      variant: "medical" as const
    },
    {
      title: "View Patients",
      description: "Manage patient cases and balances",
      icon: Users,
      action: () => onNavigate("patients"),
      variant: "default" as const
    },
    {
      title: "Reports",
      description: "Download reports grouped by provider or attorney",
      icon: FileText,
      action: () => onNavigate("reports"),
      variant: "secondary" as const
    }
  ];

  const recentActivity = [
    { action: "New patient case imported", time: "2 hours ago", type: "success" },
    { action: "Balance reduction completed", time: "4 hours ago", type: "info" },
    { action: "Provider follow-up scheduled", time: "1 day ago", type: "warning" },
    { action: "Case closed - payment received", time: "2 days ago", type: "success" }
  ];

  return (
    <Layout title="Dashboard" onNavigate={onNavigate} showHomeButton={false}>
      <div className="space-y-8 animate-fade-in">
        {/* Welcome Section */}
        <div className="bg-gradient-primary rounded-lg p-8 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome to ACE Physician Service</h1>
              <p className="text-primary-foreground/80 text-lg">
                Manage patient account balances and medical bill reductions efficiently
              </p>
            </div>
            <div className="hidden md:block">
              <Activity className="h-20 w-20 text-primary-foreground/30" />
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalPatients}</div>
              <p className="text-xs text-muted-foreground">
                <TrendingUp className="inline h-3 w-3 mr-1" />
                +12% from last month
              </p>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Cases</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-warning">{stats.activeCases}</div>
              <p className="text-xs text-muted-foreground">Currently in progress</p>
            </CardContent>
          </Card>


          <Card className="shadow-card hover:shadow-elegant transition-all duration-300">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completed Cases</CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-medical-success">{stats.completedCases}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Quick Actions */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks and operations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {quickActions.map((action, index) => (
                <div key={index} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-accent/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                    </div>
                  </div>
                  <Button variant={action.variant} size="sm" onClick={action.action}>
                    Go
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="shadow-card">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest updates and actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className={`p-1 rounded-full mt-1 ${
                    activity.type === 'success' ? 'bg-medical-success/20' :
                    activity.type === 'warning' ? 'bg-medical-warning/20' :
                    'bg-primary/20'
                  }`}>
                    <div className={`w-2 h-2 rounded-full ${
                      activity.type === 'success' ? 'bg-medical-success' :
                      activity.type === 'warning' ? 'bg-medical-warning' :
                      'bg-primary'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.action}</p>
                    <p className="text-xs text-muted-foreground">{activity.time}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Status Overview */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Case Status Overview</CardTitle>
            <CardDescription>Current status distribution of all cases</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-medical-warning mb-1">{stats.pendingReductions}</div>
                <Badge variant="outline" className="text-xs">Pending Reductions</Badge>
              </div>
              <div className="text-center p-4 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-primary mb-1">{stats.activeCases}</div>
                <Badge variant="outline" className="text-xs">Active Cases</Badge>
              </div>
              <div className="text-center p-4 bg-accent/30 rounded-lg">
                <div className="text-2xl font-bold text-medical-success mb-1">{stats.completedCases}</div>
                <Badge variant="outline" className="text-xs">Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};