import { ResearchRequest, ResearchResponse } from '@/types/research'
import { API_ENDPOINTS } from '@/config/agents'

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function analyzeMarket(request: ResearchRequest): Promise<ResearchResponse> {
  try {
    const response = await fetch(API_ENDPOINTS.analyze, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(request)
    })

    if (!response.ok) {
      const errorText = await response.text()
      throw new ApiError(response.status, errorText)
    }

    return await response.json()
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    throw new ApiError(500, error instanceof Error ? error.message : 'Unknown error')
  }
}

export async function checkHealth(): Promise<{ status: string; timestamp: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.health)
    if (!response.ok) {
      throw new ApiError(response.status, 'Health check failed')
    }
    return await response.json()
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Health check failed')
  }
}

export async function getCacheStats(): Promise<{
  total_entries: number;
  expired_entries: number;
  ttl_hours: number;
}> {
  try {
    const response = await fetch(API_ENDPOINTS.cacheStats)
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to get cache stats')
    }
    return await response.json()
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to get cache stats')
  }
}

export async function clearCache(): Promise<{ status: string; message: string }> {
  try {
    const response = await fetch(API_ENDPOINTS.cacheClear, { method: 'POST' })
    if (!response.ok) {
      throw new ApiError(response.status, 'Failed to clear cache')
    }
    return await response.json()
  } catch (error) {
    throw new ApiError(500, error instanceof Error ? error.message : 'Failed to clear cache')
  }
} 