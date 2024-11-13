import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      // TODO: 实际项目中需要调用 API 检查登录状态
      const response = await fetch("/api/auth/me");
      if (response.ok) {
        const user = await response.json();
        setState({ user, isLoading: false, error: null });
      } else {
        setState({ user: null, isLoading: false, error: null });
      }
    } catch (error) {
      setState({
        user: null,
        isLoading: false,
        error: "Authentication failed",
      });
    }
  };

  const login = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const user = await response.json();
        setState({ user, isLoading: false, error: null });
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.message || "登录失败",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "登录失败，请稍后重试",
      }));
    }
  };

  const register = async (email: string, password: string) => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await response.json();
        setState((prev) => ({
          ...prev,
          isLoading: false,
          error: data.message || "注册失败",
        }));
      }
    } catch (error) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: "注册失败，请稍后重试",
      }));
    }
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setState({ user: null, isLoading: false, error: null });
      router.push("/login");
    } catch (error) {
      setState((prev) => ({
        ...prev,
        error: "登出失败，请稍后重试",
      }));
    }
  };

  return {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    register,
    logout,
  };
}
