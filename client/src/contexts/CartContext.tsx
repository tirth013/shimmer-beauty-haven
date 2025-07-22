import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { toast } from "@/hooks/use-toast";
import Axios from '@/utils/Axios';
import SummaryApi from '@/common/summaryApi';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  isCartOpen: boolean;
  toggleCart: () => void;
  cartCount: number;
  fetchUserCart: () => Promise<void>;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Always clear cart on logout event
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  // Listen for logout event to clear cart
  useEffect(() => {
    window.addEventListener('logoutStateChange', clearCart);
    return () => window.removeEventListener('logoutStateChange', clearCart);
  }, [clearCart]);

  // Fetch user cart from backend
  const fetchUserCart = async () => {
    try {
      const response = await Axios.get(SummaryApi.getCart.url);
      if (response.data.success) {
        const serverCart = response.data.data.map((item: any) => ({
          id: item.productId._id,
          name: item.productId.name,
          price: item.productId.price,
          quantity: item.quantity,
          image: item.productId.images[0]?.url || '',
        }));
        setCartItems(serverCart);
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Failed to fetch user cart:", error);
      setCartItems([]);
    }
  };

  // Listen for login event to fetch user cart
  useEffect(() => {
    const handleLogin = async () => {
      await fetchUserCart();
    };
    window.addEventListener('loginStateChange', handleLogin);
    return () => window.removeEventListener('loginStateChange', handleLogin);
  }, []);

  const toggleCart = () => setIsCartOpen(prev => !prev);

  const addToCart = (item: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(i => i.id === item.id);
      if (existingItem) {
        toast({ title: "Added to cart", description: `${item.name} quantity updated.` });
        return prevItems.map(i =>
          i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i
        );
      }
      toast({ title: "Added to cart", description: `${item.name} has been added.` });
      return [...prevItems, { ...item, quantity: item.quantity || 1 }];
    });
    if (!isCartOpen) {
        toggleCart();
    }
  };

  const removeFromCart = (id: string) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== id));
    toast({ title: "Item Removed", description: "The item has been removed from your cart." });
  };

  const updateQuantity = (id: string, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const cartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        isCartOpen,
        toggleCart,
        cartCount,
        fetchUserCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};