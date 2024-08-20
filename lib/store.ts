
import {create, StateCreator} from "zustand"
import { User } from "@prisma/client";
import { loginUserII } from "./actions";
import { devtools, persist } from "zustand/middleware";
import { AuthStatus } from "./auth-status";

export interface AuthState {
    status: AuthStatus;
    user?: User;
    loginUser: (username: string, password: string) => Promise<void>;
    logoutUser: () => void;

  }


const storeApi: StateCreator<AuthState> = (set) => ({
    status: "unauthorized",
    user: undefined,
    loginUser: async (username: string, password: string) => {
        try {
        const user = await loginUserII(username, password);
        set({ status: "authorized",user });

        } catch (error) {
        set({ status: "unauthorized", user: undefined });

        }
    },
    logoutUser: () => {
        set({ status: "unauthorized",user: undefined });
      },
})

export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi, { name: "auth-storage" }
        ))
    );