/**
 * Merge Tailwind CSS classes
 *
 * @param classes Tailwind CSS classes
 */
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
