import { CampaignCode } from '@enums'
import {
    economicEmpowermentMexicoConfig,
    healthwellbeingConfig,
    midwivesVoicesConfig,
    whatWomenWantConfig,
    whatWomenWantPakistanConfig,
    whatYoungPeopleWantConfig,
} from '@configurations'
import { TCampaignCode } from '@types'
import { v4 as uuidv4 } from 'uuid'

/**
 * Merge Tailwind CSS classes
 *
 * @param classes Tailwind CSS classes
 */
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}

/**
 * Get campaign config
 *
 * @param campaignCode The campaign code
 */
export function getCampaignConfig(campaignCode: TCampaignCode) {
    switch (campaignCode) {
        case CampaignCode.WHAT_WOMEN_WANT:
            return whatWomenWantConfig
        case CampaignCode.WHAT_YOUNG_PEOPLE_WANT:
            return whatYoungPeopleWantConfig
        case CampaignCode.MIDWIVES_VOICES:
            return midwivesVoicesConfig
        case CampaignCode.HEALTHWELLBEING:
            return healthwellbeingConfig
        case CampaignCode.ECONOMIC_EMPOWERMENT_MEXICO:
            return economicEmpowermentMexicoConfig
        case CampaignCode.WHAT_WOMEN_WANT_PAKISTAN:
            return whatWomenWantPakistanConfig
    }
}

/**
 * Get Excel file name from headers.
 * If the filename is not present in headers, a random filename will be generated.
 *
 * @param headers Headers
 */
export function getExcelFileNameFromHeaders(headers: Headers) {
    const contentDisposition = headers.get('content-disposition')
    let filename = ''
    if (contentDisposition) {
        filename = contentDisposition.split('filename=')[1]
    }
    if (filename === '') {
        filename = `${uuidv4().replace('-', '')}.xlsx`
    }

    return filename
}

/**
 * Download blob
 *
 * @param blob The Blob
 * @param filename The filename
 */
export function downloadBlob(blob: Blob, filename: string) {
    const file = new File([blob], filename)
    const url = URL.createObjectURL(file)
    window.open(url, '_blank')
    URL.revokeObjectURL(url)
}
