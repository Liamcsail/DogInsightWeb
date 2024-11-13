"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Share2, AlertTriangle, Loader2, ArrowLeft } from "lucide-react";
import { api } from "@/lib/api";
import { useBreedsStore } from "@/store/breeds";
import { storage } from "@/lib/storage";

interface StatBarProps {
  label: string;
  value: number;
  max?: number;
}

const StatBar: React.FC<StatBarProps> = ({ label, value, max = 5 }) => (
  <div className="flex items-center gap-2">
    <span className="text-gray-700 min-w-[120px] mr-2">{label}:</span>
    <div className="flex-1 bg-gray-200 rounded-full h-2">
      <div
        className="bg-primary rounded-full h-2 transition-all duration-300"
        style={{ width: `${(value / max) * 100}%` }}
      />
    </div>
    <span className="ml-2 text-gray-700">
      {value}/{max}
    </span>
  </div>
);

export default function BreedDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const { setCurrentBreed, currentBreed } = useBreedsStore();

  useEffect(() => {
    const fetchBreedData = async () => {
      try {
        const breedData = await api.breeds.getDetail(params.id);
        setCurrentBreed(breedData);

        // 检查是否在收藏中
        const favorites = storage.get("favoriteBreeds") || [];
        setIsFavorite(favorites.includes(params.id));
      } catch (err) {
        console.error("获取犬种详情失败:", err);
        setError("获取犬种详情失败，请稍后重试");
      } finally {
        setIsLoading(false);
      }
    };

    fetchBreedData();

    // 清理函数
    return () => setCurrentBreed(null);
  }, [params.id]);

  const handleFavoriteToggle = () => {
    const favorites = storage.get("favoriteBreeds") || [];
    if (isFavorite) {
      const newFavorites = favorites.filter((id: string) => id !== params.id);
      storage.set("favoriteBreeds", newFavorites);
    } else {
      storage.set("favoriteBreeds", [...favorites, params.id]);
    }
    setIsFavorite(!isFavorite);
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${currentBreed?.name} - DogInsight`,
          text: currentBreed?.description,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("链接已复制到剪贴板");
      }
    } catch (error) {
      console.error("分享失败:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !currentBreed) {
    return notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <Button variant="ghost" className="mb-4" asChild>
          <Link href="/breeds" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回列表
          </Link>
        </Button>

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-2">{currentBreed.name}</h1>
          <p className="text-gray-600">{currentBreed.description}</p>
        </div>

        <div className="mb-8">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg shadow-lg">
            <Image
              src={currentBreed.image}
              alt={currentBreed.name}
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">历史</h2>
              <p className="text-gray-700">{currentBreed.history}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">性格特点</h2>
              <div className="flex flex-wrap gap-2">
                {currentBreed.personality.map((trait, index) => (
                  <Badge key={index} variant="secondary">
                    {trait}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">护理需求</h2>
              <p className="text-gray-700">{currentBreed.careNeeds}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <h2 className="text-2xl font-semibold mb-4">健康问题</h2>
              <p className="text-gray-700">{currentBreed.healthIssues}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-4">特征评分</h2>
            <div className="space-y-4">
              {Object.entries(currentBreed.stats).map(([key, value]) => (
                <StatBar key={key} label={key} value={value as number} />
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">趣味知识</h2>
          <ul className="list-disc pl-6 space-y-2">
            {currentBreed.funFacts.map((fact, index) => (
              <li key={index} className="text-gray-700">
                {fact}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            className={`flex items-center gap-2 ${isFavorite ? "text-red-500" : ""}`}
            onClick={handleFavoriteToggle}
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
            {isFavorite ? "取消收藏" : "收藏"}
          </Button>
          <Button
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleShare}
          >
            <Share2 className="w-4 h-4" />
            分享
          </Button>
        </div>

        <div className="mt-8 p-4 bg-yellow-100 rounded-lg flex items-start">
          <AlertTriangle className="w-6 h-6 text-yellow-600 mr-2 flex-shrink-0" />
          <p className="text-yellow-700 text-sm">
            请注意，每只狗狗都是独特的个体，可能会有不同于品种一般特征的表现。
            选择宠物时，请充分了解并考虑您的生活方式和能力是否适合照顾这个品种的狗狗。
          </p>
        </div>
      </div>
    </div>
  );
}
