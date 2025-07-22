import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartSidePanel from "@/components/CartSidePanel";
import React, { Suspense, lazy } from "react";

const Index = lazy(() => import("./pages/Index"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const OtpVerification = lazy(() => import("./pages/OtpVerification"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Shop = lazy(() => import("./pages/Shop"));
const About = lazy(() => import("./pages/About"));
const Profile = lazy(() => import("./pages/Profile"));
const CategoryAdmin = lazy(() => import("./pages/CategoryAdmin"));
const UploadProduct = lazy(() => import("./pages/UploadProduct"));
const ProductAdmin = lazy(() => import("./pages/ProductAdmin"));
const CategoryProductsPage = lazy(() => import("./pages/CategoryProductsPage"));
const ProductDetailPage = lazy(() => import("./pages/ProductDetailPage"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const AdminOverview = lazy(() => import("./pages/AdminOverview"));
import AdminRoute from "./AdminRoute";

const LoadingSpinner = () => (
  <div className="flex justify-center items-center h-screen">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <CartProvider>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <CartSidePanel />
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/shop" element={<Shop />} />
                <Route path="/about" element={<About />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/otp-verification" element={<OtpVerification />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/category/:slug" element={<CategoryProductsPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/wishlist" element={<Wishlist />} />

                <Route
                  path="/admin"
                  element={
                    <AdminRoute>
                      <Outlet />
                    </AdminRoute>
                  }
                >
                  <Route path="overview" element={<AdminOverview />} />
                  <Route path="category-admin" element={<CategoryAdmin />} />
                  <Route path="product-admin/upload" element={<UploadProduct />} />
                  <Route path="product-admin" element={<ProductAdmin />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
      {/* --- END CORRECTION --- */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;