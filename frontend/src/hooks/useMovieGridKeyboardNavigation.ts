import { useCallback, useRef } from 'react'
import type { KeyboardEvent } from 'react'

type ArrowKey = 'ArrowLeft' | 'ArrowRight' | 'ArrowUp' | 'ArrowDown'
const CARD_SELECTOR = 'button[data-movie-card-index]'
const ROW_TOLERANCE_PX = 1

const KEY_ALIASES: Record<string, ArrowKey> = {
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  Left: 'ArrowLeft',
  Right: 'ArrowRight',
  Up: 'ArrowUp',
  Down: 'ArrowDown',
}

function getBestVerticalTarget(
  cards: NodeListOf<HTMLButtonElement>,
  cardIndex: number,
  key: Extract<ArrowKey, 'ArrowUp' | 'ArrowDown'>,
) {
  const currentCard = cards[cardIndex]
  if (!currentCard) return null

  const currentRect = currentCard.getBoundingClientRect()
  const currentCenterX = currentRect.left + currentRect.width / 2

  let bestCard: HTMLButtonElement | null = null
  let bestRowDistance = Number.POSITIVE_INFINITY
  let bestColumnDistance = Number.POSITIVE_INFINITY

  for (let index = 0; index < cards.length; index += 1) {
    if (index === cardIndex) continue

    const card = cards[index]
    const rect = card.getBoundingClientRect()
    const isValidDirection =
      key === 'ArrowUp'
        ? rect.top < currentRect.top - ROW_TOLERANCE_PX
        : rect.top > currentRect.top + ROW_TOLERANCE_PX

    if (!isValidDirection) continue

    const rowDistance = Math.abs(rect.top - currentRect.top)
    const columnDistance = Math.abs(rect.left + rect.width / 2 - currentCenterX)

    if (rowDistance < bestRowDistance - ROW_TOLERANCE_PX) {
      bestCard = card
      bestRowDistance = rowDistance
      bestColumnDistance = columnDistance
      continue
    }

    if (Math.abs(rowDistance - bestRowDistance) <= ROW_TOLERANCE_PX && columnDistance < bestColumnDistance) {
      bestCard = card
      bestColumnDistance = columnDistance
    }
  }

  return bestCard
}

export function useMovieGridKeyboardNavigation() {
  const gridRef = useRef<HTMLElement | null>(null)

  const handleArrowNavigate = useCallback((key: ArrowKey, cardIndex: number) => {
    const gridElement = gridRef.current
    if (!gridElement) return

    const cards =gridElement.querySelectorAll<HTMLButtonElement>(CARD_SELECTOR)
    if (!cards.length) return

    const currentCard = cards[cardIndex]
    if (!currentCard) return

    if (key === 'ArrowLeft') {
      cards[Math.max(0, cardIndex - 1)]?.focus()
      return
    }

    if (key === 'ArrowRight') {
      cards[Math.min(cards.length - 1, cardIndex + 1)]?.focus()
      return
    }

    getBestVerticalTarget(cards, cardIndex, key)?.focus()
  }, [])

  const onCardKeyDown = useCallback(
    (event: KeyboardEvent<HTMLButtonElement>, cardIndex: number) => {
      const normalizedKey = KEY_ALIASES[event.key]
      if (!normalizedKey) return

      event.preventDefault()
      handleArrowNavigate(normalizedKey, cardIndex)
    },
    [handleArrowNavigate],
  )

  return {
    gridRef,
    onCardKeyDown,
  }
}

export type { ArrowKey }
