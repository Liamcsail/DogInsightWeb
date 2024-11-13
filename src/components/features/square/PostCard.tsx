import React from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, MessageCircle, Share2 } from "lucide-react";

interface PostCardProps {
  id: number;
  image: string;
  breedTags: string[];
  topicTags: string[];
  likes: number;
  comments: number;
  description: string;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}

export function PostCard({
  image,
  breedTags,
  topicTags,
  likes,
  comments,
  description,
  onLike,
  onComment,
  onShare,
}: PostCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <Image
          src={image}
          alt={breedTags[0]}
          width={400}
          height={300}
          className="w-full h-auto"
        />
        <div className="p-4">
          <div className="flex flex-wrap gap-1 mb-2">
            {breedTags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {topicTags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
          <p className="text-gray-600 mb-4">{description}</p>
          <div className="flex justify-between items-center">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={onLike}
            >
              <Heart className="w-4 h-4" />
              <span>{likes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1"
              onClick={onComment}
            >
              <MessageCircle className="w-4 h-4" />
              <span>{comments}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={onShare}>
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
