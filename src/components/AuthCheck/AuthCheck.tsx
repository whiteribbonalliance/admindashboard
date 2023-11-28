'use client'

import { ReactNode, useEffect, useState } from 'react'
import { checkUser } from '@services/wra-dashboard-api'
import { usePathname, useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { CookieName, Path } from '@enums'
import Cookies from 'js-cookie'
import { getUserFromJWT } from '@utils'

interface IAuthProps {
    children: ReactNode
}

const publicPaths: string[] = []

export const AuthCheck = ({ children }: IAuthProps) => {
    const user = useUserStore((state) => state.user)
    const isLoggedIn = !!user
    const setUser = useUserStore((state) => state.setUser)
    const [authCheckSuccess, setAuthCheckSuccess] = useState<boolean | undefined>(undefined)
    const [showPageContent, setShowPageContent] = useState<boolean>(false)
    const pathname = usePathname()
    const router = useRouter()
    const token1 = Cookies.get(CookieName.TOKEN_1) ?? ''

    // Do auth check
    // If auth check succeeds, user object is set
    // If auth check fails, user object is removed
    useEffect(() => {
        ;(async () => {
            setAuthCheckSuccess(undefined)

            try {
                // Check
                await checkUser()

                // Get user
                const user = getUserFromJWT(token1)

                // Set user
                setUser(user)

                // Auth check success
                setAuthCheckSuccess(true)
            } catch (error) {
                // Remove user
                if (isLoggedIn) {
                    Cookies.remove(CookieName.TOKEN_1)
                    Cookies.remove(CookieName.TOKEN_2)
                    setUser(undefined)
                }

                // Auth check failed
                setAuthCheckSuccess(false)
            }
        })()
    }, [pathname, isLoggedIn, setUser, token1])

    // Check if page content can be shown
    // Or else redirect to another page
    useEffect(() => {
        if (authCheckSuccess === undefined) return

        // Public paths can always be shown
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
