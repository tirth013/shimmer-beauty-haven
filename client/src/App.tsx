import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";
import CartSidePanel from "@/components/CartSidePanel";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Shop from "./pages/Shop";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AdminRoute from "./AdminRoute";
import CategoryAdmin from "./pages/CategoryAdmin";
import UploadProduct from "./pages/UploadProduct";
import ProductAdmin from "./pages/ProductAdmin";
import CategoryProductsPage from "./pages/CategoryProductsPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import Wishlist from "./pages/Wishlist";
import AdminOverview from "./pages/AdminOverview";
import { AdminLayout } from "./components/Layout";

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
                    <AdminLayout />
                  </AdminRoute>
                }
              >
                <Route path="overview" element={<AdminOverview />} />
                <Route path="category" element={<CategoryAdmin />} />
                <Route path="product" element={<ProductAdmin />} />
                <Route path="product/upload" element={<UploadProduct />} />
              </Route>

              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </CartProvider>
      {/* --- END CORRECTION --- */}
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;