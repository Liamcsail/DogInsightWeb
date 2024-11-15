import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { successResponse, errorResponse } from "../utils";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 获取当前用户，用于日志记录
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error for user:", user?.id, error);
      return errorResponse(error.message, 500);
    }

    // 记录成功登出
    console.log("User successfully logged out:", user?.id);

    return successResponse({
      message: "登出成功"
    });
  } catch (error) {
    console.error("Logout error:", error);
    return errorResponse("登出失败，请稍后重试", 500);
  }
}