'use client'

import { logoutUser } from '@services/wra-dashboard-api'
import { useUserStore } from '@stores/user'
import { useRouter } from 'next/navigation'
import { Path } from '@enums'

export const useLogout = () => {
    const router = useRouter()
    const setUser = useUserStore((state) => state.setUser)

    // Logout user
    async function logout() {
        try {
            await logoutUser()
            setUser(undefined)
            router.push(Path.LOGIN)
        } catch (error) {}
    }

    return logout
}
