import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AuthState {
    phone: string | null;
    otpType: 1 | 2 | null;
    forgotPasswordToken: string | null;
    setPhone: (phone: string | null) => void;
    setOtpType: (type: 1 | 2 | null) => void;
    setForgotPasswordToken: (token: string | null) => void;
    registerToken: string | null;
    setRegisterToken: (token: string | null) => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            phone: null,
            otpType: null,
            forgotPasswordToken: null,
            registerToken: null,
            setPhone: (phone) => set({ phone }),
            setOtpType: (otpType) => set({ otpType }),
            setForgotPasswordToken: (forgotPasswordToken) => set({ forgotPasswordToken }),
            setRegisterToken: (registerToken) => set({ registerToken })
        }),
        {
            name: "auth-storage",
        }
    )
);
