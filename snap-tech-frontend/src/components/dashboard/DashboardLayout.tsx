// components/dashboard/DashboardLayout.tsx
import { Outlet } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Header } from "../layout/header";
import { useAuth } from "@/context/UseAuth";

export function DashboardLayout() {
//   const { user, isAdmin } = useAuth();

  const { isAdmin } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="flex h-16 items-center justify-between px-4">
          <Header/>
          <div className="flex items-center gap-4">
            {isAdmin() && (
              <Badge variant="destructive" className="hidden sm:flex">
                Admin
              </Badge>
            )}
          </div>
        </div>
      </header>
      <main className="flex-1">
        <div className=" py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}