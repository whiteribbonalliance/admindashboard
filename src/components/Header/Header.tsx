'use client'

import { useUserStore } from '@stores/user'
import { Button } from '@components/Button'
import { logoutUser } from '@services/wra-dashboard-api'
import { useRouter } from 'next/navigation'

export const Header = () => {
    const user = useUserStore((state) => state.user)
    const setUser = useUserStore((state) => state.setUser)
    const router = useRouter()

    // Logout
    async function logout() {
        try {
            await logoutUser()
            setUser(undefined)
            router.push('/login')
        } catch (error) {}
    }

    return (
        <div className="flex justify-between border-b-2 border-gray-200 p-5">
            <div />
            <div className="text-4xl">Admin dashboard</div>
            <div>
                {user && (
                    <div onClick={logout}>
                        <Button text="Logout" type="button" />
                    </div>
                )}
            </div>
        </div>
    )
}
