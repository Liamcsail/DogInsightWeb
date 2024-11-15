import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { UserProfile } from "./types";
import { successResponse, errorResponse } from "../utils";

export async function GET(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 获取当前认证用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("未授权", 401);
    }

    // 获取用户详细信息
    const { data: profile, error: profileError } = await supabase
      .from("user_profiles")
      .select(
        `
        id,
        email,
        name,
        avatar_url,
        created_at,
        updated_at
      `,
      )
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error("Error fetching user profile:", profileError);
      return errorResponse("获取用户信息失败", 500);
    }

    if (!profile) {
      // 如果找不到profile，使用auth用户信息创建基础档案
      const basicProfile: UserProfile = {
        id: user.id,
        email: user.email!,
        name: user.user_metadata?.name || user.email!.split("@")[0],
        avatar_url: user.user_metadata?.avatar_url || null,
      };

      // 尝试创建用户档案
      const { error: insertError } = await supabase
        .from("user_profiles")
        .insert([basicProfile]);

      if (insertError) {
        console.error("Error creating user profile:", insertError);
        return errorResponse("创建用户档案失败", 500);
      }

      return successResponse(basicProfile);
    }

    return successResponse(profile);
  } catch (error) {
    console.error("Get user info error:", error);
    return errorResponse("获取用户信息失败", 500);
  }
}

// 添加更新用户信息的端点
export async function PATCH(request: NextRequest) {
  try {
    const cookieStore = cookies();
    const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

    // 获取当前用户
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return errorResponse("未授权", 401);
    }

    // 获取更新数据
    const updates = await request.json();

    // 验证更新字段
    const allowedUpdates = ["name", "avatar_url"];
    const sanitizedUpdates = Object.keys(updates)
      .filter((key) => allowedUpdates.includes(key))
      .reduce((obj, key) => ({ ...obj, [key]: updates[key] }), {});

    if (Object.keys(sanitizedUpdates).length === 0) {
      return errorResponse("没有提供有效的更新字段", 400);
    }

    // 更新用户档案
    const { data: updatedProfile, error: updateError } = await supabase
      .from("user_profiles")
      .update(sanitizedUpdates)
      .eq("id", user.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating user profile:", updateError);
      return errorResponse("更新用户信息失败", 500);
    }

    return successResponse(updatedProfile);
  } catch (error) {
    console.error("Update user info error:", error);
    return errorResponse("更新用户信息失败", 500);
  }
}
