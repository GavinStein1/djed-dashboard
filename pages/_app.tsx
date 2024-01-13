import '@/styles/globals.css'
import '@/styles/output.css'
import type { AppProps } from 'next/app'
import {NextUIProvider} from "@nextui-org/react"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <NextUIProvider>
      <div className='light text-foreground bg-background'>
        <Component {...pageProps} />
      </div>
    </NextUIProvider>
  )
}
