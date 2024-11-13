import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Paw, Info, RefreshCw, Share2 } from "lucide-react";

// 模拟数据获取函数
async function getIdentificationResult(id: string) {
  // 在实际应用中，这里应该是一个API调用
  const results = {
    "1": {
      image: "/sample-dog-1.jpg",
      breeds: [
        { name: "拉布拉多", percentage: 70 },
        { name: "金毛寻回犬", percentage: 30 },
      ],
      description:
        "这只可爱的狗狗看起来主要继承了拉布拉多的特征，同时也有金毛寻回犬的血统。它可能拥有拉布拉多的友善性格和金毛的智慧。这种混合品种通常非常适合作为家庭宠物，既聪明又充满活力。",
      characteristics: ["友善", "聪明", "活跃", "忠诚"],
    },
  };

  if (id in results) {
    return results[id as keyof typeof results];
  }
  return null;
}

export default async function IdentificationResultPage({
  params,
}: {
  params: { id: string };
}) {
  const result = await getIdentificationResult(params.id);

  if (!result) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        狗狗品种分析结果
      </h1>
      <Card className="overflow-hidden shadow-lg bg-white">
        <CardContent className="p-0">
          <div className="relative aspect-square w-full overflow-hidden">
            <Image
              src={result.image}
              alt="分析的狗狗"
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
          <div className="p-6 space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-3 flex items-center text-primary">
                <Paw className="w-6 h-6 mr-2" />
                品种组成
              </h2>
              <div className="flex flex-wrap gap-2">
                {result.breeds.map((breed, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-sm px-3 py-1 rounded-full bg-primary/10 text-primary"
                  >
                    {breed.name}: {breed.percentage}%
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                特征描述
              </h3>
              <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                {result.description}
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-2 text-gray-800">
                性格特点
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.characteristics.map((trait, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  >
                    {trait}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                asChild
                className="flex-1 bg-primary hover:bg-primary-dark text-white"
              >
                <Link
                  href="/breeds"
                  className="flex items-center justify-center"
                >
                  <Info className="w-4 h-4 mr-2" />
                  了解更多犬种信息
                </Link>
              </Button>
              <Button variant="outline" asChild className="flex-1">
                <Link
                  href="/identify"
                  className="flex items-center justify-center"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  再次识别
                </Link>
              </Button>
            </div>

            <div className="flex justify-center">
              <Button
                variant="ghost"
                className="text-gray-600 hover:text-primary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享结果
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
