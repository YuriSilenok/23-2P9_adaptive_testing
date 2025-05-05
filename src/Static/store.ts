import { create, StoreApi } from "zustand";
import {userStoreShema, userShema, ShowFormShema, Form} from './interfaces'
import {Theme} from './types.ts'
import { HookHandler, ServerHook } from "vite";
import { ReactInstance } from "react";


export const userStore = create<userStoreShema>( set => ({
    status: JSON.parse(
                (localStorage.getItem('userdata')
                ?? sessionStorage.getItem('userdata')) 
                ?? '{"status": null}' 
            ).status,

    nick : JSON.parse(
            (localStorage.getItem('userdata') 
            ?? sessionStorage.getItem('userdata')) 
            ?? `{"nick": null}`
        ).nick,
    token: null,
    RegUser: (data: Partial<userShema>, isRemember: boolean) => {
        set({
            nick : data.nick,
            status : data.status,
            token : data.token,
        }),
        isRemember 
        ? localStorage.setItem('userdata', JSON.stringify(data))
        : sessionStorage.setItem('userdata', JSON.stringify(data))
    },
    DelUser: () => {
        set({
            nick: undefined,
            status: 'Student',
            token: undefined
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

export const showFormStore = create<ShowFormShema>( set => ({
    form: {
        title: 'some title',
        description : 'some description',
        questions: [
            {
                header: 'question 1 label',
                answers : [
                    {
                        label : 'answer 1 for question 1',
                    },
                    {
                        label : 'answer 2 for question 1'
                    }
                ]
            },
            {
                header: 'question 2 label',
                answers : [
                    {
                        label : 'answer 1 for question 2',
                    },
                    {
                        label : 'answer 2 for question 2'
                    }
                ]
            }
        ]
    },

    setForm : (fom: Form) => set({
        form: {
            title: fom.title,
            description: fom.description,
            questions: fom.questions
        }
    })
}))


export const useUrl = create<{URL: Partial<URL>}>(() => ({
    URL: {
        hostname: "http://127.0.0.1:8001"
    }
}))

