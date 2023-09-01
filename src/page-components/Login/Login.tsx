'use client'

import { Box } from '@components/Box'
import { Input } from '@components/Input'
import { Control, Controller, SubmitHandler, useForm } from 'react-hook-form'
import { loginFormSchema, TLoginForm } from '@schemas/login-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@components/Button'
import { loginUser } from '@services/wra-dashboard-api'
import { useRouter } from 'next/navigation'
import { useUserStore } from '@stores/user'
import { useState } from 'react'
import { Path } from '@enums'

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
        defaultValues: { username: 'admin', password: '123QWE,./' },
        resolver: zodResolver(loginFormSchema),
    })

    // On submit form
    const onSubmit: SubmitHandler<TLoginForm> = async (data) => {
        const formData = new FormData()
        formData.append('username', data.username)
        formData.append('password', data.password)

        try {
            const user = await loginUser(formData)
            setUser(user)
            setLoginError('')
            router.push(Path.DASHBOARD)
        } catch (error) {
            setLoginError('Login failed')
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
