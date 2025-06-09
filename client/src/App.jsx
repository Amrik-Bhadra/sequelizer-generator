import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider } from "./contexts/ThemeContext";
import { AuthContextProvider } from "./contexts/AuthContext";
import AuthLayout from "./layouts/AuthLayout";
import Login from "../src/pages/auth/Login";
import Registration from "../src/pages/auth/Registration";
import ForgotPassword from "../src/pages/auth/ForgotPassword";
import ResetPassword from "../src/pages/auth/ResetPassword";
import VerifyOTP from "../src/pages/auth/VerifyOTP";
import UserLayout from "./layouts/UserLayout";
import Dashboard from "./pages/main/Dashboard";
import Models from "./pages/main/GenerateModel"
import LandingPage from "./pages/LandingPage";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage/>,
      handle: {title: "Sequelizer"}
    },
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
          handle: { title: "Login | Sequelizer" },
        },
        {
          path: "registration",
          element: <Registration />,
          handle: { title: "Register | Sequelizer" },
        },
        {
          path: "forgotpassword",
          element: <ForgotPassword />,
          handle: { title: "Forgot Password | Sequelizer" },
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
          handle: { title: "Reset Password | Sequelizer" },
        },
        {
          path: "verifyotp",
          element: <VerifyOTP />,
          handle: { title: "Verify OTP | Sequelizer" },
        },
      ],
    },
    {
      path: "/seq",
      element: <UserLayout/>,
      children: [
        {
          path: "dashboard",
          element: <Dashboard/>,
          handle: { title: "Dashboard | Sequeelizer" },
        },
        {
          path: "models",
          element: <Models/>,
          handle: { title: "Models Generation | Sequeelizer" },
        }
      ]
    }
  ]);

  return (
    <>
      <AuthContextProvider>
        <ThemeContextProvider>
          <Toaster position="top-center" />
          <RouterProvider router={routes} />
        </ThemeContextProvider>
      </AuthContextProvider>
    </>
  );
}
