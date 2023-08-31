import { ICampaignDownloadUrl, IDateFilter, IUser } from '@interfaces'
import { TCampaignCode } from '@types'

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
 * Get campaign download url
 *
 * @param campaignCode The campaign code
 * @param dateFilter The date filter
 */
export async function getCampaignDownloadUrl(campaignCode: TCampaignCode, dateFilter: IDateFilter | {}) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/download-url`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(dateFilter),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign download url')
    }

    const data: ICampaignDownloadUrl = await response.json()

    return data
}

/**
 * Get campaign countries breakdown
 *
 * @param campaignCode The campaign code
 */
export async function getCampaignCountriesBreakdown(campaignCode: TCampaignCode) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/countries-breakdown`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign countries breakdown')
    }

    return response.url
}

/**
 * Get campaign source files breakdown
 *
 * @param campaignCode The campaign code
 */
export async function getCampaignSourceFilesBreakdown(campaignCode: TCampaignCode) {
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/source-files-breakdown`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' },
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign source files breakdown')
    }

    return response.url
}
