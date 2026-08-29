"use client";

import { useState, useEffect } from "react";
import { OrderItem, DeliveryZone } from "@/types";
import { INITIAL_DELIVERY_ZONES } from "@/data/initialData";

const CART_STORAGE_KEY = "skandiva_cart_items";
const ZONE_STORAGE_KEY = "skandiva_selected_zone";

export const formatSEK = (amount: number): string => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
    maximumFractionDigits: 0,
  }).format(amount).replace("SEK", "kr");
};

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
    // Check if identical item already exists (same referenceId + variant/addons)
    const existingIndex = current.findIndex(
      (i) =>
        i.referenceId === item.referenceId &&
        i.selectedVariantName === item.selectedVariantName &&
        JSON.stringify(i.selectedAddons || []) === JSON.stringify(item.selectedAddons || [])
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

  getSelectedZone: (): DeliveryZone => {
    if (typeof window === "undefined") return INITIAL_DELIVERY_ZONES[0];
    try {
      const stored = localStorage.getItem(ZONE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : INITIAL_DELIVERY_ZONES[0];
    } catch {
      return INITIAL_DELIVERY_ZONES[0];
    }
  },

  setSelectedZone: (zone: DeliveryZone): void => {
    if (typeof window === "undefined") return;
    localStorage.setItem(ZONE_STORAGE_KEY, JSON.stringify(zone));
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
  const [selectedZone, setSelectedZoneState] = useState<DeliveryZone>(INITIAL_DELIVERY_ZONES[0]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  useEffect(() => {
    setItems(cartStore.getItems());
    setSelectedZoneState(cartStore.getSelectedZone());

    const unsubscribe = cartStore.subscribe(() => {
      setItems(cartStore.getItems());
      setSelectedZoneState(cartStore.getSelectedZone());
    });

    return unsubscribe;
  }, []);

  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = items.reduce((acc, item) => acc + item.totalPrice, 0);
  const deliveryFee = selectedZone.surcharge;
  const taxAmount = (subtotal + deliveryFee) * 0.2; // 25% moms of net (20% of gross)
  const totalAmount = subtotal + deliveryFee;

  return {
    items,
    itemCount,
    subtotal,
    deliveryFee,
    taxAmount,
    totalAmount,
    selectedZone,
    isDrawerOpen,
    setIsDrawerOpen,
    addItem: cartStore.addItem,
    removeItem: cartStore.removeItem,
    updateQuantity: cartStore.updateQuantity,
    clearCart: cartStore.clearCart,
    setSelectedZone: cartStore.setSelectedZone,
  };
}
