import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { LoginRequest, AuthResponse } from "./types";
import { successResponse, errorResponse } from "../utils";

export async function POST(request: NextRequest) {
  try {
    const { email, password }: LoginRequest = await request.json();

    // 输入验证
    if (!email || !password) {
      return errorResponse("请提供邮箱和密码", 400);
    }

    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return errorResponse(error.message, 401);
    }

    // 获取用户详细信息
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select("*")
      .eq("id", data.user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
    }

    const response: AuthResponse = {
      message: "登录成功",
      user: profile || {
        id: data.user.id,
        email: data.user.email!,
        name: data.user.user_metadata?.name || data.user.email!.split("@")[0],
        avatar_url: data.user.user_metadata?.avatar_url || null,
      },
      session: data.session,
    };

    return successResponse(response);
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse("登录失败，请稍后重试", 500);
  }
}
