import { z } from 'zod'

export const loginFormSchema = z.object({
    username: z.string().nonempty('Field cannot be empty'),
    password: z.string().nonempty('Field cannot be empty'),
})

export type TLoginForm = z.infer<typeof loginFormSchema>
