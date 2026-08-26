import { useMutation, useQueryClient } from "@tanstack/react-query";
import authFetch from "./authfetch";

interface LoginCredentials {
  username: string;
  password: string;
}

interface AuthResponse {
  success: boolean;
  message: string;
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    username: string;
    email: string;
    createdAt: string;
  };
}

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const res = await authFetch.post<AuthResponse>("/auth/login", {
        usernameOrEmail: credentials.username,
        password: credentials.password,
      });

      return res.data;
    },

    onSuccess: (data) => {
      if (data && data.success && data.accessToken && data.refreshToken) {
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
        if (data.user) {
          localStorage.setItem("user", JSON.stringify(data.user));
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
    },
  });
};

