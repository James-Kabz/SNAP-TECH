// pages/DashboardPage.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/context/UseAuth";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Welcome, {user?.name}!</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            This is your personal dashboard.
          </p>
        </CardContent>
      </Card>
      {/* Add more user-specific content here */}
    </div>
  );
}