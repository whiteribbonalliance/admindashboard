'use client'

import { Box } from '@components/Box'
import { Input } from '@components/Input'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import { loginFormSchema, TLoginForm } from '@schemas/login-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@components/Button'
import { loginUserAtPmnch, loginUserAtWra } from '@services/wra-dashboard-api'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { useState } from 'react'
import { CookieName, Path } from '@enums'
import Cookies from 'js-cookie'
import { getUserFromJWT } from '@utils'

interface IInputProps {
    id: string
    control: Control<TLoginForm>
}

export const Login = () => {
    const router = useRouter()
    const [loginError, setLoginError] = useState<string>('')
    const setUser = useUserStore((state) => state.setUser)

    // Form
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<TLoginForm>({
        defaultValues: { username: '', password: '' },
        resolver: zodResolver(loginFormSchema),
    })

    // On submit form
    const onSubmit: SubmitHandler<TLoginForm> = async (data) => {
        const formData = new FormData()
        formData.append('username', data.username)
        formData.append('password', data.password)

        // Login at WRA
        // Auth check to keep login state of app will be done at the WRA API (see AuthCheck.tsx)
        let loginWraSuccess = false
        try {
            // Get token
            const token1 = await loginUserAtWra(formData)

            // Get user
            const user = getUserFromJWT(token1.access_token)

            // Set cookie
            Cookies.set(CookieName.TOKEN_1, token1.access_token, {
                secure: true,
                expires: Math.floor(token1.max_age / 86400),
                sameSite: 'lax',
            })

            // Set user
            setUser(user)

            loginWraSuccess = true
        } catch (error) {
            setLoginError('Login failed')
        }

        // Login at PMNCH
        // For communicating with the PMNCH API
        if (loginWraSuccess && (data.username === 'admin' || data.username === 'whatyoungpeoplewant')) {
            try {
                // Get token
                const token2 = await loginUserAtPmnch(formData)

                // Set cookie
                Cookies.set(CookieName.TOKEN_2, token2.access_token, {
                    secure: true,
                    expires: Math.floor(token2.max_age / 86400),
                    sameSite: 'lax',
                })
            } catch (error) {}
        }

        // On login WRA success
        if (loginWraSuccess) {
            setLoginError('')
            router.push(Path.DASHBOARD)
        }
    }

    return (
        <div className="flex justify-center">
            <div className="w-full max-w-md">
                <Box>
                    <div>
                        <h1 className="mb-5 text-center text-2xl">Login</h1>
                        {/* Login form */}
                        <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                            {loginError && (
                                <p className="mb-3 rounded-md bg-red-100 p-1.5 text-center text-sm text-red-700">
                                    {loginError}
                                </p>
                            )}
                            <div className="mb-3">
                                <InputUsername id="input-username" control={control} />
                                <p className="mt-1 text-sm text-red-700">{errors.username?.message}</p>
                            </div>
                            <div className="mb-5">
                                <InputPassword id="input-password" control={control} />
                                <p className="mt-1 text-sm text-red-700">{errors.password?.message}</p>
                            </div>
                            <div>
                                <Button text="Login" type="submit" />
                            </div>
                        </form>
                    </div>
                </Box>
            </div>
        </div>
    )
}

const InputUsername = ({ id, control }: IInputProps) => {
    return (
        <Controller
            name="username"
            control={control}
            render={({ field: { onChange, value } }) => (
                <Input
                    id={id}
                    placeHolder={'Enter username...'}
                    controllerRenderOnChange={onChange}
                    value={value}
                    type="text"
                />
            )}
        />
    )
}

const InputPassword = ({ id, control }: IInputProps) => {
    return (
        <Controller
            name="password"
            control={control}
            render={({ field: { onChange, value } }) => (
                <Input
                    id={id}
                    placeHolder={'Enter password...'}
                    controllerRenderOnChange={onChange}
                    value={value}
                    type="password"
                />
            )}
        />
    )
}
