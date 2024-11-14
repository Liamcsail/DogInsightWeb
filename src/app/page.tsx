"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { testSupabaseConnection } from "@/lib/supabaseTest";

export default function Home() {
  const [connectionStatus, setConnectionStatus] = useState<
    "testing" | "success" | "error"
  >("testing");

  useEffect(() => {
    async function checkConnection() {
      const isConnected = await testSupabaseConnection();
      setConnectionStatus(isConnected ? "success" : "error");
    }

    checkConnection();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* 添加连接状态指示器 - 仅在开发环境显示 */}
      {process.env.NODE_ENV === "development" && (
        <div
          className={`p-2 text-center ${
            connectionStatus === "success"
              ? "bg-green-100 text-green-800"
              : connectionStatus === "error"
                ? "bg-red-100 text-red-800"
                : "bg-yellow-100 text-yellow-800"
          }`}
        >
          Supabase 连接状态:{" "}
          {connectionStatus === "success"
            ? "已连接"
            : connectionStatus === "error"
              ? "连接失败"
              : "正在连接..."}
        </div>
      )}

      <main className="flex-grow">
        <section className="bg-gradient-to-r from-blue-100 to-purple-100 py-20">
          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 text-center md:text-left mb-8 md:mb-0">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                更了解你的狗狗，更好地爱它
              </h1>
              <p className="text-xl mb-8 text-gray-600">
                使用AI技术，深入了解您的宠物狗的品种、特性和需求
              </p>
              <Button
                size="lg"
                asChild
                className="bg-primary hover:bg-primary-dark text-white"
              >
                <Link href="/identify">开始识别</Link>
              </Button>
            </div>
            <div className="md:w-1/2">
              <img
                src="/hero-dog.svg"
                alt="Happy Dog"
                className="mx-auto max-w-md w-full"
              />
            </div>
          </div>
        </section>
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              主要功能
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="狗狗品种识别"
                description="上传照片，AI 分析狗狗的品种组成和血统比例"
                icon="/icons/magnifier.svg"
              />
              <FeatureCard
                title="犬种百科"
                description="详细了解不同犬种的历史、性格特点和护理需求"
                icon="/icons/book.svg"
              />
              <FeatureCard
                title="社区交流"
                description="与其他狗狗爱好者分享经验，获取专业建议"
                icon="/icons/chat.svg"
              />
            </div>
          </div>
        </section>
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
              最新识别
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="bg-white rounded-lg shadow-md overflow-hidden"
                >
                  <img
                    src={`/sample-dog-${i}.jpg`}
                    alt={`Sample Dog ${i}`}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">可爱的小狗</h3>
                    <p className="text-gray-600 text-sm">
                      主要品种：拉布拉多 (70%), 金毛寻回犬 (30%)
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-8">
              <Button asChild variant="outline">
                <Link href="/square">查看更多</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({
  title,
  description,
  icon,
}: {
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <div className="bg-gray-50 p-6 rounded-lg shadow-sm text-center hover:shadow-md transition-shadow duration-300">
      <img src={icon} alt={title} className="w-16 h-16 mx-auto mb-4" />
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
