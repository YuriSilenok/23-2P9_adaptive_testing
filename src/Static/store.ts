import { create, StoreApi } from "zustand";
import {userStoreShema, userShema, ShowFormShema, Form} from './interfaces'
import {Theme} from './types.ts'

export const userStore = create<userStoreShema>( set => ({
    status: JSON.parse(
                (localStorage.getItem('userdata')
                ?? sessionStorage.getItem('userdata')) 
                ?? '{"status": "student"}' 
            ).status,

    nick : JSON.parse(
            (localStorage.getItem('userdata') 
            ?? sessionStorage.getItem('userdata')) 
            ?? `{"nick": null}`
        ).nick,
    RegUser: (data: Partial<userShema>, isRemember: boolean) => {
        set({
            nick : data.nick,
            status : data.status,
        }),
        isRemember 
        ? localStorage.setItem('userdata', JSON.stringify(data))
        : sessionStorage.setItem('userdata', JSON.stringify(data))
    },
    DelUser: () => {
        set({
            nick: undefined,
            status: 'student',
        }),
        localStorage.removeItem('userdata')
        sessionStorage.removeItem('userdata')
    }
}))


export const themeStore = create(set => ({
    theme:<Theme> 'light',

    init: () => {
        if (localStorage.getItem('theme') === 'dark') {
            set({theme: 'dark'})
            document.documentElement.classList.add('theme-dark')
            return true
        }
        return false
    },
    
    toggleTheme: () => {
        if (!localStorage.getItem('theme')) {
            localStorage.setItem('theme', 'dark') 
            set({theme : 'dark'})
            document.documentElement.classList.add('theme-dark')
        } else {
        localStorage.getItem('theme') === 'light' 
            ? [localStorage.setItem('theme', 'dark'), set({theme : 'dark'}), document.documentElement.classList.add('theme-dark')] 
            : [localStorage.setItem('theme', 'light'), set({theme : 'light'}), document.documentElement.classList.remove('theme-dark')]
        }
    }
}))