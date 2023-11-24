import { IDataLoading, IDateFilter, IUser } from '@interfaces'
import { TCampaignCode } from '@types'
import { downloadCsvBlob, getCsvFileNameFromHeaders } from '@utils'
import { CampaignCode } from '@enums'

const apiUrl = process.env.NEXT_PUBLIC_WRA_DASHBOARD_API_URL
const apiUrlPmnch = process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL

/**
 * Get api url based on campaign code
 */
function getApiUrlByCampaignCode(campaignCode: TCampaignCode) {
    let currentApiUrl: string
    if (campaignCode === CampaignCode.WHAT_YOUNG_PEOPLE_WANT) {
        currentApiUrl = apiUrlPmnch
    } else {
        currentApiUrl = apiUrl
    }

    return currentApiUrl
}

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
        throw new Error('Failed to login user.')
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
        throw new Error('Failed to check user.')
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
    const apiUrl = getApiUrlByCampaignCode(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(dateFilter),
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign data.')
    }

    // Get file name from headers
    const filename = getCsvFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadCsvBlob(blob, filename)
}

/**
 * Download campaign countries breakdown
 *
 * @param campaignCode The campaign code
 */
export async function downloadCampaignCountriesBreakdown(campaignCode: TCampaignCode) {
    const apiUrl = getApiUrlByCampaignCode(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data/countries-breakdown`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign countries breakdown.')
    }

    // Get file name from headers
    const filename = getCsvFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadCsvBlob(blob, filename)
}

/**
 * Download campaign source files breakdown
 *
 * @param campaignCode The campaign code
 */
export async function downloadCampaignSourceFilesBreakdown(campaignCode: TCampaignCode) {
    const apiUrl = getApiUrlByCampaignCode(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data/source-files-breakdown`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaign source files breakdown.')
    }

    // Get file name from headers
    const filename = getCsvFileNameFromHeaders(response.headers)

    // Create blob
    const blob = await response.blob()

    // Download
    downloadCsvBlob(blob, filename)
}

/**
 * Get data loading status
 */
export async function getDataLoadingStatus() {
    const response = await fetch(`${apiUrl}/data/loading-status`, {
        method: 'GET',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to check data loading status.')
    }

    const data: IDataLoading = await response.json()

    return data
}

/**
 * Reload data
 */
export async function reloadData() {
    const response = await fetch(`${apiUrl}/data/reload`, {
        method: 'POST',
        credentials: 'include',
    })

    if (!response.ok) {
        throw new Error('Failed to reload data.')
    }
}
