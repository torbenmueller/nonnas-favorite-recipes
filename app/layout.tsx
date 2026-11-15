import type { Metadata } from 'next'
import './globals.css'
import '@fontsource/italianno'
import '@fontsource/lobster'
import { ScrollToTopOnBack } from '@/components/scroll-to-top-on-navigation'

export const metadata: Metadata = {
  title: 'Nonna\'s Favorite Recipes',
  description: 'Discover authentic Italian recipes',
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ScrollToTopOnBack />
        {children}
      </body>
    </html>
  )
}
