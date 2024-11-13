"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { useBreedsStore } from "@/store/breeds";
import { debounce } from "@/lib/utils";
import { BreedCard } from "@/components/features/breeds/BreedCard";
import { BreedFilter } from "@/components/features/breeds/BreedFilter";

export default function BreedsPage() {
  const router = useRouter();
  const {
    breeds,
    categories,
    personalities,
    isLoading,
    error,
    loadBreeds,
    setLoading,
    setError,
  } = useBreedsStore();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("全部");
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([]);

  // 获取犬种列表
  useEffect(() => {
    const fetchBreeds = async () => {
      setLoading(true);
      try {
        const response = await api.breeds.getList();
        loadBreeds(response);
      } catch (err) {
        setError("获取犬种列表失败，请稍后重试");
        console.error("获取犬种列表错误:", err);
      }
    };

    fetchBreeds();
  }, []);

  // 处理搜索输入
  const handleSearch = debounce((value: string) => {
    setSearchTerm(value);
  }, 300);

  // 处理分类选择
  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  // 处理性格特征选择
  const handlePersonalityChange = (personality: string) => {
    setSelectedPersonality((prev) =>
      prev.includes(personality)
        ? prev.filter((p) => p !== personality)
        : [...prev, personality],
    );
  };

  // 过滤犬种列表
  const filteredBreeds = useMemo(
    () =>
      breeds.filter(
        (breed) =>
          (breed.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            breed.description
              .toLowerCase()
              .includes(searchTerm.toLowerCase())) &&
          (selectedCategory === "全部" ||
            breed.category === selectedCategory) &&
          (selectedPersonality.length === 0 ||
            breed.personality.some((p) => selectedPersonality.includes(p))),
      ),
    [breeds, searchTerm, selectedCategory, selectedPersonality],
  );

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
      <h1 className="text-3xl font-bold mb-8 text-center text-primary">
        犬种百科
      </h1>

      <BreedFilter
        searchTerm={searchTerm}
        onSearchChange={handleSearch}
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        selectedPersonality={selectedPersonality}
        onPersonalityChange={handlePersonalityChange}
        categories={categories}
        personalities={personalities}
      />

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 8].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 rounded-lg h-64"
            />
          ))}
        </div>
      ) : filteredBreeds.length === 0 ? (
        <p className="text-center text-gray-500 mt-8">
          没有找到匹配的犬种，请尝试其他搜索条件。
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBreeds.map((breed) => (
            <BreedCard
              key={breed.id}
              {...breed}
              onClick={() => router.push(`/breeds/${breed.id}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
