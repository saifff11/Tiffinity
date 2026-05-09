import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

// Components
import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";
import Landing from "./pages/misc/Landing";
import ResetRoute from "./components/ResetRoute";
import BannedPage from "./pages/misc/BannedPage";
import HowItWorks from "./pages/misc/HowItWorks";
// import HelpCenter from "./pages/misc/HelpCenter";
import Footer from "./components/Footer";
import Policy from "./pages/misc/Policy";
import TermsAndConditions from "./pages/misc/TermsAndConditions";
import FixMyItchPage from "./pages/misc/FixMyItchPage";

// Auth Pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyOTP from "./pages/auth/VerifyOTP";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Customer Pages
import Home from "./pages/customer/Home";
import CookPublicProfile from "./pages/customer/CookPublicProfile";
import PlaceOrder from "./pages/customer/PlaceOrder";
import OrderHistory from "./pages/customer/OrderHistory";

// Cook Pages
import CookProfileSetup from "./pages/cook/CookProfileSetup";
import CookDashboard from "./pages/cook/CookDashboard";
import PostMenu from "./pages/cook/PostMenu";
import CookOrders from "./pages/cook/CookOrders";

// Admin Pages
import AdminDashboard from "./pages/admin/AdminDashboard";
import PendingCooks from "./pages/admin/PendingCooks";
import UserDetails from "./pages/admin/UserDetails";

// 404
import NotFound from "./pages/misc/NotFound";

const PAGE_TITLES = {
  "/": "TiffinBox | Fresh Home Meals",
  "/how-it-works": "How It Works | TiffinBox",
  "/policy": "Privacy Policy | TiffinBox",
  "/terms-and-conditions": "Terms & Conditions | TiffinBox",
  "/banned": "Account Restricted | TiffinBox",
  "/login": "Login | TiffinBox",
  "/register": "Register | TiffinBox",
  "/forgot-password": "Forgot Password | TiffinBox",
  "/verify-otp": "Verify OTP | TiffinBox",
  "/reset-password": "Reset Password | TiffinBox",
  "/home": "Home | TiffinBox",
  "/orders/place": "Place Order | TiffinBox",
  "/orders/my": "My Orders | TiffinBox",
  "/cook/setup": "Cook Profile Setup | TiffinBox",
  "/cook/dashboard": "Cook Dashboard | TiffinBox",
  "/cook/post-menu": "Post Menu | TiffinBox",
  "/cook/orders": "Cook Orders | TiffinBox",
  "/admin/dashboard": "Admin Dashboard | TiffinBox",
  "/admin/pending-cooks": "Pending Cooks | TiffinBox",
};

function TitleManager() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname.startsWith("/cook/")) {
      document.title = "Cook Profile | TiffinBox";
      return;
    }

    if (pathname.startsWith("/admin/users/")) {
      document.title = "User Details | TiffinBox";
      return;
    }

    document.title = PAGE_TITLES[pathname] || "TiffinBox";
  }, [pathname]);

  return null;
}

function App() {
  return (
    <BrowserRouter>
      <TitleManager />
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/how-it-works' element={<HowItWorks />} />
        {/* <Route path='/help-center' element={<HelpCenter />} /> */}
        <Route path='/policy' element={<Policy />} />
        <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
        <Route path="/fix-my-itch" element={<FixMyItchPage />} />

        {/* ── Banned Route ── */}
        <Route path='/banned' element={<BannedPage />} />

        {/* ── Guest Only Routes (redirect if logged in) ── */}
        <Route
          path='/login'
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route
          path='/register'
          element={
            <GuestRoute>
              <Register />
            </GuestRoute>
          }
        />
        <Route
          path='/forgot-password'
          element={
            <GuestRoute>
              <ForgotPassword />
            </GuestRoute>
          }
        />

        {/* ── Reset Password Routes (only accessible if reset flow is initiated) ── */}
        <Route
          path='/verify-otp'
          element={
            <ResetRoute>
              <VerifyOTP />
            </ResetRoute>
          }
        />
        <Route
          path='/reset-password'
          element={
            <ResetRoute>
              <ResetPassword />
            </ResetRoute>
          }
        />

        {/* ── Customer Routes ── */}
        <Route
          path='/home'
          element={
            <ProtectedRoute roles={["customer"]}>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cook/:id'
          element={
            <ProtectedRoute roles={["customer"]}>
              <CookPublicProfile />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders/place'
          element={
            <ProtectedRoute roles={["customer"]}>
              <PlaceOrder />
            </ProtectedRoute>
          }
        />
        <Route
          path='/orders/my'
          element={
            <ProtectedRoute roles={["customer"]}>
              <OrderHistory />
            </ProtectedRoute>
          }
        />

        {/* ── Cook Routes ── */}
        <Route
          path='/cook/setup'
          element={
            <ProtectedRoute roles={["cook"]}>
              <CookProfileSetup />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cook/dashboard'
          element={
            <ProtectedRoute roles={["cook"]}>
              <CookDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cook/post-menu'
          element={
            <ProtectedRoute roles={["cook"]}>
              <PostMenu />
            </ProtectedRoute>
          }
        />
        <Route
          path='/cook/orders'
          element={
            <ProtectedRoute roles={["cook"]}>
              <CookOrders />
            </ProtectedRoute>
          }
        />

        {/* ── Admin Routes ── */}
        <Route
          path='/admin/dashboard'
          element={
            <ProtectedRoute roles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/pending-cooks'
          element={
            <ProtectedRoute roles={["admin"]}>
              <PendingCooks />
            </ProtectedRoute>
          }
        />
        <Route
          path='/admin/users/:id'
          element={
            <ProtectedRoute roles={["admin"]}>
              <UserDetails />
            </ProtectedRoute>
          }
        />
        {/* ── 404 ── */}
        <Route path='*' element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
