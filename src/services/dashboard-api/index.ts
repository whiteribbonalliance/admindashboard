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

import { ICampaignConfiguration, IDataLoading, IDateFilter, IToken, IUser } from '@interfaces'
import { downloadCsvBlob, getCsvFileNameFromHeaders } from '@utils'
import { CookieName } from '@enums'
import Cookies from 'js-cookie'

/**
 * Get api url
 *
 * @param campaignCode The campaign code
 */
function getApiUrl(campaignCode?: string) {
    let apiUrl: string
    if (process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL && campaignCode === 'pmn01a') {
        apiUrl = process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL
    } else {
        apiUrl = process.env.NEXT_PUBLIC_DASHBOARD_API_URL
    }

    return apiUrl
}

/**
 * Get token
 *
 * @param campaignCode The campaign code
 */
function getToken(campaignCode?: string) {
    let token: string
    if (process.env.NEXT_PUBLIC_PMNCH_DASHBOARD_API_URL && campaignCode === 'pmn01a') {
        token = Cookies.get(CookieName.TOKEN_2) ?? ''
    } else {
        token = Cookies.get(CookieName.TOKEN_1) ?? ''
    }

    return token
}

/**
 * Login user
 *
 * @param formData The form data
 */
export async function loginUser(formData: FormData) {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/auth/login`, {
        method: 'POST',
        body: formData,
    })

    if (!response.ok) {
        throw new Error('Failed to login user.')
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
    const apiUrl = getApiUrl('pmn01a')
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
export async function downloadCampaignData(campaignCode: string, dateFilter: IDateFilter | {}) {
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
export async function downloadCampaignCountriesBreakdown(campaignCode: string) {
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
export async function downloadCampaignSourceFilesBreakdown(campaignCode: string) {
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
    const response = await fetch(`${apiUrl}/data/loading-status`, {
        method: 'GET',
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

/**
 * Get campaigns configurations.
 */
export async function getCampaignsConfigurations() {
    const apiUrl = getApiUrl()
    const response = await fetch(`${apiUrl}/configurations`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
    })

    if (!response.ok) {
        throw new Error('Failed to fetch campaigns configurations.')
    }

    const data: ICampaignConfiguration[] = await response.json()

    return data
}
