
import { replace, useNavigate } from 'react-router-dom'
import {apiUrl, APIUrls} from '../config/api.constants'
import { userStore } from '../stores/userStore'
import { Form } from '../types/interfaces'

class ApiServiceClass {
    private navigate: ReturnType<typeof useNavigate> | null = null

    setNavigate = (navigate: ReturnType<typeof useNavigate>) => {
        this.navigate = navigate
    }

    useNavigate = (path: string, replace: boolean = false) => {
        this.navigate ? this.navigate(path, {replace: replace}) : console.log('еще не инициализирован')
    }

    requestToServer = (URL: apiUrl, init?: RequestInit, ignoreUnautorize: boolean = false, ignoreForbidden: boolean = false) => {
        return fetch(URL, init)
        .catch(() => {
            userStore.setState( state => ({...state, status: "serverunavailable"}))
            throw Error('503')
        })
        .then((response) => {
            if (response.ok) {
                return response.json()
            }
            else {
                if (response.status === 403 && !ignoreForbidden) {
                    this.useNavigate('/403', true)
                    throw Error
                }
                if (response.status === 401 && !ignoreUnautorize) {
                    userStore.setState(state => ({...state, status: 'unautorized'}))
                    throw Error

                }
                throw Error(String(response.status))
            }
        })
    }
}

export const ApiService = new ApiServiceClass()


export const logoutUser = async () => {
    return fetch(
        APIUrls.logOutURL,
        {
            method: 'post',
            credentials: 'include',
        }
    )
}


export const pingPoll = (pollID: number) => {
    return ApiService.requestToServer(
        APIUrls.pingPollURL(pollID),
        {
            credentials: 'include'
        }
    )
}


export const loginUser = (body: string) => {
    return  ApiService.requestToServer(
        APIUrls.logInURL,
        {
            method: 'POST',
            credentials: "include",
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: body
        }
        ,true
    )
}


export const registerUser = async (body: string) => {
    return ApiService.requestToServer(
        APIUrls.registerURL,
        {
            method: 'POST',
            headers: {
                "Content-type": "application/json"
            },
            body: body
        }
    )
}

export const createPoll = (poll: string) => {
    return ApiService.requestToServer(
        APIUrls.createPollURL,
        {
            credentials: 'include',
            method: 'post',
            headers: {
                'Content-Type': "application/json"
            },
            body: poll
        }
    )
}

export const getPoll = (pollID: number) => {
    return ApiService.requestToServer(
        APIUrls.getPollURL(pollID),
        {
            credentials: 'include'
        }
    )
}

export const submitAnswers = (pollID: number, body: ReturnType<typeof JSON.stringify>) => {
    return ApiService.requestToServer(
        APIUrls.submitAnswersURL(pollID),
        {
            credentials: 'include',
            method: 'post',
            headers: {
                "Content-Type": "application/json"
            },
            body: body
        }
    )
}

export const getStats = () => {
    return ApiService.requestToServer(
        APIUrls.checkPollURL,
        {
            credentials: 'include'
        }
    )
}