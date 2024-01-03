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

import { v4 as uuidv4 } from 'uuid'
import { jwtDecode } from 'jwt-decode'
import { IUser } from '@interfaces'

/**
 * Merge Tailwind CSS classes
 *
 * @param classes Tailwind CSS classes
 */
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Get CSV file name from headers.
 * If the filename is not present in headers, a random filename will be generated.
 *
 * @param headers Headers
 */
export function getCsvFileNameFromHeaders(headers: Headers) {
    const contentDisposition = headers.get('content-disposition')
    let filename = ''
    if (contentDisposition) {
        filename = contentDisposition.split('filename=')[1]
    }
    if (filename === '') {
        filename = `${uuidv4().replace('-', '')}.csv`
    }

    return filename
}

/**
 * Download CSV blob
 *
 * @param blob The Blob
 * @param filename The filename
 */
export function downloadCsvBlob(blob: Blob, filename: string) {
    const file = new File([blob], filename, { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
}

/**
 * Get user from JWT token
 *
 * @param token The token
 */
export function getUserFromJWT(token: string) {
    try {
        const decoded = jwtDecode<{ user: IUser }>(token)
        return decoded.user
    } catch (error) {}
}
