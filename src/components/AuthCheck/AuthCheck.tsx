'use client'

import { ReactNode, useEffect, useState } from 'react'
import { checkUser, logoutUser } from '@services/wra-dashboard-api'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { Path } from '@enums'

interface IAuthProps {
    children: ReactNode
}

const publicPaths: string[] = ['/test']

export const AuthCheck = ({ children }: IAuthProps) => {
    const user = useUserStore((state) => state.user)
    const isLoggedIn = !!user
    const setUser = useUserStore((state) => state.setUser)
    const [authCheckSuccess, setAuthCheckSuccess] = useState<boolean | undefined>(undefined)
    const [showPageContent, setShowPageContent] = useState<boolean>(false)
    const pathname = usePathname()
    const router = useRouter()

    // Do auth check
    // If auth check succeeds, user object is set
    // If auth check fails, user object is removed
    useEffect(() => {
        ;(async () => {
            setAuthCheckSuccess(undefined)

            try {
                // Get user
                const user = await checkUser()

                // Set user
                setUser(user)

                // Auth check success
                setAuthCheckSuccess(true)
            } catch (error) {
                // Remove user
                if (isLoggedIn) {
                    try {
                        await logoutUser()
                    } catch (error) {}
                    setUser(undefined)
                }

                // Auth check failed
                setAuthCheckSuccess(false)
            }
        })()
    }, [pathname, isLoggedIn, setUser])

    // Check if page content can be shown
    // Or else redirect to another page
    useEffect(() => {
        if (authCheckSuccess === undefined) return

        // Public paths can be shown
        if (publicPaths.includes(pathname)) {
            setShowPageContent(true)
            return
        }

        // Auth check failed
        if (!authCheckSuccess) {
            if (pathname !== Path.LOGIN) {
                router.push(Path.LOGIN)
            } else {
                setShowPageContent(true)
            }
        }

        // Auth check success
        else {
            if (pathname === Path.LOGIN) {
                router.push(Path.DASHBOARD)
            } else {
                setShowPageContent(true)
            }
        }
    }, [authCheckSuccess, router, pathname])

    if (showPageContent) {
        return <div>{children}</div>
    } else {
        return <div className="m-5 flex justify-center">Loading...</div>
    }
}
