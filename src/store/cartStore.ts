import { create } from "zustand";
import { persist } from "zustand/middleware";

import type { CartList, CartItem, Variant } from "@/types/products.types";

interface CartState {
    cart: CartList | null;
    setCart: (cart: CartList) => void;
    addItem: (item: CartItem) => void;
    updateItem: (cartItem: CartItem) => void;
    updateItemQuantity: (itemId: number, quantity: number) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            cart: null,

            setCart: (cart) => set({ cart }),

            addItem: (item) => {
                const state = get();
                if (!state.cart) return;

                const exists = state.cart.items.find((i) => i.id === item.id);

                let updatedItems;
                if (exists) {
                    updatedItems = state.cart.items.map((i) =>
                        i.id === item.id
                            ? {
                                ...i,
                                quantity: i.quantity + 1,
                                subtotal: (i.quantity + 1) * i.variant.price,
                            }
                            : i
                    );
                } else {
                    updatedItems = [
                        ...state.cart.items,
                        {
                            ...item,
                            quantity: 1,
                            subtotal: item.variant.price,
                        },
                    ];
                }

                const total_price = updatedItems.reduce(
                    (s, p) => s + p.subtotal,
                    0
                );

                set({
                    cart: {
                        ...state.cart,
                        items: updatedItems,
                        total_price,
                    },
                });
            },
            updateItem: (cartItem: CartItem) => {
                const state = get();
                if (!state.cart) return;

                const updatedItems = state.cart.items.map((i) =>
                    i.id === cartItem.id ? cartItem : i
                );

                const total_price = updatedItems.reduce(
                    (s, p) => s + p.subtotal,
                    0
                );

                set({
                    cart: {
                        ...state.cart,
                        items: updatedItems,
                        total_price,
                    },
                });
            },

            updateItemQuantity: (itemId, quantity) => {
                const state = get();
                if (!state.cart) return;

                const updatedItems = state.cart.items.map((i) => {
                    if (i.id === itemId) {
                        return {
                            ...i,
                            quantity,
                            subtotal: quantity * i.variant.price,
                        };
                    }
                    return i;
                });

                const total_price = updatedItems.reduce(
                    (s, p) => s + p.subtotal,
                    0
                );

                set({
                    cart: {
                        ...state.cart,
                        items: updatedItems,
                        total_price,
                    },
                });
            },

            removeItem: (id) => {
                const state = get();
                if (!state.cart) return;

                const updatedItems = state.cart.items.filter((i) => i.id !== id);

                const total_price = updatedItems.reduce(
                    (s, p) => s + p.subtotal,
                    0
                );

                set({
                    cart: {
                        ...state.cart,
                        items: updatedItems,
                        total_price,
                    },
                });
            },

            clearCart: () => set({ cart: null }),
        }),
        {
            name: "cart-storage",
        }
    )
);
