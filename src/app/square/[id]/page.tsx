"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { Loader2, Heart, Share2, ArrowLeft, Send } from "lucide-react";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: number;
  content: string;
  createdAt: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
}

export default function PostDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 获取帖子详情和评论
  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const [postData, commentsData] = await Promise.all([
          api.square.getPost(params.id),
          api.square.getComments(params.id),
        ]);

        setPost(postData);
        setComments(commentsData);
      } catch (err) {
        setError("获取内容失败，请稍后重试");
        console.error("获取帖子详情错误:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPostDetails();
  }, [params.id]);

  // 处理点赞
  const handleLike = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    try {
      await api.square.likePost(post.id);
      setPost((prev) => ({
        ...prev,
        likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
        isLiked: !prev.isLiked,
      }));
    } catch (err) {
      console.error("点赞失败:", err);
    }
  };

  // 处理分享
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "查看这只可爱的狗狗",
          text: post.description,
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

  // 提交评论
  const handleSubmitComment = async () => {
    if (!user) {
      router.push("/login");
      return;
    }

    if (!newComment.trim()) return;

    setIsSubmitting(true);
    try {
      const comment = await api.square.addComment(post.id, newComment);
      setComments((prev) => [comment, ...prev]);
      setNewComment("");
    } catch (err) {
      console.error("评论失败:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">
          重试
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <Button variant="ghost" className="mb-6" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        返回
      </Button>

      <Card className="mb-8">
        <CardContent className="p-0">
          <div className="relative aspect-video w-full">
            <Image
              src={post.image}
              alt="狗狗照片"
              layout="fill"
              objectFit="cover"
              priority
            />
          </div>

          <div className="p-6">
            <div className="flex items-center mb-4">
              <Avatar
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 rounded-full mr-3"
              />
              <div>
                <p className="font-semibold">{post.author.name}</p>
                <p className="text-sm text-gray-500">
                  {formatDate(post.createdAt)}
                </p>
              </div>
            </div>

            <p className="text-gray-700 mb-4">{post.description}</p>

            <div className="flex flex-wrap gap-2 mb-4">
              {post.breedTags.map((tag: string) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
              {post.topicTags.map((tag: string) => (
                <Badge key={tag} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                className={`flex items-center gap-2 ${post.isLiked ? "text-red-500" : ""}`}
                onClick={handleLike}
              >
                <Heart
                  className={`w-4 h-4 ${post.isLiked ? "fill-current" : ""}`}
                />
                {post.likes}
              </Button>
              <Button variant="ghost" onClick={handleShare}>
                <Share2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <div className="flex gap-4">
          <Input
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder={user ? "写下你的评论..." : "登录后参与评论"}
            disabled={!user || isSubmitting}
          />
          <Button
            onClick={handleSubmitComment}
            disabled={!user || !newComment.trim() || isSubmitting}
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              还没有评论，来说点什么吧~
            </p>
          ) : (
            comments.map((comment) => (
              <Card key={comment.id}>
                <CardContent className="p-4">
                  <div className="flex items-center mb-2">
                    <Avatar
                      src={comment.author.avatar}
                      alt={comment.author.name}
                      className="w-8 h-8 rounded-full mr-2"
                    />
                    <div>
                      <p className="font-medium">{comment.author.name}</p>
                      <p className="text-xs text-gray-500">
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
