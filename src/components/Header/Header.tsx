'use client'

import { useUserStore } from '@stores/user'
import { Button } from '@components/Button'
import { useLogout } from '@hooks/use-logout'

export const Header = () => {
    const user = useUserStore((state) => state.user)
    const logout = useLogout()

    return (
        <div className="flex h-24 items-center justify-between border-b-2 border-gray-200 p-5">
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
