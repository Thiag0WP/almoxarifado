import { createContext, useContext, useState } from "react";

export type CartItem = {
  itemId: number;
  nome: string;
  unidade: string;
  quantidade: number;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  updateQty: (itemId: number, quantidade: number) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addItem(novo: CartItem) {
    setItems((prev) => {
      const existente = prev.find((i) => i.itemId === novo.itemId);

      if (existente) {
        return prev.map((i) =>
          i.itemId === novo.itemId
            ? { ...i, quantidade: i.quantidade + novo.quantidade }
            : i
        );
      }

      return [...prev, novo];
    });
  }

  function updateQty(itemId: number, quantidade: number) {
    setItems((prev) =>
      prev.map((i) => (i.itemId === itemId ? { ...i, quantidade } : i))
    );
  }

  function removeItem(itemId: number) {
    setItems((prev) => prev.filter((i) => i.itemId !== itemId));
  }

  function clearCart() {
    setItems([]);
  }

  return (
    <CartContext.Provider
      value={{ items, addItem, updateQty, removeItem, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart fora do CartProvider");
  return ctx;
}
