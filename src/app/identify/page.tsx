"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ImageUploader } from "@/components/shared/ImageUploader";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { AlertCircle, Camera } from "lucide-react";
import { api } from "@/lib/api";
import { storage } from "@/lib/storage";
import { formatFileSize } from "@/lib/utils";
import { useUpload } from "@/hooks/useUpload";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export default function IdentifyPage() {
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { uploadImage, isUploading, progress } = useUpload();

  const validateImage = (file: File) => {
    if (!file.type.startsWith("image/")) {
      throw new Error("请上传图片文件");
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`图片大小不能超过 ${formatFileSize(MAX_FILE_SIZE)}`);
    }
  };

  const handleImageUpload = async (file: File) => {
    try {
      // 验证图片
      validateImage(file);

      // 设置预览
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      setImage(file);
      setError(null);

      return () => URL.revokeObjectURL(previewUrl);
    } catch (error) {
      setError(error instanceof Error ? error.message : "图片上传失败");
      setImage(null);
      setPreview(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setError(null);

    try {
      // 上传图片并获取分析结果
      const result = await uploadImage(image);

      if (!result) {
        throw new Error("识别失败");
      }

      // 保存到历史记录
      storage.history.add({
        ...result,
        createdAt: new Date().toISOString(),
      });

      // 跳转到结果页面
      router.push(`/identify/${result.id}`);
    } catch (error) {
      console.error("识别错误:", error);
      setError(error instanceof Error ? error.message : "识别失败，请重试");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-primary">
        狗狗品种识别
      </h1>
      <Card className="overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="bg-gradient-to-r from-blue-100 to-purple-100 p-6 text-center">
            <Camera className="w-16 h-16 mx-auto mb-4 text-primary" />
            <p className="text-lg font-medium text-gray-800 mb-2">
              上传狗狗照片，了解它的品种组成
            </p>
            <p className="text-sm text-gray-600">
              我们的AI将为您分析狗狗的独特之处
            </p>
          </div>
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <ImageUploader
              onImageUpload={handleImageUpload}
              maxSize={MAX_FILE_SIZE}
              acceptedTypes={["image/jpeg", "image/png", "image/webp"]}
            />

            {preview && (
              <div className="mt-4 relative aspect-square w-full max-w-sm mx-auto overflow-hidden rounded-lg">
                <Image
                  src={preview}
                  alt="Preview"
                  layout="fill"
                  objectFit="cover"
                  className="transition-opacity duration-300 ease-in-out hover:opacity-75"
                />
              </div>
            )}

            {error && (
              <div
                className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded"
                role="alert"
              >
                <div className="flex items-center">
                  <AlertCircle className="h-5 w-5 mr-2" />
                  <p>{error}</p>
                </div>
              </div>
            )}

            {isUploading && progress > 0 && progress < 100 && (
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-primary h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            <Button
              type="submit"
              disabled={!image || isUploading}
              className="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-full transition-colors duration-300"
            >
              {isUploading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner />
                  <span className="ml-2">识别中...</span>
                </div>
              ) : (
                "开始分析"
              )}
            </Button>

            <p className="text-sm text-gray-500 text-center">
              支持 JPG、PNG、WebP 格式，最大 {formatFileSize(MAX_FILE_SIZE)}
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
