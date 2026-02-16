import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ClerkProvider } from '@clerk/clerk-react'
import { BrowserRouter } from 'react-router-dom';
import AuthProvider from './providers/AuthProvider.tsx'
import {QueryClientProvider} from '@tanstack/react-query'
import {queryClient} from '@/lib/queryClient.ts'
import { MusicPlayerProvider } from './contexts/MusicPlayerContext.tsx'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Publishable Key')
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <QueryClientProvider client={queryClient}>
        <MusicPlayerProvider>
          <AuthProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
        </AuthProvider>
      </MusicPlayerProvider>
      </QueryClientProvider>  
    </ClerkProvider>
  </StrictMode>,
)
