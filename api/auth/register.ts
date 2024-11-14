// api/auth/register.ts
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // 输入验证
    if (!email || !password) {
      return NextResponse.json(
        { message: "请提供有效的邮箱和密码" },
        { status: 400 },
      );
    }

    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: "请提供有效的邮箱地址" },
        { status: 400 },
      );
    }

    // 验证密码强度
    if (password.length < 6) {
      return NextResponse.json(
        { message: "密码长度至少为6位" },
        { status: 400 },
      );
    }

    // 创建 Supabase 客户端
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 检查邮箱是否已注册
    const { data: existingUser } = await supabase
      .from("users")
      .select("email")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({ message: "该邮箱已被注册" }, { status: 400 });
    }

    // 注册新用户
    const { data: authData, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name || email.split("@")[0], // 如果没有提供名字，使用邮箱前缀
        },
      },
    });

    if (signUpError) {
      console.error("Sign up error:", signUpError);
      return NextResponse.json(
        { message: signUpError.message },
        { status: 400 },
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { message: "注册失败，请稍后重试" },
        { status: 500 },
      );
    }

    // 创建用户资料
    const { error: profileError } = await supabase.from("users").insert([
      {
        id: authData.user.id,
        email: email,
        name: name || email.split("@")[0],
        avatar_url: null,
      },
    ]);

    if (profileError) {
      console.error("Profile creation error:", profileError);
      // 虽然资料创建失败，但用户已创建，所以返回成功
      return NextResponse.json({
        message: "注册成功，但用户资料创建失败",
        user: {
          id: authData.user.id,
          email: authData.user.email,
        },
      });
    }

    // 返回成功响应
    return NextResponse.json({
      message: "注册成功，请查收验证邮件",
      user: {
        id: authData.user.id,
        email: authData.user.email,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "注册失败，请稍后重试" },
      { status: 500 },
    );
  }
}
