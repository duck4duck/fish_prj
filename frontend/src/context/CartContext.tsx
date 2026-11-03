import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Fish, CartItem } from '../types/fish';

interface CartContextType {
  cart: CartItem[];
  addToCart: (fish: Fish, quantity?: number) => void;
  removeFromCart: (fishId: number) => void;
  updateQuantity: (fishId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  selectedFishForModal: Fish | null;
  setSelectedFishForModal: (fish: Fish | null) => void;
  aquariumFish: Fish[];
  toggleAquariumFish: (fish: Fish) => void;
  removeAquariumFish: (fishId: number) => void;
  clearAquarium: () => void;
  isCompatibilityOpen: boolean;
  setIsCompatibilityOpen: (open: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aquavibe_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [aquariumFish, setAquariumFish] = useState<Fish[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCompatibilityOpen, setIsCompatibilityOpen] = useState(false);
  const [selectedFishForModal, setSelectedFishForModal] = useState<Fish | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem('aquavibe_cart', JSON.stringify(cart));
    } catch (e) {
      console.error(e);
    }
  }, [cart]);

  const addToCart = (fish: Fish, quantity = 1) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.fish.id === fish.id);
      if (existing) {
        return prev.map((item) =>
          item.fish.id === fish.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { fish, quantity }];
    });
  };

  const removeFromCart = (fishId: number) => {
    setCart((prev) => prev.filter((item) => item.fish.id !== fishId));
  };

  const updateQuantity = (fishId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(fishId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.fish.id === fishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => setCart([]);

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => {
    const price = item.fish.discount_price || item.fish.price;
    return sum + price * item.quantity;
  }, 0);

  const toggleAquariumFish = (fish: Fish) => {
    setAquariumFish((prev) => {
      const exists = prev.some((f) => f.id === fish.id);
      if (exists) {
        return prev.filter((f) => f.id !== fish.id);
      }
      if (prev.length >= 6) {
        alert('You can add up to 6 species to the virtual tank simulator.');
        return prev;
      }
      return [...prev, fish];
    });
  };

  const removeAquariumFish = (fishId: number) => {
    setAquariumFish((prev) => prev.filter((f) => f.id !== fishId));
  };

  const clearAquarium = () => setAquariumFish([]);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
        selectedFishForModal,
        setSelectedFishForModal,
        aquariumFish,
        toggleAquariumFish,
        removeAquariumFish,
        clearAquarium,
        isCompatibilityOpen,
        setIsCompatibilityOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
