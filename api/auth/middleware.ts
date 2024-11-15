// middleware.ts
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// 需要认证的路由配置
const protectedPaths = {
  // API 路由
  api: [
    "/api/identify",
    "/api/breeds",
    "/api/posts",
    "/api/user",
    "/api/upload",
  ],
  // 页面路由
  pages: [
    "/dashboard",
    "/identify",
    "/profile",
    "/square/post", // 发帖需要登录
  ],
};

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });

  // 获取当前session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // 获取请求路径
  const path = req.nextUrl.pathname;

  // 检查是否是受保护的API路由
  const isProtectedApiRoute = protectedPaths.api.some((route) =>
    path.startsWith(route),
  );

  // 检查是否是受保护的页面路由
  const isProtectedPageRoute = protectedPaths.pages.some((route) =>
    path.startsWith(route),
  );

  // 如果是受保护的API路由且未登录,返回401
  if (isProtectedApiRoute && !session) {
    return NextResponse.json(
      { error: "Unauthorized", message: "请先登录" },
      { status: 401 },
    );
  }

  // 如果是受保护的页面路由且未登录,重定向到登录页
  if (isProtectedPageRoute && !session) {
    // 保存原始URL,登录后可以跳转回来
    const redirectUrl = new URL("/login", req.url);
    redirectUrl.searchParams.set("redirectTo", path);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// 配置需要执行中间件的路由
export const config = {
  matcher: [
    // API routes
    "/api/:path*",
    // Protected pages
    "/dashboard/:path*",
    "/identify/:path*",
    "/profile/:path*",
    "/square/post/:path*",
  ],
};
