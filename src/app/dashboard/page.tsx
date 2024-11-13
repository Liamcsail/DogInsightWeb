"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Dog, History, FileText, Settings } from "lucide-react";

// 模拟用户数据
const userData = {
  name: "张三",
  avatar: "/avatars/default.jpg",
  dogsCount: 2,
  identificationCount: 5,
  postsCount: 3,
};

const DashboardItem = ({
  icon: Icon,
  title,
  value,
  href,
}: {
  icon: any;
  title: string;
  value: number;
  href: string;
}) => (
  <Link href={href}>
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  </Link>
);

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4">
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col items-center">
                <Image
                  src={userData.avatar}
                  alt={userData.name}
                  width={100}
                  height={100}
                  className="rounded-full mb-4"
                />
                <h2 className="text-2xl font-bold mb-2">{userData.name}</h2>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/dashboard/profile">编辑个人资料</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
          <nav className="mt-6">
            <ul className="space-y-2">
              <li>
                <Button
                  variant={activeTab === "overview" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("overview")}
                >
                  <User className="mr-2 h-4 w-4" />
                  概览
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "my-dogs" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("my-dogs")}
                >
                  <Dog className="mr-2 h-4 w-4" />
                  我的狗狗
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "history" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("history")}
                >
                  <History className="mr-2 h-4 w-4" />
                  识别历史
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "my-posts" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("my-posts")}
                >
                  <FileText className="mr-2 h-4 w-4" />
                  我的发布
                </Button>
              </li>
              <li>
                <Button
                  variant={activeTab === "settings" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveTab("settings")}
                >
                  <Settings className="mr-2 h-4 w-4" />
                  设置
                </Button>
              </li>
            </ul>
          </nav>
        </aside>
        <main className="w-full md:w-3/4">
          <h1 className="text-3xl font-bold mb-6">用户中心</h1>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <DashboardItem
              icon={Dog}
              title="我的狗狗"
              value={userData.dogsCount}
              href="/dashboard/pets"
            />
            <DashboardItem
              icon={History}
              title="识别次数"
              value={userData.identificationCount}
              href="/dashboard/history"
            />
            <DashboardItem
              icon={FileText}
              title="发布内容"
              value={userData.postsCount}
              href="/dashboard/posts"
            />
          </div>
        </main>
      </div>
    </div>
  );
}
