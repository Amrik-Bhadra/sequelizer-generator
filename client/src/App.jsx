import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ThemeContextProvider, AuthContextProvider } from "./contexts";
import AuthLayout from "./layouts/AuthLayout";
import Login from "../src/pages/auth/Login";
import Registration from "../src/pages/auth/Registration";
import ForgotPassword from "../src/pages/auth/ForgotPassword";
import ResetPassword from "../src/pages/auth/ResetPassword";
import VerifyOTP from "../src/pages/auth/VerifyOTP";

export default function App() {
  const routes = createBrowserRouter([
    {
      path: "/auth",
      element: <AuthLayout />,
      children: [
        {
          path: "login",
          element: <Login />,
          handle: { title: "Login | Sequeelizer" },
        },
        {
          path: "registration",
          element: <Registration />,
          handle: { title: "Register | Sequeelizer" },
        },
        {
          path: "forgotpassword",
          element: <ForgotPassword />,
          handle: { title: "Forgot Password | Sequeelizer" },
        },
        {
          path: "resetpassword",
          element: <ResetPassword />,
          handle: { title: "Reset Password | Sequeelizer" },
        },
        {
          path: "verifyotp",
          element: <VerifyOTP />,
          handle: { title: "Verify OTP | Sequeelizer" },
        },
      ],
    },
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
