import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'
import { queryClient } from './query/queryClient'
import { RequestTimingProvider } from './query/requestTiming/RequestTimingProvider'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <RequestTimingProvider>
        <App />
      </RequestTimingProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  </StrictMode>,
)
