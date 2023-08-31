import '@styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { QueryClientProvider } from '@providers/QueryClientProvider'
import { classNames } from '@utils'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { AuthCheck } from 'components/AuthCheck'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'Admin dashboard',
    description: 'Admin dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <body className={classNames('text-base')}>
                <QueryClientProvider>
                    <Header />
                    <AuthCheck>
                        <main className="mx-7 my-7">{children}</main>
                    </AuthCheck>
                    <Footer />
                </QueryClientProvider>
            </body>
        </html>
    )
}
