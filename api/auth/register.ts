import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { RegisterRequest, AuthResponse } from "./types";
import { successResponse, errorResponse } from "../utils";

// 密码验证规则
const PASSWORD_RULES = {
  minLength: 8,
  requireNumber: true,
  requireLetter: true,
  requireSpecialChar: true,
};

// 验证密码强度
function validatePassword(password: string): {
  isValid: boolean;
  message: string;
} {
  if (password.length < PASSWORD_RULES.minLength) {
    return {
      isValid: false,
      message: `密码长度至少为${PASSWORD_RULES.minLength}位`,
    };
  }

  if (PASSWORD_RULES.requireNumber && !/\d/.test(password)) {
    return { isValid: false, message: "密码必须包含数字" };
  }

  if (PASSWORD_RULES.requireLetter && !/[a-zA-Z]/.test(password)) {
    return { isValid: false, message: "密码必须包含字母" };
  }

  if (
    PASSWORD_RULES.requireSpecialChar &&
    !/[!@#$%^&*(),.?":{}|<>]/.test(password)
  ) {
    return { isValid: false, message: "密码必须包含特殊字符" };
  }

  return { isValid: true, message: "" };
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, name }: RegisterRequest = await request.json();

    // 输入验证
    if (!email || !password) {
      return errorResponse("请提供邮箱和密码", 400);
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return errorResponse("请提供有效的邮箱地址", 400);
    }

    // 验证密码强度
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      return errorResponse(passwordValidation.message, 400);
    }

    // 创建 Supabase 客户端
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 检查邮箱是否已注册
    const { data: existingUser } = await supabase
      .from("user_profiles")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return errorResponse("该邮箱已被注册", 400);
    }

    // 注册新用户
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0],
        },
      },
    });

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return errorResponse(signUpError.message, 400);
    }

    if (!authData.user) {
      return errorResponse("注册失败，请稍后重试", 500);
    }

    // 创建用户资料
    const userProfile = {
      id: authData.user.id,
      email: email,
      name: name || email.split("@")[0],
      avatar_url: null,
    };

    const { error: profileError } = await supabase
      .from("user_profiles")
      .insert([userProfile]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // 虽然资料创建失败，但用户已创建，返回部分成功响应
      const response: AuthResponse = {
        message: "注册成功，但用户资料创建失败",
        user: {
          id: authData.user.id,
          email: authData.user.email!,
          name: name || email.split("@")[0],
          avatar_url: null,
        },
      };
      return successResponse(response);
    }

    // 返回成功响应
    const response: AuthResponse = {
      message: "注册成功，请查收验证邮件",
      user: userProfile,
    };

    return successResponse(response);
  } catch (error) {
    console.error("Registration error:", error);
    return errorResponse("注册失败，请稍后重试", 500);
  }
}
