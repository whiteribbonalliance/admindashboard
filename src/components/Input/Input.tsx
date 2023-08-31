import React from 'react'

interface IInputProps {
    id: string
    placeHolder: string
    controllerRenderOnChange: (...event: any[]) => void
    value: string
    type: 'text' | 'password'
}

export const Input = ({ id, placeHolder, controllerRenderOnChange, value, type }: IInputProps) => {
    return (
        <input
            id={id}
            className="w-0 min-w-full rounded-md border border-[#CCC] p-1.5"
            type={type}
            placeholder={placeHolder}
            value={value}
            onChange={(value) => {
                controllerRenderOnChange(value)
            }}
        />
    )
}
