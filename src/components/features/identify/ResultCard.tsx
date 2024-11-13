import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

export interface BreedResult {
  name: string;
  percentage: number;
}

interface ResultCardProps {
  image: string;
  breeds: BreedResult[];
  description: string;
  onShare?: () => void;
}

export function ResultCard({
  image,
  breeds,
  description,
  onShare,
}: ResultCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="relative aspect-square w-full">
          <Image
            src={image}
            alt="分析的狗狗"
            layout="fill"
            objectFit="cover"
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
        <div className="p-6 space-y-4">
          <div>
            <h3 className="text-xl font-semibold mb-2">识别结果</h3>
            <div className="flex flex-wrap gap-2">
              {breeds.map((breed, index) => (
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
            <h4 className="text-lg font-medium mb-2">特征描述</h4>
            <p className="text-gray-600">{description}</p>
          </div>

          {onShare && (
            <div className="flex justify-end">
              <Button
                variant="ghost"
                onClick={onShare}
                className="text-gray-600 hover:text-primary"
              >
                <Share2 className="w-4 h-4 mr-2" />
                分享结果
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
