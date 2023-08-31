import { classNames } from '@utils'

interface IButtonProps {
    text: string
    type: 'submit' | 'reset' | 'button' | undefined
}

export const Button = ({ text, type = undefined }: IButtonProps) => {
    return (
        <button
            className={classNames(
                'flex w-full items-center justify-center whitespace-nowrap rounded-md bg-blue-700 px-3 py-2.5 text-xl font-bold text-white hover:bg-blue-500'
            )}
            type={type}
        >
            <div className="flex items-center justify-center">{text}</div>
        </button>
    )
}
