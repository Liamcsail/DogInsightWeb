import { useState } from 'react'

interface UploadState {
  isUploading: boolean
  progress: number
  error: string | null
}

export function useUpload() {
  const [state, setState] = useState<UploadState>({
    isUploading: false,
    progress: 0,
    error: null,
  })

  const uploadImage = async (file: File) => {
    setState({ isUploading: true, progress: 0, error: null })

    try {
      // 验证文件类型和大小
      if (!file.type.startsWith('image/')) {
        throw new Error('请上传图片文件')
      }

      const maxSize = 5 * 1024 * 1024 // 5MB
      if (file.size > maxSize) {
        throw new Error('图片大小不能超过 5MB')
      }

      const formData = new FormData()
      formData.append('image', file)

      const response = await fetch('/api/identify/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('上传失败')
      }

      const data = await response.json()
      setState({ isUploading: false, progress: 100, error: null })
      return data

    } catch (error) {
      setState({ 
        isUploading: false, 
        progress: 0, 
        error: error instanceof Error ? error.message : '上传失败，请重试' 
      })
      return null
    }
  }

  const resetState = () => {
    setState({
      isUploading: false,
      progress: 0,
      error: null,
    })
  }

  return {
    isUploading: state.isUploading,
    progress: state.progress,
    error: state.error,
    uploadImage,
    resetState,
  }
}