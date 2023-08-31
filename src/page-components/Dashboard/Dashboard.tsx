'use client'

import { Box } from '@components/Box'
import { useUserStore } from '@stores/user'
import { classNames, getCampaignConfig } from '@utils'
import { Button } from '@components/Button'
import { TCampaignCode } from '@types'
import React, { Dispatch, useEffect, useState } from 'react'
import { getCampaignDownloadUrl } from '@services/wra-dashboard-api'
import { IDateFilter } from '@interfaces'
import { saveAs } from 'file-saver'
import { Tab } from '@headlessui/react'

interface ITabContentProps {
    campaignCode: TCampaignCode
    setDownloadFunction: Dispatch<() => () => Promise<void>>
}

type TDownloadFunction = () => Promise<void>

export const Dashboard = () => {
    const user = useUserStore((state) => state.user)
    const campaignCodes = user ? user?.campaign_access : []
    const [downloadFunction, setDownloadFunction] = useState<TDownloadFunction | undefined>(undefined)

    // Tabs
    const tabs = [
        {
            id: 'campaign-data',
            title: 'Campaign data',
            TabContent: DownloadCampaignData,
        },
        {
            id: 'country-breakdown',
            title: 'Country breakdown',
            TabContent: DownloadCountryBreakdown,
        },
        {
            id: 'Source files breakdown',
            title: 'Source files breakdown',
            TabContent: DownloadSourceFilesBreakdown,
        },
    ]

    // Download
    function download() {
        if (downloadFunction) {
            downloadFunction().then()
        }
    }

    return (
        <div>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center gap-y-10">
                    {campaignCodes.length > 0 &&
                        campaignCodes.map((campaignCode) => {
                            const campaignConfig = getCampaignConfig(campaignCode)
                            if (!campaignConfig) return null

                            return (
                                <div key={campaignCode} className="w-full max-w-5xl">
                                    <div className="mb-2 text-xl font-bold">{campaignConfig.title}</div>
                                    <div>
                                        <Box>
                                            <div className="flex flex-col gap-y-3">
                                                <Tab.Group>
                                                    <Tab.List
                                                        data-tooltip-id="download"
                                                        className="flex flex-col sm:flex-row"
                                                    >
                                                        {tabs.map((tab) => (
                                                            <Tab
                                                                key={tab.id}
                                                                className={({ selected }) =>
                                                                    classNames(
                                                                        'w-full rounded-md bg-gray-300 py-5 leading-5 shadow-sm ring-transparent ring-offset-2 focus:outline-none',
                                                                        selected
                                                                            ? `border-t-2 border-t-blue-700 bg-white shadow-none`
                                                                            : 'bg-gray-300'
                                                                    )
                                                                }
                                                            >
                                                                {tab.title}
                                                            </Tab>
                                                        ))}
                                                    </Tab.List>
                                                    <Tab.Panels>
                                                        {tabs.map(({ id, TabContent }) => (
                                                            <Tab.Panel key={id} unmount={true} className="w-full">
                                                                {TabContent && (
                                                                    <TabContent
                                                                        campaignCode={campaignCode}
                                                                        setDownloadFunction={setDownloadFunction}
                                                                    />
                                                                )}
                                                            </Tab.Panel>
                                                        ))}
                                                    </Tab.Panels>
                                                </Tab.Group>
                                                <div onClick={download}>
                                                    <Button text="Download" type="button" />
                                                </div>
                                            </div>
                                        </Box>
                                    </div>
                                </div>
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

const DownloadCampaignData = ({ campaignCode, setDownloadFunction }: ITabContentProps) => {
    const [selectedOption, setSelectedOption] = useState<string>('all')
    const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false)
    const [dateFilter, setDateFilter] = useState<IDateFilter | {}>({})

    // On option change
    function onOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedOption(e.target.value)
    }

    // Download function
    const download: TDownloadFunction = async () => {
        try {
            setIsGeneratingData(true)
            const downloadUrl = await getCampaignDownloadUrl(campaignCode, dateFilter)
            setIsGeneratingData(false)
            saveAs(downloadUrl.url)
        } catch (error) {
            setIsGeneratingData(false)
        }
    }

    // Set download function
    useEffect(() => {
        setDownloadFunction(() => download)
    }, [])

    return (
        <div>
            <div className="mb-2">Download campaign data</div>
            <div className="mb-5 flex flex-col">
                <div>
                    <input
                        className="mr-2"
                        type="radio"
                        id={`${campaignCode}-download-option-1`}
                        value="all"
                        name={`${campaignCode}-download-option`}
                        checked={selectedOption === 'all'}
                        onChange={onOptionChange}
                    />
                    <label htmlFor={`${campaignCode}-download-option-1`}>All data</label>
                </div>
                <div>
                    <input
                        className="mr-2"
                        type="radio"
                        id={`${campaignCode}-download-option-2`}
                        value="date-range"
                        name={`${campaignCode}-download-option`}
                        checked={selectedOption === 'date-range'}
                        onChange={onOptionChange}
                    />
                    <label htmlFor={`${campaignCode}-download-option-2`}>Select date range</label>
                </div>
            </div>
            {selectedOption === 'date-range' && <div className="mb-3">ADD CALENDAR HERE</div>}
            {isGeneratingData && <div className="mt-1">Generating data, this might take a while...</div>}
        </div>
    )
}

const DownloadCountryBreakdown = ({ campaignCode, setDownloadFunction }: ITabContentProps) => {
    // Download function
    const download: TDownloadFunction = async () => {}

    // Set download function
    useEffect(() => {
        setDownloadFunction(() => download)
    }, [])

    return <div>{campaignCode}</div>
}

const DownloadSourceFilesBreakdown = ({ campaignCode, setDownloadFunction }: ITabContentProps) => {
    // Download function
    const download: TDownloadFunction = async () => {}

    // Set download function
    useEffect(() => {
        setDownloadFunction(() => download)
    }, [])

    return <div>{campaignCode}</div>
}
