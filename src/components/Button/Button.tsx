import { classNames } from '@utils'

interface IButtonProps {
    text: string
    type: 'submit' | 'reset' | 'button' | undefined
    onClick?: () => void
    disabled?: boolean
}

export const Button = ({ text, type, onClick, disabled = false }: IButtonProps) => {
    // On button click
    function onButtonClick() {
        if (!disabled) {
            if (onClick) onClick()
        }
    }

    return (
        <button
            onClick={onButtonClick}
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
