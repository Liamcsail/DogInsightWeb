interface RequestConfig extends RequestInit {
  data?: any
}

// 基础 API 请求函数
async function request<T>(url: string, config: RequestConfig = {}): Promise<T> {
  const { data, headers: customHeaders, ...customConfig } = config

  const headers = {
    'Content-Type': 'application/json',
    ...customHeaders,
  }

  // 如果有 token，添加到请求头
  const token = localStorage.getItem('token')
  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const config = {
    ...customConfig,
    headers,
  }

  if (data) {
    config.body = JSON.stringify(data)
  }

  try {
    const response = await fetch(url, config)
    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || '请求失败')
    }

    return data
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(error.message)
    }
    throw new Error('请求失败')
  }
}

// API 路径配置
const API_PATHS = {
  auth: {
    login: '/api/auth/login',
    register: '/api/auth/register',
    logout: '/api/auth/logout',
    me: '/api/auth/me',
  },
  breeds: {
    list: '/api/breeds',
    detail: (id: string) => `/api/breeds/${id}`,
  },
  identify: {
    analyze: '/api/identify/analyze',
  },
} as const

// API 方法
export const api = {
  // 认证相关
  auth: {
    login: (email: string, password: string) =>
      request(API_PATHS.auth.login, {
        method: 'POST',
        data: { email, password },
      }),

    register: (email: string, password: string) =>
      request(API_PATHS.auth.register, {
        method: 'POST',
        data: { email, password },
      }),

    logout: () =>
      request(API_PATHS.auth.logout, { method: 'POST' }),

    getProfile: () =>
      request(API_PATHS.auth.me),
  },

  // 犬种相关
  breeds: {
    getList: (params?: { category?: string; personality?: string }) =>
      request(API_PATHS.breeds.list, {
        method: 'GET',
        params,
      }),

    getDetail: (id: string) =>
      request(API_PATHS.breeds.detail(id)),
  },

  // 识别相关
  identify: {
    analyze: async (imageFile: File) => {
      const formData = new FormData()
      formData.append('image', imageFile)

      return request(API_PATHS.identify.analyze, {
        method: 'POST',
        headers: {},  // 让浏览器自动设置 Content-Type
        body: formData,
      })
    },
  },
}