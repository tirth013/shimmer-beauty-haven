import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OtpVerification from "./pages/OtpVerification";
import ResetPassword from "./pages/ResetPassword";
import Shop from "./pages/Shop";
import Skincare from "./pages/Skincare";
import Makeup from "./pages/Makeup";
import Fragrance from "./pages/Fragrance";
import About from "./pages/About";
import Profile from "./pages/Profile";
import AdminRoute from "./AdminRoute";
import CategoryAdmin from "./pages/CategoryAdmin";
import UploadProduct from "./pages/UploadProduct";
import ProductAdmin from "./pages/ProductAdmin";
import CategoryProductsPage from "./pages/CategoryProductsPage"; // Import the new page

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/skincare" element={<Skincare />} />
            <Route path="/makeup" element={<Makeup />} />
            <Route path="/fragrance" element={<Fragrance />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/otp-verification" element={<OtpVerification />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* New route for displaying products of a specific category */}
            <Route path="/category/:categoryId" element={<CategoryProductsPage />} />

            {/* Admin Routes */}
            <Route path="/admin/categories" element={<AdminRoute><CategoryAdmin /></AdminRoute>} />
            <Route path="/admin/products/upload" element={<AdminRoute><UploadProduct /></AdminRoute>} />
            <Route path="/admin/products" element={<AdminRoute><ProductAdmin /></AdminRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
