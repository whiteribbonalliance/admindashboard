'use client'

import { ReactNode, useEffect, useState } from 'react'
import { check, logoutUser } from '@services/wra-dashboard-api'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { Path } from '@enums'

interface IAuthProps {
    children: ReactNode
}

const publicPaths = [Path.LOGIN as string]

export const AuthCheck = ({ children }: IAuthProps) => {
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)
    const [authCheckSuccess, setAuthCheckSuccess] = useState<boolean | undefined>(undefined)
    const [showPageContent, setShowPageContent] = useState<boolean>(false)
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
                    await logoutUser()
                } catch (error) {}
                setUser(undefined)
            }

            // Auth check failed
            setAuthCheckSuccess(false)
        }
    }

    // Auth check
    useEffect(() => {
        setAuthCheckSuccess(undefined)
        doAuthCheck().then()
    }, [pathname])

    // Check if page content can be shown
    useEffect(() => {
        setShowPageContent(false)

        // Not logged in & auth check failed
        if (!user && authCheckSuccess === false) {
            if (!publicPaths.includes(pathname)) {
                router.push(Path.LOGIN)
                setShowPageContent(false)
            } else {
                setShowPageContent(true)
            }
        }

        // Logged in & auth check success
        else if (user && authCheckSuccess === true) {
            if (publicPaths.includes(pathname)) {
                router.push(Path.DASHBOARD)
                setShowPageContent(false)
            } else {
                setShowPageContent(true)
            }
        }
    }, [user, authCheckSuccess, setShowPageContent, router, pathname])

    if (showPageContent) {
        return <div>{children}</div>
    } else {
        return <div className="m-5 flex justify-center">Loading...</div>
    }
}
