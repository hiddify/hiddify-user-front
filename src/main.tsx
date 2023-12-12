import '@assets/styles/index.css'
import '@assets/styles/animate.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import "./i18n";


const queryClient: QueryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      refetchOnWindowFocus: false,
      retryOnMount: false // prevent infinite request on error in witch component has loading before mount
    },
  },
});


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
