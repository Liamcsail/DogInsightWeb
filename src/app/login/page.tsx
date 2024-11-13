'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Mail, Apple } from 'lucide-react'
import { api } from '@/lib/api'
import { storage } from '@/lib/storage'
import { isValidEmail } from '@/lib/utils'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (searchParams.get('registered') === 'true') {
      setSuccess('注册成功！请登录。')
    }
  }, [searchParams])

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    // 表单验证
    if (!email || !password) {
      setError('请填写邮箱和密码')
      setIsLoading(false)
      return
    }

    if (!isValidEmail(email)) {
      setError('请输入有效的邮箱地址')
      setIsLoading(false)
      return
    }

    try {
      const response = await api.auth.login(email, password)

      // 保存用户信息和token
      storage.token.set(response.token)
      storage.user.set(response.user)

      // 跳转到仪表板
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : '登录失败，请稍后重试')
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    // TODO: 实现Google登录
    console.log('Google login')
  }

  const handleAppleLogin = () => {
    // TODO: 实现Apple登录
    console.log('Apple login')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">登录 DogInsight</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailLogin}>
            <div className="space-y-4">
              {success && (
                <Alert>
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button 
                type="submit" 
                className="w-full"
                disabled={isLoading}
              >
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? '登录中...' : '邮箱登录'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="space-y-2">
              <Button 
                onClick={handleGoogleLogin} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google 登录
              </Button>
              <Button 
                onClick={handleAppleLogin} 
                variant="outline" 
                className="w-full"
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple 登录
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            还没有账号？ <Link href="/register" className="text-primary hover:underline">注册</Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}