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
    getDataLoadingStatus,
    reloadData,
} from '@services/wra-dashboard-api'
import { IConfiguration, IDataLoading, IDateFilter } from '@interfaces'
import { Tab } from '@headlessui/react'
import DatePicker from 'react-datepicker'
import { CampaignCode } from '@enums'
import { useQuery, UseQueryResult } from 'react-query'

interface ITabContentProps {
    campaignCode: TCampaignCode
    dataLoadingQuery?: UseQueryResult<IDataLoading>
}

interface IDataDownloaderProps {
    campaignCode: TCampaignCode
    campaignConfig: IConfiguration
    dataLoadingQuery?: UseQueryResult<IDataLoading>
}

interface IButtonAreaProps {
    download: () => Promise<void>
    isGeneratingData: boolean
    noDataFound: boolean
    dataLoadingQuery?: UseQueryResult<IDataLoading>
}

interface IDataLoaderProps {
    dataLoadingQuery: UseQueryResult<IDataLoading>
}

export const Dashboard = () => {
    const user = useUserStore((state) => state.user)
    let userCampaignCodes = user ? user?.campaign_access : []
    const isAdmin = user ? user.is_admin : false
    const campaignCodes: TCampaignCode[] = []

    // Data loading query
    const dataLoadingQuery = useQuery<IDataLoading>({
        queryFn: () => {
            return getDataLoadingStatus()
        },
        refetchInterval: 10000,
        refetchOnWindowFocus: true,
        refetchOnReconnect: true,
    })

    // Check if campaign code from user exists
    for (const campaignCode of userCampaignCodes) {
        if (Object.values(CampaignCode).includes(campaignCode)) {
            campaignCodes.push(campaignCode)
        }
    }

    return (
        <div className="flex w-full justify-center">
            <div className="flex w-full max-w-5xl flex-col justify-center gap-y-10">
                {isAdmin && (
                    <>
                        {/* Data reloader */}
                        <div className="flex flex-col items-center">
                            <div className="flex w-full flex-col items-center">
                                <DataReloader dataLoadingQuery={dataLoadingQuery} />
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="border-2 border-b border-gray-200" />
                    </>
                )}

                {/* Data downloader per campaign */}
                <div className="flex flex-col items-center">
                    <div className="flex w-full flex-col items-center gap-y-10">
                        {campaignCodes.length > 0 &&
                            campaignCodes.map((campaignCode) => {
                                const campaignConfig = getCampaignConfig(campaignCode)
                                if (!campaignConfig) return null
                                return (
                                    <DataDownloader
                                        key={campaignCode}
                                        campaignCode={campaignCode}
                                        campaignConfig={campaignConfig}
                                        dataLoadingQuery={dataLoadingQuery}
                                    />
                                )
                            })}
                    </div>
                </div>
            </div>
        </div>
    )
}

const DataDownloader = ({ campaignCode, campaignConfig, dataLoadingQuery }: IDataDownloaderProps) => {
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
                                        {TabContent && (
                                            <TabContent
                                                campaignCode={campaignCode}
                                                dataLoadingQuery={dataLoadingQuery}
                                            />
                                        )}
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

const DownloadCampaignData = ({ campaignCode, dataLoadingQuery }: ITabContentProps) => {
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
            <ButtonArea
                download={download}
                isGeneratingData={isGeneratingData}
                noDataFound={noDataFound}
                dataLoadingQuery={dataLoadingQuery}
            />
        </div>
    )
}

const DownloadCountriesBreakdown = ({ campaignCode, dataLoadingQuery }: ITabContentProps) => {
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
            <ButtonArea
                download={download}
                isGeneratingData={isGeneratingData}
                noDataFound={noDataFound}
                dataLoadingQuery={dataLoadingQuery}
            />
        </div>
    )
}

const DownloadSourceFilesBreakdown = ({ campaignCode, dataLoadingQuery }: ITabContentProps) => {
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
            <ButtonArea
                download={download}
                isGeneratingData={isGeneratingData}
                noDataFound={noDataFound}
                dataLoadingQuery={dataLoadingQuery}
            />
        </div>
    )
}

const ButtonArea = ({ download, isGeneratingData, noDataFound, dataLoadingQuery }: IButtonAreaProps) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    // Set is disabled
    useEffect(() => {
        if (dataLoadingQuery?.data) {
            if (dataLoadingQuery.data.is_loading || isGeneratingData) {
                setIsDisabled(true)
            } else {
                setIsDisabled(false)
            }
        }
    }, [dataLoadingQuery?.data, isGeneratingData])

    return (
        <div>
            {/* No data text */}
            {dataLoadingQuery?.data?.is_loading && (
                <div className="mb-3 mt-3 rounded-md bg-orange-100 p-1.5 text-sm text-orange-700">
                    Data loading in progress, please wait...
                </div>
            )}

            {/* Button */}
            <Button text="Download" type="button" onClick={!isDisabled ? download : undefined} disabled={isDisabled} />

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

const DataReloader = ({ dataLoadingQuery }: IDataLoaderProps) => {
    const [isDisabled, setIsDisabled] = useState<boolean>(true)

    // Set data loading status
    let dataLoadingStatus = ''
    if (dataLoadingQuery.data) {
        if (dataLoadingQuery.data.is_loading) {
            dataLoadingStatus = 'Loading data...'
        } else {
            dataLoadingStatus = 'Loading data complete'
        }
    }

    // Reload data
    function onReloadDataClick() {
        if (dataLoadingQuery.data) {
            if (!dataLoadingQuery.data.is_loading) {
                setIsDisabled(true)
                reloadData()
                    .then(() => {
                        dataLoadingQuery.refetch().then()
                    })
                    .catch(() => {})
            }
        }
    }

    // Set is disabled
    useEffect(() => {
        if (dataLoadingQuery?.data) {
            setIsDisabled(dataLoadingQuery.data.is_loading)
        } else {
            setIsDisabled(true)
        }
    }, [dataLoadingQuery.data])

    return (
        <div className="w-full max-w-5xl">
            <div>
                <Box>
                    <div className="flex flex-col gap-y-3">
                        <div className="text-lg font-bold">Status: {dataLoadingStatus}</div>
                        <div>
                            <Button text="Reload now" type="button" onClick={onReloadDataClick} disabled={isDisabled} />
                        </div>
                    </div>
                </Box>
            </div>
        </div>
    )
}
