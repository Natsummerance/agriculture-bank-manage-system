import { describe, it, expect, vi, beforeEach } from 'vitest'
import { api } from '@/utils/api'

// Mock fetch
global.fetch = vi.fn()

describe('API Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('应该正确发送GET请求', async () => {
    const mockResponse = { code: 200, data: { id: 1 } }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await api.get('/test')
    expect(result).toEqual(mockResponse.data)
  })

  it('应该正确发送POST请求', async () => {
    const mockResponse = { code: 200, data: { id: 1 } }
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })

    const result = await api.post('/test', { name: 'test' })
    expect(result).toEqual(mockResponse.data)
  })

  it('应该处理错误响应', async () => {
    ;(fetch as any).mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({ code: 400, message: '错误' }),
    })

    await expect(api.get('/test')).rejects.toThrow()
  })

  it('应该处理网络错误', async () => {
    ;(fetch as any).mockRejectedValueOnce(new Error('网络错误'))

    await expect(api.get('/test')).rejects.toThrow('网络错误')
  })

  it('应该自动添加认证token', async () => {
    localStorage.setItem('token', 'test-token')
    
    ;(fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ code: 200, data: {} }),
    })

    await api.get('/test')
    
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/test'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer test-token',
        }),
      })
    )
  })
})

