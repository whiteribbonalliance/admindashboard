'use client'

import { cache, PropsWithChildren, useState } from 'react'
import { Hydrate as RQHydrate, HydrateProps, QueryClient, QueryClientProvider as Provider } from 'react-query'

export function QueryClientProvider({ children }: PropsWithChildren) {
    const [client] = useState(new QueryClient({ defaultOptions: { queries: { staleTime: 5000 } } }))

    return <Provider client={client}>{children}</Provider>
}

export const getQueryClient = cache(() => new QueryClient())

export function Hydrate(props: HydrateProps) {
    return <RQHydrate {...props} />
}
