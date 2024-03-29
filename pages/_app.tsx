import '@/styles/globals.css'
import '@/styles/output.css'
import type { AppProps } from 'next/app'
import {NextUIProvider} from "@nextui-org/react"
import NavbarComponent from '@/components/navbar'
import { Analytics } from '@vercel/analytics/react';

export default function App({ Component, pageProps }: AppProps) {

  return (
    <NextUIProvider>
      <NavbarComponent  />
      <div className='light text-foreground bg-background background-image'>
        <Component {...pageProps} />
      </div>
      <Analytics />
    </NextUIProvider>
  )
}
