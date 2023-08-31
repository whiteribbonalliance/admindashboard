'use client'

import { create } from 'zustand'
import { IUser } from '@interfaces'

export interface IUserStoreState {
    user: IUser | undefined
    setUser: (user: IUser | undefined) => void
}

export const useUserStore = create<IUserStoreState>((set, get) => ({
    user: undefined,

    setUser: (user) => {
        set(() => {
            return { user }
        })
    },
}))
