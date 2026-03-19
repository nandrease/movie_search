import { useCallback, useEffect, useState } from 'react'

function readStoredItems(storageKey: string, limit: number): string[] {
  try {
    const raw = globalThis.localStorage.getItem(storageKey)
    if (!raw) return []
    const parsed = JSON.parse(raw) as unknown
    if (!Array.isArray(parsed)) return []
    return parsed
      .filter((value): value is string => typeof value === 'string')
      .slice(0, limit)
  } catch {
    return []
  }
}

export function useRecentSearches(storageKey: string, limit = 5) {
  const [items, setItems] = useState<string[]>(() => readStoredItems(storageKey, limit))

  useEffect(() => {
    try {
      globalThis.localStorage.setItem(storageKey, JSON.stringify(items.slice(0, limit)))
    } catch {
      // Ignore persistence errors in private mode or blocked storage.
    }
  }, [items, limit, storageKey])

  const push = useCallback(
    (value: string) => {
      const trimmed = value.trim()
      if (!trimmed) return
      setItems((prev) => {
        const unique = prev.filter((entry) => entry.toLowerCase() !== trimmed.toLowerCase())
        return [trimmed, ...unique].slice(0, limit)
      })
    },
    [limit],
  )

  const clear = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    push,
    clear,
  }
}

