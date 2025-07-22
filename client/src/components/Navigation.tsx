import { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingBag, Search, Menu, X, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import UserDropdown from "@/components/UserDropdown";
import SearchDropdown from './ui/SearchDropdown';
import { useCart } from "@/contexts/CartContext";
import { useAuth } from '@/contexts/AuthContext';
import Axios from '@/utils/Axios';
import SummaryApi from "@/common/summaryApi";
import { Skeleton } from "@/components/ui/skeleton"; 

interface Category {
  _id: string;
  name: string;
  slug: string;
}
interface NavItem {
    name: string;
    href: string;
}

const Navigation = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [navItems, setNavItems] = useState<NavItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toggleCart, cartCount } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true);
      try {
        const response = await Axios.get(`${SummaryApi.getAllCategories.url}?parent=main`);
        
        if (response.data.success && Array.isArray(response.data.data)) {
          const dynamicCategories: NavItem[] = response.data.data.map((cat: Category) => ({
            name: cat.name,
            href: `/category/${cat.slug}`,
          }));
          
          setNavItems([
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            ...dynamicCategories,
            { name: "About Us", href: "/about" },
          ]);
        } else {
            setNavItems([
                { name: "Home", href: "/" },
                { name: "Shop", href: "/shop" },
                { name: "About Us", href: "/about" },
            ]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        // On error, fall back to the static items to prevent a crash
        setNavItems([
            { name: "Home", href: "/" },
            { name: "Shop", href: "/shop" },
            { name: "About Us", href: "/about" },
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <nav className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="font-playfair text-2xl font-bold text-primary">
            Shimmer
          </Link>

          <div className="hidden md:flex items-center space-x-8">
            {isLoading ? (
                // Show skeleton loaders while categories are being fetched
                <>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                </>
            ) : (
                navItems.map((item) => (
                  <NavLink
                    key={item.href} // Use href for a more stable key
                    to={item.href}
                    className={({ isActive }) =>
                      cn(
                        "text-foreground hover:text-primary transition-colors font-medium",
                        isActive ? "text-primary" : ""
                      )
                    }
                  >
                    {item.name}
                  </NavLink>
                ))
            )}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSearchOpen(true)}>
                <Search className="h-5 w-5" />
              </Button>
              <SearchDropdown open={searchOpen} onClose={() => setSearchOpen(false)} />
            </div>
            <UserDropdown />
            <Link to="/wishlist">
              <Button variant="ghost" size="icon">
                <Heart className="h-5 w-5" />
              </Button>
            </Link>
            <Button variant="ghost" size="icon" className="relative" onClick={toggleCart}>
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <div className={cn(
          "md:hidden transition-all duration-300 ease-in-out overflow-hidden",
          isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        )}>
          <div className="py-4 space-y-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="block text-foreground hover:text-primary transition-colors font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="pt-4 border-t">
              <Button variant="ghost" className="w-full justify-start" onClick={() => { setSearchOpen(true); setIsMenuOpen(false); }}>
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
