import '@assets/styles/index.css'
import '@assets/styles/animate.css'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { router } from './routes/routes'
import { RouterProvider } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from 'react-query'
import "./i18n";


// Create a client
const queryClient = new QueryClient()


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>,
)
