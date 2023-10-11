'use client'

import { Box } from '@components/Box'
import { useUserStore } from '@stores/user'
import { classNames, getCampaignConfig } from '@utils'
import { Button } from '@components/Button'
import { TCampaignCode } from '@types'
import React, { useEffect, useState } from 'react'
import {
    downloadCampaignCountriesBreakdown,
    downloadCampaignData,
    downloadCampaignSourceFilesBreakdown,
} from '@services/wra-dashboard-api'
import { IConfiguration, IDateFilter } from '@interfaces'
import { Tab } from '@headlessui/react'
import DatePicker from 'react-datepicker'

interface ITabContentProps {
    campaignCode: TCampaignCode
}

interface IDownloaderProps {
    campaignCode: TCampaignCode
    campaignConfig: IConfiguration
}

interface IButtonAreaProps {
    download: () => Promise<void>
    isGeneratingData: boolean
    noDataFound: boolean
}

export const Dashboard = () => {
    const user = useUserStore((state) => state.user)
    const campaignCodes = user ? user?.campaign_access : []

    return (
        <div>
            <div className="flex w-full justify-center">
                <div className="flex w-full flex-col items-center gap-y-10">
                    {campaignCodes.length > 0 &&
                        campaignCodes.map((campaignCode) => {
                            const campaignConfig = getCampaignConfig(campaignCode)
                            if (!campaignConfig) return null
                            return (
                                <Downloader
                                    key={campaignCode}
                                    campaignCode={campaignCode}
                                    campaignConfig={campaignConfig}
                                />
                            )
                        })}
                </div>
            </div>
        </div>
    )
}

const Downloader = ({ campaignCode, campaignConfig }: IDownloaderProps) => {
    // Tabs
    const tabs = [
        {
            id: 'campaign-data',
            title: 'Campaign data',
            TabContent: DownloadCampaignData,
        },
        {
            id: 'country-breakdown',
            title: 'Countries breakdown',
            TabContent: DownloadCountriesBreakdown,
        },
        {
            id: 'Source files breakdown',
            title: 'Source files breakdown',
            TabContent: DownloadSourceFilesBreakdown,
        },
    ]

    return (
        <div className="w-full max-w-5xl">
            <div className="mb-2 text-xl font-bold">{campaignConfig.title}</div>
            <div>
                <Box>
                    <div className="flex flex-col gap-y-3">
                        <Tab.Group>
                            <Tab.List data-tooltip-id="download" className="flex flex-col gap-x-2.5 sm:flex-row">
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
                                    <Tab.Panel key={id} unmount={false} className="w-full">
                                        {TabContent && <TabContent campaignCode={campaignCode} />}
                                    </Tab.Panel>
                                ))}
                            </Tab.Panels>
                        </Tab.Group>
                    </div>
                </Box>
            </div>
        </div>
    )
}

const DownloadCampaignData = ({ campaignCode }: ITabContentProps) => {
    const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false)
    const [noDataFound, setNoDataFound] = useState<boolean>(false)
    const [selectedOption, setSelectedOption] = useState<string>('all')
    const [dateFilter, setDateFilter] = useState<IDateFilter | {}>({})
    const [fromDate, setFromDate] = useState<Date | undefined>(undefined)
    const [toDate, setToDate] = useState<Date | undefined>(undefined)

    // On option change
    function onOptionChange(e: React.ChangeEvent<HTMLInputElement>) {
        setSelectedOption(e.target.value)
    }

    // Download function
    const download = async () => {
        try {
            // Get url
            setIsGeneratingData(true)
            setNoDataFound(false)
            await downloadCampaignData(campaignCode, dateFilter)
            setIsGeneratingData(false)
        } catch (error) {
            setIsGeneratingData(false)
            setNoDataFound(true)
        }
    }

    // Set date filter
    useEffect(() => {
        if (fromDate && toDate) {
            const fromDateAsString = `${fromDate.getFullYear()}-${fromDate.getMonth() + 1}-${fromDate.getDate()}`
            const toDateAsString = `${toDate.getFullYear()}-${toDate.getMonth() + 1}-${toDate.getDate()}`
            setDateFilter({ from_date: fromDateAsString, to_date: toDateAsString })
        }
    }, [fromDate, toDate])

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

            {/* Date picker */}
            {selectedOption === 'date-range' && (
                <div className="mb-5 flex items-center gap-x-2">
                    <div>From</div>
                    <DatePicker
                        className="mr-3 rounded-md px-2 py-1"
                        dateFormat="d MMM yyyy"
                        selected={fromDate}
                        onChange={(date) => {
                            if (date) setFromDate(date)
                        }}
                    />
                    <div>To</div>
                    <DatePicker
                        className="rounded-md px-2 py-1"
                        dateFormat="d MMM yyyy"
                        selected={toDate}
                        onChange={(date) => {
                            if (date) setToDate(date)
                        }}
                    />
                </div>
            )}
            <ButtonArea download={download} isGeneratingData={isGeneratingData} noDataFound={noDataFound} />
        </div>
    )
}

const DownloadCountriesBreakdown = ({ campaignCode }: ITabContentProps) => {
    const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false)
    const [noDataFound, setNoDataFound] = useState<boolean>(false)

    // Download function
    const download = async () => {
        try {
            // Get url
            setIsGeneratingData(true)
            setNoDataFound(false)
            await downloadCampaignCountriesBreakdown(campaignCode)
            setIsGeneratingData(false)
        } catch (error) {
            setIsGeneratingData(false)
            setNoDataFound(true)
        }
    }

    return (
        <div>
            <div className="mb-5">Download countries breakdown</div>
            <ButtonArea download={download} isGeneratingData={isGeneratingData} noDataFound={noDataFound} />
        </div>
    )
}

const DownloadSourceFilesBreakdown = ({ campaignCode }: ITabContentProps) => {
    const [isGeneratingData, setIsGeneratingData] = useState<boolean>(false)
    const [noDataFound, setNoDataFound] = useState<boolean>(false)

    // Download function
    const download = async () => {
        try {
            // Get url
            setIsGeneratingData(true)
            setNoDataFound(false)
            await downloadCampaignSourceFilesBreakdown(campaignCode)
            setIsGeneratingData(false)
        } catch (error) {
            setIsGeneratingData(false)
            setNoDataFound(true)
        }
    }

    return (
        <div>
            <div className="mb-5">Download source files breakdown</div>
            <ButtonArea download={download} isGeneratingData={isGeneratingData} noDataFound={noDataFound} />
        </div>
    )
}

const ButtonArea = ({ download, isGeneratingData, noDataFound }: IButtonAreaProps) => {
    return (
        <div>
            {/* Button */}
            <div onClick={!isGeneratingData ? download : undefined}>
                <Button text="Download" type="button" disabled={isGeneratingData} />
            </div>

            {/* Generating data text */}
            {isGeneratingData && (
                <div className="mt-3 rounded-md bg-green-200 p-1.5 text-green-900">
                    Generating data, this might take a while...
                </div>
            )}

            {/* No data text */}
            {noDataFound && (
                <div className="mt-3 rounded-md bg-red-100 p-1.5 text-sm text-red-700">
                    Could not get data or data does not exist
                </div>
            )}
        </div>
    )
}
