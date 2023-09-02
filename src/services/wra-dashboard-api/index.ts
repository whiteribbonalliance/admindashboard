import { IDateFilter, IUser } from '@interfaces'
import { TCampaignCode } from '@types'
import { downloadBlob, getExcelFileNameFromHeaders } from '@utils'

const apiUrl = process.env.NEXT_PUBLIC_WRA_DASHBOARD_API_URL

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
 * Check user
 */
export async function checkUser() {
    const response = await fetch(`${apiUrl}/auth/check`, {
        method: 'POST',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to check user')
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
        throw new Error('Failed to fetch campaign data')
    }

    // Get file name from headers
    const filename = getExcelFileNameFromHeaders(response.headers)

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
        throw new Error('Failed to fetch campaign countries breakdown')
    }

    // Get file name from headers
    const filename = getExcelFileNameFromHeaders(response.headers)

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
        throw new Error('Failed to fetch campaign source files breakdown')
    }

    // Get file name from headers
    const filename = getExcelFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadBlob(blob, filename)
}
