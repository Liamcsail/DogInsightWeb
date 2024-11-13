import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export interface BreedCardProps {
  id: number;
  name: string;
  image: string;
  category: string;
  personality: string;
}

export function BreedCard({
  id,
  name,
  image,
  category,
  personality,
}: BreedCardProps) {
  return (
    <Link href={`/breeds/${id}`}>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            <Image
              src={image}
              alt={name}
              layout="fill"
              objectFit="cover"
              className="transition-transform duration-300 ease-in-out hover:scale-105"
            />
          </div>
          <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{name}</h2>
            <div className="flex gap-2">
              <Badge variant="secondary">{category}</Badge>
              <Badge variant="outline">{personality}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
