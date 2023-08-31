import { CampaignCode } from '@enums'

export type TCampaignCode = typeof CampaignCode[keyof typeof CampaignCode]
