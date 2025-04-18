import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { DashboardLayout } from "./components/dashboard/DashboardLayout";
import { DashboardPage } from "./pages/DashboardPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { UnauthorizedPage } from "./pages/UnauthorizedPage";
import LoginForm from "./pages/login";
import { Toaster } from "sonner";
import { PrivateRoute } from "./components/routes/PrivateRoute";
import { RoleRoute } from "./components/routes/RoleRoute";
import HomePage from "./pages/home";
import { CartProvider } from "./hooks/use-cart";
import AdminProductsPage from "./pages/admin/products/ProductsPage";
import RegisterPage from "./pages/register";
import { AuthProvider } from "./context/AuthContext.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomePage/>,
  },
  {
    path: "/login",
    element: <LoginForm />,
  },
  {
    path: "/register",
    element: <RegisterPage />
  },
  {
    path: "/unauthorized",
    element: <UnauthorizedPage />,
  },
  {
    element: <PrivateRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          {
            path: "/dashboard",
            element: <DashboardPage />,
          },
          {
            path: "/admin/dashboard",
            element: (
              <RoleRoute requiredRole="admin">
                <AdminDashboardPage />
              </RoleRoute>
            ),
          },
          {
            path: "/admin/products",
            element: (
              <RoleRoute requiredRole="admin">
                <AdminProductsPage />
              </RoleRoute>
            )
          }
        ],
      },
    ],
  },
]);

function App() {
  return (
    <>
      <AuthProvider>
        <CartProvider>
        <RouterProvider router={router} />
        </CartProvider>
      </AuthProvider>
      <Toaster />
    </>
  );
}

export default App;