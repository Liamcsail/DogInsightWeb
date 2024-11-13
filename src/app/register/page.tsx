"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Mail, Apple } from "lucide-react";
import { api } from "@/lib/api";
import { isValidEmail, checkPasswordStrength } from "@/lib/utils";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState<
    "weak" | "medium" | "strong"
  >("weak");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // 检查密码强度
    if (name === "password") {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const getPasswordStrengthColor = () => {
    switch (passwordStrength) {
      case "strong":
        return "text-green-600";
      case "medium":
        return "text-yellow-600";
      default:
        return "text-red-600";
    }
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      setError("请填写所有必填字段");
      return false;
    }

    if (!isValidEmail(formData.email)) {
      setError("请输入有效的邮箱地址");
      return false;
    }

    if (formData.password.length < 6) {
      setError("密码长度至少为6个字符");
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("两次输入的密码不匹配");
      return false;
    }

    if (passwordStrength === "weak") {
      setError("请设置更强的密码（包含大小写字母、数字和特殊字符）");
      return false;
    }

    return true;
  };

  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      await api.auth.register(formData.email, formData.password);
      router.push("/login?registered=true");
    } catch (err) {
      setError(err instanceof Error ? err.message : "注册失败，请稍后重试");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    // TODO: 实现 Google 注册
    console.log("Google register");
  };

  const handleAppleRegister = () => {
    // TODO: 实现 Apple 注册
    console.log("Apple register");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            注册 DogInsight
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleEmailRegister}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">密码</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
                {formData.password && (
                  <p className={`text-sm mt-1 ${getPasswordStrengthColor()}`}>
                    密码强度:{" "}
                    {passwordStrength === "strong"
                      ? "强"
                      : passwordStrength === "medium"
                        ? "中等"
                        : "弱"}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="confirmPassword">确认密码</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  disabled={isLoading}
                  required
                />
              </div>
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <Button type="submit" className="w-full" disabled={isLoading}>
                <Mail className="mr-2 h-4 w-4" />
                {isLoading ? "注册中..." : "邮箱注册"}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <Separator className="my-4" />
            <div className="space-y-2">
              <Button
                onClick={handleGoogleRegister}
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
                Google 注册
              </Button>
              <Button
                onClick={handleAppleRegister}
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Apple className="mr-2 h-4 w-4" />
                Apple 注册
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="justify-center">
          <p className="text-sm text-gray-600">
            已有账号？{" "}
            <Link href="/login" className="text-primary hover:underline">
              登录
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
