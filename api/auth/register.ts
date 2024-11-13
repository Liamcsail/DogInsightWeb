import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // TODO: 实际项目中需要：
    // 1. 验证用户输入
    // 2. 检查邮箱是否已注册
    // 3. 加密密码
    // 4. 存储用户信息到数据库

    // 模拟注册过程
    if (email && password) {
      // 模拟邮箱已存在的情况
      if (email === "test@example.com") {
        return NextResponse.json(
          { message: "该邮箱已被注册" },
          { status: 400 },
        );
      }

      return NextResponse.json({
        message: "注册成功",
        user: {
          id: "1",
          email: email,
        },
      });
    }

    return NextResponse.json(
      { message: "请提供有效的邮箱和密码" },
      { status: 400 },
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { message: "注册失败，请稍后重试" },
      { status: 500 },
    );
  }
}
