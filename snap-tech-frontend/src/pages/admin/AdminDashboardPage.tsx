// pages/admin/AdminDashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/context/UseAuth";

export function AdminDashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Admin Dashboard</CardTitle>
            <div className="flex gap-2">
              {user?.roles.map((role) => (
                <Badge
                  key={role}
                  variant={role === "admin" ? "destructive" : "outline"}
                >
                  {role}
                </Badge>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Welcome to the admin control panel.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">User Management</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Users
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">System Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Configure System
                </Button>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}