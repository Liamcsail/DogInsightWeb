interface RequestConfig extends RequestInit {
  data?: any;
  params?: Record<string, string>;
}

// 基础 API 请求函数
async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { data, params, headers: customHeaders, ...customConfig } = config;

  // 处理 URL 参数
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, value);
      }
    });
    url = `${url}?${searchParams.toString()}`;
  }

  const headers = {
    "Content-Type": "application/json",
    ...customHeaders,
  };

  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const finalConfig = {
    ...customConfig,
    headers,
  };

  if (data) {
    finalConfig.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, finalConfig);
    // 处理204 No Content的情况
    if (response.status === 204) {
      return null as T;
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.message || "请求失败");
    }

    return responseData;
  } catch (error) {
    console.error("API Request Error:", error);
    if (error instanceof Error) {
      throw new Error(error.message);
    }
    throw new Error("请求失败");
  }
}

const API_PATHS = {
  auth: {
    login: "/api/auth/login",
    register: "/api/auth/register",
    logout: "/api/auth/logout",
    me: "/api/auth/me",
    updateProfile: "/api/auth/profile",
  },
  breeds: {
    list: "/api/breeds",
    detail: (id: string) => `/api/breeds/${id}`,
    search: "/api/breeds/search",
  },
  identify: {
    analyze: "/api/identify/analyze",
    history: "/api/identify/history",
    result: (id: string) => `/api/identify/result/${id}`,
  },
  posts: {
    list: "/api/posts",
    create: "/api/posts",
    detail: (id: string) => `/api/posts/${id}`,
    like: (id: string) => `/api/posts/${id}/like`,
    comment: (id: string) => `/api/posts/${id}/comment`,
  },
} as const;

export const api = {
  auth: {
    login: (email: string, password: string) =>
      request(API_PATHS.auth.login, {
        method: "POST",
        data: { email, password },
      }),
    register: (email: string, password: string, name: string) =>
      request(API_PATHS.auth.register, {
        method: "POST",
        data: { email, password, name },
      }),
    logout: () => request(API_PATHS.auth.logout, { method: "POST" }),
    getProfile: () => request(API_PATHS.auth.me),
    updateProfile: (data: { name?: string; bio?: string; avatar?: string }) =>
      request(API_PATHS.auth.updateProfile, {
        method: "PUT",
        data,
      }),
  },

  breeds: {
    getList: (params?: {
      category?: string;
      personality?: string;
      page?: number;
      limit?: number;
    }) =>
      request(API_PATHS.breeds.list, {
        method: "GET",
        params: params as Record<string, string>,
      }),
    getDetail: (id: string) => request(API_PATHS.breeds.detail(id)),
    search: (query: string) =>
      request(API_PATHS.breeds.search, {
        method: "GET",
        params: { q: query },
      }),
  },

  identify: {
    analyze: async (imageFile: File) => {
      const formData = new FormData();
      formData.append("image", imageFile);
      return request(API_PATHS.identify.analyze, {
        method: "POST",
        headers: {},
        body: formData,
      });
    },
    getHistory: (params?: { page?: number; limit?: number }) =>
      request(API_PATHS.identify.history, {
        method: "GET",
        params: params as Record<string, string>,
      }),
    getResult: (id: string) => request(API_PATHS.identify.result(id)),
  },

  posts: {
    getList: (params?: { page?: number; limit?: number; userId?: string }) =>
      request(API_PATHS.posts.list, {
        method: "GET",
        params: params as Record<string, string>,
      }),
    create: (data: { image: string; caption?: string; tags?: string[] }) =>
      request(API_PATHS.posts.create, {
        method: "POST",
        data,
      }),
    getDetail: (id: string) => request(API_PATHS.posts.detail(id)),
    like: (id: string) =>
      request(API_PATHS.posts.like(id), {
        method: "POST",
      }),
    addComment: (id: string, content: string) =>
      request(API_PATHS.posts.comment(id), {
        method: "POST",
        data: { content },
      }),
  },
};

// 导出类型
export type ApiResponse<T> = Promise<
  | {
      data: T;
      error: null;
    }
  | {
      data: null;
      error: string;
    }
>;
