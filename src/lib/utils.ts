// 已有的工具函数...

// 图片处理相关
export const imageUtils = {
  // 压缩图片
  async compressImage(file: File, maxWidth = 1920): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
          height = (maxWidth * height) / width;
          width = maxWidth;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);
        canvas.toBlob(
          (blob) =>
            blob ? resolve(blob) : reject(new Error("Compression failed")),
          "image/jpeg",
          0.8,
        );
      };
      img.onerror = reject;
    });
  },

  // 验证图片维度
  validateImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = () => {
        resolve(img.width >= 200 && img.height >= 200);
      };
      img.onerror = () => resolve(false);
    });
  },

  // 获取图片主要颜色
  async getImageDominantColor(imageUrl: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = imageUrl;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d")!;
        canvas.width = img.width;
        canvas.height = img.height;

        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height).data;

        let r = 0,
          g = 0,
          b = 0;

        for (let i = 0; i < data.length; i += 4) {
          r += data[i];
          g += data[i + 1];
          b += data[i + 2];
        }

        const pixels = data.length / 4;
        const hex = `#${Math.round(r / pixels)
          .toString(16)
          .padStart(2, "0")}${Math.round(g / pixels)
          .toString(16)
          .padStart(2, "0")}${Math.round(b / pixels)
          .toString(16)
          .padStart(2, "0")}`;

        resolve(hex);
      };
      img.onerror = reject;
    });
  },
};

// 正则验证相关
export const validateUtils = {
  // 中文姓名验证
  isValidChineseName(name: string): boolean {
    return /^[\u4e00-\u9fa5]{2,4}$/.test(name);
  },

  // URL验证
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  // 标签验证
  isValidTag(tag: string): boolean {
    return /^[a-zA-Z0-9\u4e00-\u9fa5-_]{1,20}$/.test(tag);
  },

  // 手机号验证（中国大陆）
  isValidPhone(phone: string): boolean {
    return /^1[3-9]\d{9}$/.test(phone);
  },
};

// 数组操作工具
export const arrayUtils = {
  // 数组去重
  unique<T>(arr: T[]): T[] {
    return [...new Set(arr)];
  },

  // 数组随机排序
  shuffle<T>(arr: T[]): T[] {
    return [...arr].sort(() => Math.random() - 0.5);
  },

  // 数组分组
  groupBy<T>(arr: T[], key: keyof T): Record<string, T[]> {
    return arr.reduce(
      (acc, item) => {
        const groupKey = String(item[key]);
        if (!acc[groupKey]) {
          acc[groupKey] = [];
        }
        acc[groupKey].push(item);
        return acc;
      },
      {} as Record<string, T[]>,
    );
  },
};

// 错误处理工具
export const errorUtils = {
  // 格式化错误信息
  formatError(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === "string") {
      return error;
    }
    return "发生未知错误";
  },

  // API错误处理
  handleApiError(error: unknown): { message: string; code?: string } {
    if (typeof error === "object" && error !== null && "message" in error) {
      return {
        message: String(error.message),
        code: "code" in error ? String(error.code) : undefined,
      };
    }
    return { message: "请求失败，请稍后重试" };
  },
};

// lib/utils.ts

// 已有的工具函数...

// 文件处理相关
export const fileUtils = {
  // 格式化文件大小
  formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },
};

// 存储工具
export const storage = {
  // 历史记录相关操作
  history: {
    add(item: any) {
      try {
        const history = JSON.parse(localStorage.getItem("history") || "[]");
        history.unshift(item);
        localStorage.setItem("history", JSON.stringify(history));
      } catch (error) {
        console.error("Failed to add history:", error);
      }
    },
    get() {
      try {
        return JSON.parse(localStorage.getItem("history") || "[]");
      } catch (error) {
        console.error("Failed to get history:", error);
        return [];
      }
    },
    clear() {
      localStorage.removeItem("history");
    },
  },
};

// API 请求工具
export const api = {
  // 基础请求方法
  async request(url: string, options?: RequestInit) {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    return response.json();
  },

  // 图片识别
  async identify(formData: FormData) {
    try {
      return await this.request("/api/identify", {
        method: "POST",
        body: formData,
      });
    } catch (error) {
      throw errorUtils.handleApiError(error);
    }
  },
};

// 导出便捷方法
export const formatFileSize = fileUtils.formatFileSize;
