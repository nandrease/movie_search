export type Movie = {
  id: number
  title: string
  originalTitle?: string
  releaseYear: number | null
  rating: number
  image: string | null
  language?: string
}

export type PagedResponse<T> = {
  page: number
  results: T[]
  totalPages: number
  totalResults: number
}

