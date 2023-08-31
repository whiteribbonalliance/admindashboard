import { IDateFilter, IUser } from '@interfaces'
import { TCampaignCode } from '@types'
import { downloadBlob, getFileNameFromHeaders } from '@utils'

const apiUrl = process.env.NEXT_PUBLIC_WRA_DASHBOARD_API_URL as string

/**
 * Login user
 *
 * @param formData The form data
 */
export async function loginUser(formData: FormData) {
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: formData,
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to login user')
    }

    const data: IUser = await response.json()

    return data
}

/**
 * Logout user
 */
export async function logoutUser() {
    return await fetch(`${apiUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
    })
}

/**
 * Check
 */
export async function check() {
    const response = await fetch(`${apiUrl}/auth/check`, {
        method: 'POST',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to login user')
    }

    const data: IUser = await response.json()

    return data
}

/**
 * Download campaign data
 *
 * @param campaignCode The campaign code
 * @param dateFilter The date filter
 */
export async function downloadCampaignData(campaignCode: TCampaignCode, dateFilter: IDateFilter | {}) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dateFilter),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign data url')
    }

    // Get file name from headers
    const filename = getFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadBlob(blob, filename)
}

/**
 * Download campaign countries breakdown
 *
 * @param campaignCode The campaign code
 */
export async function downloadCampaignCountriesBreakdown(campaignCode: TCampaignCode) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/countries-breakdown`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign countries breakdown url')
    }

    // Get file name from headers
    const filename = getFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadBlob(blob, filename)
}

/**
 * Download campaign source files breakdown
 *
 * @param campaignCode The campaign code
 */
export async function downloadCampaignSourceFilesBreakdown(campaignCode: TCampaignCode) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/source-files-breakdown`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign source files breakdown url')
    }

    // Get file name from headers
    const filename = getFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadBlob(blob, filename)
}
