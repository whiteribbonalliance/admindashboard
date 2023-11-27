import { IDataLoading, IDateFilter, IToken, IUser } from '@interfaces'
import { TCampaignCode } from '@types'
import { downloadCsvBlob, getCsvFileNameFromHeaders } from '@utils'
import { CampaignCode, CookieName } from '@enums'
import Cookies from 'js-cookie'

/**
 * Get api url
 *
 * @param campaignCode The campaign code
 */
function getApiUrl(campaignCode?: TCampaignCode) {
    let apiUrl: string
    if (campaignCode === CampaignCode.WHAT_YOUNG_PEOPLE_WANT) {
        apiUrl = process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL
    } else {
        apiUrl = process.env.NEXT_PUBLIC_WRA_DASHBOARD_API_URL
    }

    return apiUrl
}

/**
 * Get token
 *
 * @param campaignCode The campaign code
 */
function getToken(campaignCode?: TCampaignCode) {
    let token: string
    if (campaignCode === CampaignCode.WHAT_YOUNG_PEOPLE_WANT) {
        token = Cookies.get(CookieName.TOKEN_2) ?? ''
    } else {
        token = Cookies.get(CookieName.TOKEN_1) ?? ''
    }

    return token
}

/**
 * Login user at WRA
 *
 * @param formData The form data
 */
export async function loginUserAtWra(formData: FormData) {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Failed to login user at WRA.')
    }

    const data: IToken = await response.json()

    return data
}

/**
 * Login user at PMNCH
 *
 * @param formData The form data
 */
export async function loginUserAtPmnch(formData: FormData) {
    const apiUrl = getApiUrl(CampaignCode.WHAT_YOUNG_PEOPLE_WANT)
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Failed to login user at PMNCH.')
    }

    const data: IToken = await response.json()

    return data
}

// /**
//  * Logout user
//  */
// export async function logoutUser() {
//     return await fetch(`${apiUrl}/auth/logout`, {
//         method: 'POST',
//     })
// }

/**
 * Check user
 */
export async function checkUser() {
    const apiUrl = getApiUrl()
    const token = getToken()
    const response = await fetch(`${apiUrl}/auth/check`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
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
    const apiUrl = getApiUrl(campaignCode)
    const token = getToken(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
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
    const apiUrl = getApiUrl(campaignCode)
    const token = getToken(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data/countries-breakdown`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    const apiUrl = getApiUrl(campaignCode)
    const token = getToken(campaignCode)
    const response = await fetch(`${apiUrl}/campaigns/${campaignCode}/data/source-files-breakdown`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    const apiUrl = getApiUrl()
    const token = getToken()
    const response = await fetch(`${apiUrl}/data/loading-status`, {
        method: 'GET',
        headers: {
            Authorization: `Bearer ${token}`,
        },
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
    const apiUrl = getApiUrl()
    const token = getToken()
    const response = await fetch(`${apiUrl}/data/reload`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
    })

    if (!response.ok) {
        throw new Error('Failed to reload data.')
    }
}
