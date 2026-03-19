import type { Movie, PagedResponse } from './types'
import { interceptAsyncRequest } from '../requestTiming/requestInterceptor'

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.toString() || 'http://localhost:3000'

function buildUrl(path: string, params: Record<string, string | undefined>) {
  const url = new URL(path, API_BASE_URL)
  for (const [k, v] of Object.entries(params)) {
    if (v == null || v === '') continue
    url.searchParams.set(k, v)
  }
  return url.toString()
}

async function requestJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(text || `Request failed (${res.status})`)
  }
  return (await res.json()) as T
}

export async function fetchMovies(params: {
  page?: number
  language?: string
  originalLanguage?: string
  genre?: string
}): Promise<PagedResponse<Movie>> {
  const url = buildUrl('/movies', {
    page: params.page?.toString(),
    language: params.language,
    original_language: params.originalLanguage,
    genre: params.genre,
  })
  return await interceptAsyncRequest('movies/fetch', async () => {
    return await requestJson<PagedResponse<Movie>>(url)
  })
}

export async function searchMovies(params: {
  query: string
  page?: number
  language?: string
  originalLanguage?: string
}): Promise<PagedResponse<Movie>> {
  const url = buildUrl('/movies/search', {
    query: params.query,
    page: params.page?.toString(),
    language: params.language,
    original_language: params.originalLanguage,
  })
  return await interceptAsyncRequest('movies/search', async () => {
    return await requestJson<PagedResponse<Movie>>(url)
  })
}

