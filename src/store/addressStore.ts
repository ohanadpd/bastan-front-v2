import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Address } from "@/types/accounts.types";

interface AddressState {
    addresses: Address[] | null;
    setAddresses: (address: Address[]) => void;
    removeItem: (id: number) => void;
}

export const useAddressStore = create<AddressState>()(
    persist(
        (set, get) => ({
            addresses: null,
            setAddresses: (addresses) => set({ addresses }),

            removeItem: (id) => {
                const state = get();
                if (!state.addresses) return;

                const updatedItems = state.addresses.filter((i) => i.id !== id);

                set({ addresses: updatedItems });
            },

        }),
        {
            name: "address-storage",
        }
    )
);
