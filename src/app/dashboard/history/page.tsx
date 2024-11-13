"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, ArrowRight } from "lucide-react";

// 模拟历史记录数据
const mockHistory = [
  {
    id: 1,
    image: "/sample-dog-1.jpg",
    date: "2024-01-15",
    breeds: [
      { name: "拉布拉多", percentage: 70 },
      { name: "金毛寻回犬", percentage: 30 },
    ],
  },
  {
    id: 2,
    image: "/sample-dog-2.jpg",
    date: "2024-01-10",
    breeds: [
      { name: "哈士奇", percentage: 85 },
      { name: "阿拉斯加雪橇犬", percentage: 15 },
    ],
  },
  {
    id: 3,
    image: "/sample-dog-3.jpg",
    date: "2024-01-05",
    breeds: [{ name: "柯基", percentage: 100 }],
  },
];

export default function HistoryPage() {
  const [history] = useState(mockHistory);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">识别历史</h1>
        <Button asChild variant="outline">
          <Link href="/identify">新的识别</Link>
        </Button>
      </div>

      <div className="space-y-4">
        {history.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-500 mb-4">还没有识别记录</p>
              <Button asChild>
                <Link href="/identify">开始第一次识别</Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          history.map((record) => (
            <Card key={record.id} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="relative w-full sm:w-48 h-48">
                    <Image
                      src={record.image}
                      alt="Dog"
                      layout="fill"
                      objectFit="cover"
                    />
                  </div>
                  <div className="flex-1 p-6">
                    <div className="flex items-center gap-2 text-gray-500 mb-4">
                      <CalendarDays className="w-4 h-4" />
                      <span>{formatDate(record.date)}</span>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-lg font-medium mb-2">识别结果</h3>
                        <div className="flex flex-wrap gap-2">
                          {record.breeds.map((breed, index) => (
                            <Badge key={index} variant="secondary">
                              {breed.name}: {breed.percentage}%
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end">
                        <Button asChild variant="ghost">
                          <Link
                            href={`/identify/${record.id}`}
                            className="flex items-center gap-2"
                          >
                            查看详情 <ArrowRight className="w-4 h-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
