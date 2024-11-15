// components/shared/ImageUploader.tsx
import { useState, useCallback } from "react";
import { fileUtils, imageUtils } from "@/lib/utils";

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  maxSize: number;
  acceptedTypes: string[];
}

export function ImageUploader({
  onImageUpload,
  maxSize,
  acceptedTypes,
}: ImageUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  }, []);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);

      const file = e.dataTransfer.files[0];
      if (!file) return;

      // 验证文件类型
      if (!acceptedTypes.includes(file.type)) {
        alert(
          `请上传${acceptedTypes.map((type) => type.split("/")[1].toUpperCase()).join("、")}格式的图片`,
        );
        return;
      }

      // 验证文件大小
      if (file.size > maxSize) {
        alert(`文件大小不能超过 ${fileUtils.formatFileSize(maxSize)}`);
        return;
      }

      // 验证图片尺寸
      const isValidDimensions = await imageUtils.validateImageDimensions(file);
      if (!isValidDimensions) {
        alert("图片尺寸过小，请上传至少 200x200 像素的图片");
        return;
      }

      onImageUpload(file);
    },
    [onImageUpload, maxSize, acceptedTypes],
  );

  const handleFileSelect = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      // 验证文件大小
      if (file.size > maxSize) {
        alert(`文件大小不能超过 ${fileUtils.formatFileSize(maxSize)}`);
        return;
      }

      // 验证图片尺寸
      const isValidDimensions = await imageUtils.validateImageDimensions(file);
      if (!isValidDimensions) {
        alert("图片尺寸过小，请上传至少 200x200 像素的图片");
        return;
      }

      onImageUpload(file);
    },
    [onImageUpload, maxSize],
  );

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragActive
          ? "border-primary bg-primary/5"
          : "border-gray-300 hover:border-primary"
      }`}
      onDragEnter={handleDragEnter}
      onDragOver={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => document.getElementById("file-input")?.click()}
    >
      <input
        id="file-input"
        type="file"
        className="hidden"
        accept={acceptedTypes.join(",")}
        onChange={handleFileSelect}
      />
      <div>
        <p className="text-lg mb-2">
          {isDragActive ? "放开以上传图片" : "点击或拖拽上传图片"}
        </p>
        <p className="text-sm text-gray-500">
          支持{" "}
          {acceptedTypes
            .map((type) => type.split("/")[1].toUpperCase())
            .join("、")}{" "}
          格式 最大 {fileUtils.formatFileSize(maxSize)}
        </p>
      </div>
    </div>
  );
}
