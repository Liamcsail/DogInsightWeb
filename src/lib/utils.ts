// 日期格式化
export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString("zh-CN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

// 文件大小格式化
export function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// 百分比格式化
export function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

// 生成随机ID
export function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

// 深度克隆对象
export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}

// 防抖函数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): (...args: Parameters<T>) => void {
  let waiting = false;

  return function executedFunction(...args: Parameters<T>) {
    if (!waiting) {
      func(...args);
      waiting = true;
      setTimeout(() => {
        waiting = false;
      }, limit);
    }
  };
}

// 图片URL转base64
export function imageToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

// 验证邮箱格式
export function isValidEmail(email: string) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// 验证密码强度
export function checkPasswordStrength(password: string) {
  const strongRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})/;
  const mediumRegex = /^(?=.*[a-zA-Z])(?=.*[0-9])(?=.{6,})/;

  if (strongRegex.test(password)) return "strong";
  if (mediumRegex.test(password)) return "medium";
  return "weak";
}

// 限制字符串长度
export function truncateString(str: string, length: number) {
  if (str.length <= length) return str;
  return str.slice(0, length) + "...";
}
