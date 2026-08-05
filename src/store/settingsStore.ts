import { create } from "zustand";
import { persist } from "zustand/middleware";
import { SettingsPageData } from "@/types/settings.types";

interface SettingsState {
    settings: SettingsPageData | null;
    setSettings: (settings: SettingsPageData) => void;
}

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set, get) => ({
            settings: null,
            setSettings: (settings) => set({ settings })
        }),
        {
            name: "settings-storage",
        }
    )
);
