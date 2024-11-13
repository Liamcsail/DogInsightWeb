"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { useAuthStore } from "@/store/auth";
import { debounce } from "@/lib/utils";
import { PostCard } from "@/components/features/square/PostCard";
import { PostFilter } from "@/components/features/square/PostFilter";

interface Post {
  id: number;
  image: string;
  breedTags: string[];
  topicTags: string[];
  likes: number;
  comments: number;
  description: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  isLiked?: boolean;
}

export default function ContentSquare() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [allBreedTags, setAllBreedTags] = useState<string[]>([]);
  const [allTopicTags, setAllTopicTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const { user } = useAuthStore();

  // 获取帖子列表
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await api.square.getPosts({
          page: 1,
          search: searchTerm,
          tag: selectedTag,
        });

        setPosts(response.posts);
        setHasMore(response.hasMore);

        // 提取所有标签
        const breedTags = new Set<string>();
        const topicTags = new Set<string>();

        response.posts.forEach((post) => {
          post.breedTags.forEach((tag) => breedTags.add(tag));
          post.topicTags.forEach((tag) => topicTags.add(tag));
        });

        setAllBreedTags(Array.from(breedTags));
        setAllTopicTags(Array.from(topicTags));
      } catch (err) {
        setError("获取内容失败，请稍后重试");
        console.error("获取帖子列表错误:", err);
      } finally {
        setIsLoading(false);
      }
    };

    setIsLoading(true);
    fetchPosts();
  }, [searchTerm, selectedTag]);

  // 加载更多帖子
  const loadMorePosts = async () => {
    if (isLoadingMore || !hasMore) return;

    setIsLoadingMore(true);
    try {
      const response = await api.square.getPosts({
        page: page + 1,
        search: searchTerm,
        tag: selectedTag,
      });

      setPosts((prev) => [...prev, ...response.posts]);
      setHasMore(response.hasMore);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("加载更多帖子失败:", err);
    } finally {
      setIsLoadingMore(false);
    }
  };

  // 处理搜索
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
    setPage(1);
  }, 300);

  // 处理标签选择
  const handleTagSelect = (tag: string) => {
    setSelectedTag(tag === selectedTag ? "" : tag);
    setPage(1);
  };

  // 处理点赞
  const handleLike = async (postId: number) => {
    if (!user) {
      // 提示用户登录
      router.push("/login");
      return;
    }

    try {
      await api.square.likePost(postId);
      setPosts(
        posts.map((post) =>
          post.id === postId
            ? {
                ...post,
                likes: post.isLiked ? post.likes - 1 : post.likes + 1,
                isLiked: !post.isLiked,
              }
            : post,
        ),
      );
    } catch (err) {
      console.error("点赞失败:", err);
    }
  };

  // 处理无限滚动
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
        document.documentElement.offsetHeight
      ) {
        loadMorePosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, hasMore, isLoadingMore]);

  if (error) {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">内容广场</h1>

      <PostFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedTag={selectedTag}
        onTagSelect={handleTagSelect}
        breedTags={allBreedTags}
        topicTags={allTopicTags}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-80"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center text-gray-500 mt-8">
          <p>暂无内容</p>
          {user && (
            <Button asChild className="mt-4">
              <Link href="/identify">上传第一张照片</Link>
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                {...post}
                onLike={() => handleLike(post.id)}
                onComment={() => router.push(`/square/${post.id}`)}
                onShare={() => {
                  if (navigator.share) {
                    navigator.share({
                      title: "查看这只可爱的狗狗",
                      text: post.description,
                      url: `${window.location.origin}/square/${post.id}`,
                    });
                  } else {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/square/${post.id}`,
                    );
                    alert("链接已复制到剪贴板");
                  }
                }}
              />
            ))}
          </div>

          {isLoadingMore && (
            <div className="flex justify-center mt-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          )}

          {!hasMore && posts.length > 0 && (
            <p className="text-center text-gray-500 mt-8">没有更多内容了</p>
          )}
        </>
      )}
    </div>
  );
}
