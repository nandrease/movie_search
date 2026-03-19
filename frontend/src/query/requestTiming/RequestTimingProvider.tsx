import { createContext, useEffect, useMemo, type ReactNode } from 'react'
import {
  setRequestInterceptor,
  type RequestInterceptor,
} from './requestInterceptor'

type RequestTimingContextValue = {
  intercept: RequestInterceptor
}

const RequestTimingContext = createContext<RequestTimingContextValue | null>(null)

export function RequestTimingProvider({ children }: Readonly<{ children: ReactNode }>) {
  const intercept = useMemo<RequestInterceptor>(
    () => async (actionName, work) => {
      const started = performance.now()
      try {
        const result = await work()
        const duration = performance.now() - started
        console.log(`[request-timing] ${actionName} fulfilled in ${duration.toFixed(2)}ms`)
        return result
      } catch (error) {
        const duration = performance.now() - started
        console.log(`[request-timing] ${actionName} rejected in ${duration.toFixed(2)}ms`)
        throw error
      }
    },
    [],
  )

  useEffect(() => {
    setRequestInterceptor(intercept)
  }, [intercept])

  const contextValue = useMemo(() => ({ intercept }), [intercept])

  return (
    <RequestTimingContext.Provider value={contextValue}>
      {children}
    </RequestTimingContext.Provider>
  )
}

