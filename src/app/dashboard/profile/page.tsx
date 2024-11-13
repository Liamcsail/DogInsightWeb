"use client";

import { useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera } from "lucide-react";

// 模拟用户数据
const userData = {
  name: "张三",
  email: "zhangsan@example.com",
  avatar: "/avatars/default.jpg",
  bio: "一个热爱狗狗的人",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState(userData);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("个人资料更新成功！");
    setIsEditing(false);
    // TODO: 实际项目中这里需要调用 API 更新用户资料
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">个人资料</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center">
              <div className="relative">
                <Image
                  src={profile.avatar}
                  alt={profile.name}
                  width={120}
                  height={120}
                  className="rounded-full"
                />
                {isEditing && (
                  <Button
                    size="icon"
                    variant="secondary"
                    className="absolute bottom-0 right-0 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="name">昵称</Label>
                <Input
                  id="name"
                  value={profile.name}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="email">邮箱</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                />
              </div>

              <div>
                <Label htmlFor="bio">个人简介</Label>
                <Input
                  id="bio"
                  value={profile.bio}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                />
              </div>

              {message && (
                <Alert>
                  <AlertDescription>{message}</AlertDescription>
                </Alert>
              )}

              <div className="flex justify-end space-x-4">
                {isEditing ? (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        setIsEditing(false);
                        setProfile(userData);
                      }}
                    >
                      取消
                    </Button>
                    <Button type="submit">保存</Button>
                  </>
                ) : (
                  <Button type="button" onClick={() => setIsEditing(true)}>
                    编辑资料
                  </Button>
                )}
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
