import { ReactNode } from 'react'

interface IBoxProps {
    children: ReactNode
}

export const Box = ({ children }: IBoxProps) => {
    return <div className="h-full rounded-md bg-gray-200 p-4">{children}</div>
}
