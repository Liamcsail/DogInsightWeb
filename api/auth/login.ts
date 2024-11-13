import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    // TODO: 实际项目中需要：
    // 1. 验证用户输入
    // 2. 检查数据库中的用户信息
    // 3. 验证密码
    // 4. 生成 JWT token

    // 模拟登录成功
    if (email && password) {
      return NextResponse.json({
        user: {
          id: '1',
          name: '张三',
          email: email,
          avatar: '/avatars/default.jpg'
        },
        token: 'mock_jwt_token'
      })
    }

    return NextResponse.json(
      { message: '邮箱或密码错误' },
      { status: 401 }
    )
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: '登录失败，请稍后重试' },
      { status: 500 }
    )
  }
}