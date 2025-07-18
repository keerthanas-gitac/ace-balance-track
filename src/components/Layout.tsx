import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { LogOut, Menu, User, Home } from "lucide-react";

interface LayoutProps {
  children: ReactNode;
  title?: string;
  onNavigate?: (page: string, id?: string) => void;
  showHomeButton?: boolean;
}

export const Layout = ({ children, title = "ACE Physician Service", onNavigate, showHomeButton = true }: LayoutProps) => {
  const handleLogout = () => {
    // TODO: Implement logout logic
    console.log("Logout clicked");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border shadow-card">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => onNavigate?.("dashboard")}
                  className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span className="text-primary-foreground font-bold text-lg">A</span>
                </button>
                <button 
                  onClick={() => onNavigate?.("dashboard")}
                  className="text-xl font-semibold text-foreground hover:text-primary transition-colors cursor-pointer"
                >
                  ACE Physician Service
                </button>
              </div>
              {title && title !== "ACE Physician Service" && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-medium">{title}</span>
                </>
              )}
            </div>

            {/* Navigation and User Menu */}
            <div className="flex items-center space-x-4">
              {/* Home button - only show if not on dashboard and navigation is available */}
              {onNavigate && showHomeButton && title !== "ACE Physician Service" && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onNavigate("dashboard")}
                  className="gap-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Button>
              )}
              
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>Admin</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-muted-foreground hover:text-foreground"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};