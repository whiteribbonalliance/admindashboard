import '@styles/globals.scss'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import React from 'react'
import { classNames } from '@utils'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import { AuthCheck } from 'components/AuthCheck'
import { QueryClientProvider } from '@providers/QueryClientProvider'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

export const metadata: Metadata = {
    title: 'Admin dashboard',
    description: 'Admin dashboard',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${inter.variable}`}>
            <body className={classNames('text-base')}>
                <Header />
                <AuthCheck>
                    <main className="mx-7 my-7">
                        <QueryClientProvider>{children} </QueryClientProvider>
                    </main>
                </AuthCheck>
                <Footer />
            </body>
        </html>
    )
}
