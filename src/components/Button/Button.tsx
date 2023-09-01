import { classNames } from '@utils'

interface IButtonProps {
    text: string
    type: 'submit' | 'reset' | 'button' | undefined
    disabled?: boolean
}

export const Button = ({ text, type, disabled = false }: IButtonProps) => {
    return (
        <button
            className={classNames(
                'flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-700 px-3 py-2.5 text-xl font-bold text-white',
                disabled ? 'bg-gray-300 hover:cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-500'
            )}
            type={type}
        >
            <div className="flex items-center justify-center">{text}</div>
        </button>
    )
}
