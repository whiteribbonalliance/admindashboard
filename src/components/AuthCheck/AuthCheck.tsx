'use client'

import { ReactNode, useEffect, useState } from 'react'
import { check, logout } from '@services/wra-dashboard-api'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'

interface IAuthProps {
    children: ReactNode
}

const publicPaths = ['/login']

export const AuthCheck = ({ children }: IAuthProps) => {
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)
    const [authCheckSuccess, setAuthCheckSuccess] = useState<boolean | undefined>(undefined)
    const pathname = usePathname()
    const router = useRouter()

    // Do auth check
    async function doAuthCheck() {
        try {
            // Get user
            const user = await check()

            // Set user
            setUser(user)

            // Auth check succeeded
            setAuthCheckSuccess(true)
        } catch (error) {
            // Remove user
            if (user) {
                try {
                    await logout()
                } catch (error) {}
                setUser(undefined)
            }

            // Auth check failed
            setAuthCheckSuccess(false)
        }
    }

    useEffect(() => {
        setAuthCheckSuccess(undefined)
        doAuthCheck().then()
    }, [pathname])

    // Auth check in progress
    if (authCheckSuccess === undefined) {
        return <Loading />
    }

    // Not logged in & auth check failed
    if (!user && !authCheckSuccess) {
        if (!publicPaths.includes(pathname)) {
            router.push('/login')
            return <Loading />
        }
        return <div>{children}</div>
    }

    // Logged in & auth check success
    if (user && authCheckSuccess) {
        if (publicPaths.includes(pathname)) {
            router.push('/dashboard')
            return <Loading />
        }
        return <div>{children}</div>
    }

    return <Loading />
}

const Loading = () => {
    return <div className="m-5 flex justify-center">Loading...</div>
}
