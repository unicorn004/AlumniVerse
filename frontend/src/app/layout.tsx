import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AlumniVerse',
  description: 'Created by Tanmay, Aditya, Aryan',
  generator: 'Scratch',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
