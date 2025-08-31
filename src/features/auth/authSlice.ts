import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../../store";

import type { User, LoginForm } from "../../models/auth";
import { login as loginApi, signup as signupApi, logout as logoutApi } from "../../services/auth";
import type { AuthPayload, SignUpForm } from "../../services/auth";

interface AuthState {
    user: User | null;
    token: string | null;
    status: "idle" | "loading" | "succeeded" | "failed";
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem("token"),
    status: "idle",
    error: null,
};

// LOGIN -> { user, token }
export const login = createAsyncThunk<AuthPayload, LoginForm, { rejectValue: string }>(
    "auth/login",
    async (form, { rejectWithValue }) => {
        try {
            const data = await loginApi(form); // { user, token }
            localStorage.setItem("token", data.token);
            return data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message ?? e?.message ?? "Giriş başarısız");
        }
    }
);

// SIGNUP -> { user, token }
export const signup = createAsyncThunk<AuthPayload, SignUpForm, { rejectValue: string }>(
    "auth/signup",
    async (form, { rejectWithValue }) => {
        try {
            const data = await signupApi(form);
            localStorage.setItem("token", data.token);
            return data;
        } catch (e: any) {
            return rejectWithValue(e?.response?.data?.message ?? e?.message ?? "Kayıt başarısız");
        }
    }
);

// LOGOUT
export const logout = createAsyncThunk("auth/logout", async () => {
    await logoutApi?.();
    localStorage.removeItem("token");
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        setUser(state, action: PayloadAction<User | null>) {
            state.user = action.payload;
        },
        setToken(state, action: PayloadAction<string | null>) {
            state.token = action.payload;
            if (action.payload) localStorage.setItem("token", action.payload);
            else localStorage.removeItem("token");
        },
    },
    extraReducers: (builder) => {
        // LOGIN
        builder.addCase(login.pending, (s) => { s.status = "loading"; s.error = null; });
        builder.addCase(login.fulfilled, (s, a) => {
            s.status = "succeeded";
            s.user = a.payload.user;
            s.token = a.payload.token;
        });
        builder.addCase(login.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Hata"; });

        // SIGNUP
        builder.addCase(signup.pending, (s) => { s.status = "loading"; s.error = null; });
        builder.addCase(signup.fulfilled, (s, a) => {
            s.status = "succeeded";
            s.user = a.payload.user;
            s.token = a.payload.token;
        });
        builder.addCase(signup.rejected, (s, a) => { s.status = "failed"; s.error = a.payload ?? "Hata"; });

        // LOGOUT
        builder.addCase(logout.fulfilled, (s) => {
            s.user = null;
            s.token = null;
            s.status = "idle";
            s.error = null;
        });
    },
});

export const { setUser, setToken } = authSlice.actions;

// Selectors
export const selectAuth = (state: RootState) => state.auth;
export const selectUser = (state: RootState) => state.auth.user;
export const selectToken = (state: RootState) => state.auth.token;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;

export default authSlice.reducer;
