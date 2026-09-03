"use client";

import { useState, useEffect } from "react";
import { OrderItem } from "@/types";

const CART_STORAGE_KEY = "skandiva_cart_items";

// Global event emitter for synchronized reactive cart
type Listener = () => void;
const listeners: Set<Listener> = new Set();

const emitChange = () => {
  listeners.forEach((listener) => listener());
};

export const cartStore = {
  getItems: (): OrderItem[] => {
    if (typeof window === "undefined") return [];
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  },

  addItem: (item: OrderItem): void => {
    if (typeof window === "undefined") return;
    const current = cartStore.getItems();
    const existingIndex = current.findIndex(
      (i) =>
        i.referenceId === item.referenceId &&
          i.selectedMaterial === item.selectedMaterial
    );

    if (existingIndex > -1) {
      current[existingIndex].quantity += item.quantity;
      current[existingIndex].totalPrice = current[existingIndex].quantity * current[existingIndex].unitPrice;
    } else {
      current.push(item);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current));
    emitChange();
  },

  removeItem: (itemId: string): void => {
    if (typeof window === "undefined") return;
    const current = cartStore.getItems().filter((i) => i.id !== itemId);
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current));
    emitChange();
  },

  updateQuantity: (itemId: string, quantity: number): void => {
    if (typeof window === "undefined") return;
    if (quantity <= 0) {
      cartStore.removeItem(itemId);
      return;
    }
    const current = cartStore.getItems();
    const target = current.find((i) => i.id === itemId);
    if (target) {
      target.quantity = quantity;
      target.totalPrice = target.unitPrice * quantity;
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(current));
      emitChange();
    }
  },

  clearCart: (): void => {
    if (typeof window === "undefined") return;
    localStorage.removeItem(CART_STORAGE_KEY);
    emitChange();
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useCart() {
  const [items, setItems] = useState<OrderItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [taxEnabled, setTaxEnabled] = useState(true);
  const [taxRate, setTaxRate] = useState(0.25);

  useEffect(() => {
    setItems(cartStore.getItems());
    fetch("/api/settings").then((response) => response.json()).then((data) => {
      if (data.success) {
        setTaxEnabled(data.data.taxEnabled);
        setTaxRate(data.data.taxRate);
      }
    }).catch(() => undefined);

    const unsubscribe = cartStore.subscribe(() => {
      setItems(cartStore.getItems());
    });

    return unsubscribe;
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  // 25% Swedish VAT included in price (20% of gross = the tax portion)
  const taxAmount = taxEnabled ? Math.round(subtotal * (taxRate / (1 + taxRate))) : 0;
  const totalAmount = subtotal;

  return {
    items,
    itemCount,
    subtotal,
    taxAmount,
    totalAmount,
    taxEnabled,
    taxRate,
    isDrawerOpen,
    setIsDrawerOpen,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
  };
}
