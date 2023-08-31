import { ICampaignDownloadUrl, IConfiguration, IDateFilter, IUser } from '@interfaces'

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
 * @param config The campaign configuration
 * @param dateFilter The date filter
 */
export async function getCampaignDownloadUrl(config: IConfiguration, dateFilter: IDateFilter) {
    const response = await fetch(`${apiUrl}/campaigns/${config.campaignCode}/download-url`, {
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
