import API_ROUTES from "@/lib/api/routes";
import type {
    Activity,
    AuthSession,
    ChangePasswordSchema,
    ForgotSchema,
    LoginSchema,
    Profile,
    ResetPasswordSchema,
    UpdateProfileSchema,
} from "@/lib/schemas";
import { api } from "./client";

export const login = async (payload: LoginSchema) => {
    return api.post<Profile>(API_ROUTES.AUTH_LOGIN, payload);
};

export const logout = async () => {
    return api.post(API_ROUTES.AUTH_LOGOUT);
};

export const forgotPassword = async (payload: ForgotSchema) => {
    return api.post(API_ROUTES.AUTH_FORGOT_PASSWORD, payload);
};

export const resetPassword = async (payload: ResetPasswordSchema) => {
    return api.post(API_ROUTES.AUTH_RESET_PASSWORD, payload);
};

export const setPassword = async (payload: ResetPasswordSchema) => {
    return api.post(API_ROUTES.AUTH_SET_PASSWORD, payload);
};

export const refreshToken = async () => {
    return api.post(API_ROUTES.AUTH_REFRESH, {});
};

export const me = async (): Promise<Profile | undefined> => {
    return api.get<Profile>(API_ROUTES.AUTH_ME);
};

export const updateProfile = async (payload: UpdateProfileSchema) => {
    return api.post(API_ROUTES.AUTH_UPDATE_PROFILE, payload);
};

export const changePassword = async (payload: ChangePasswordSchema) => {
    return api.post(API_ROUTES.AUTH_CHANGE_PASSWORD, payload);
};

export const getActivities = async (): Promise<Activity[]> => {
    const data = await api.get<Activity[]>(API_ROUTES.AUTH_ACTIVITIES);
    return data ?? [];
};

export const getSessions = async (): Promise<AuthSession[]> => {
    const data = await api.get<AuthSession[]>(API_ROUTES.AUTH_SESSIONS);
    return data ?? [];
};

export const revokeSession = async (sessionId: string) => {
    return api.delete(API_ROUTES.AUTH_SESSIONS + `/${sessionId}`);
};

export const logoutAllDevices = async () => {
    return api.post(API_ROUTES.AUTH_LOGOUT_ALL);
};
