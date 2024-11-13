import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // TODO: 实际项目中需要：
    // 1. 从请求头获取 JWT token
    // 2. 验证 token
    // 3. 从数据库获取用户信息

    // 获取 Authorization 头
    const authorization = request.headers.get('Authorization')

    if (!authorization || !authorization.startsWith('Bearer ')) {
      return NextResponse.json(
        { message: '未授权' },
        { status: 401 }
      )
    }

    // 模拟已登录用户信息
    return NextResponse.json({
      id: '1',
      name: '张三',
      email: 'zhangsan@example.com',
      avatar: '/avatars/default.jpg'
    })
  } catch (error) {
    console.error('Get user info error:', error)
    return NextResponse.json(
      { message: '获取用户信息失败' },
      { status: 500 }
    )
  }
}