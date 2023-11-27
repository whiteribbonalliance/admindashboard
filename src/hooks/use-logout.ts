'use client'

// import { logoutUser } from '@services/wra-dashboard-api'
import { useUserStore } from '@stores/user'
import { useRouter } from 'next/navigation'
import { CookieName, Path } from '@enums'
import Cookies from 'js-cookie'

export const useLogout = () => {
    const router = useRouter()
    const setUser = useUserStore((state) => state.setUser)

    // Logout user
    async function logout() {
        try {
            Cookies.remove(CookieName.TOKEN_1)
            Cookies.remove(CookieName.TOKEN_2)
            setUser(undefined)
            router.push(Path.LOGIN)
        } catch (error) {}
    }

    return logout
}
