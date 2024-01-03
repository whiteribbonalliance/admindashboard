/*
MIT License

Copyright (c) 2023 White Ribbon Alliance. Maintainers: Thomas Wood, https://fastdatascience.com, Zairon Jacobs, https://zaironjacobs.com.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

'use client'

import { Box } from '@components/Box'
import { Input } from '@components/Input'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import { loginFormSchema, TLoginForm } from '@schemas/login-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@components/Button'
import { loginUserAtPmnch, loginUser } from 'services/dashboard-api'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { useState } from 'react'
import { CookieName, Path } from '@enums'
import Cookies from 'js-cookie'
import { getUserFromJWT } from '@utils'
import * as process from 'process'

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

        // Login
        // Auth check to keep login state of app will be done at the API (see AuthCheck.tsx)
        let loginSuccess = false
        try {
            // Get token
            const token1 = await loginUser(formData)

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

            loginSuccess = true
        } catch (error) {
            setLoginError('Login failed')
        }

        // Login at PMNCH
        // For communicating with the PMNCH API
        if (process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL) {
            if (loginSuccess && (data.username === 'admin' || data.username === 'pmn01a')) {
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
        }

        // On login success
        if (loginSuccess) {
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
