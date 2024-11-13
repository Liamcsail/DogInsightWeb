import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // TODO: 实际项目中需要：
    // 1. 清除服务器端的 session
    // 2. 将 token 加入黑名单

    // 返回成功消息
    return NextResponse.json({
      message: '登出成功'
    })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: '登出失败，请稍后重试' },
      { status: 500 }
    )
  }
}