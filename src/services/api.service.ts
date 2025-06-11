
import {apiUrl, APIUrls} from '../config/api.constants'

const requestToServer = (URL: apiUrl, init?: RequestInit) => {
    return fetch(URL, init)
    .catch(() => {
        throw Error('503')
    })
    .then((response) => {
        if (response.ok) {
            return response.json()
        } else {
            throw Error(String(response.status))
        }
    })
}


export const pingUser = async () => {
    const response = await fetch(
        APIUrls.usersMeURL,
        {
            credentials: 'include',
        }
    )

    if (!response.ok) {
        if (response.status === 403) {
            logoutUser()
        }
        throw Error(String(response.status))
    }
    console.log('response returned')
    return response.json()
}


export const logoutUser = async () => {
    return fetch(
        APIUrls.logOutURL,
        {
            method: 'post',
            credentials: 'include'
        }
    )
}


export const pingPoll = (pollID: number) => {
    return requestToServer(
        APIUrls.pingPollURL(pollID),
        {
            credentials: 'include'
        }
    )
}


export const loginUser = (body: string) => {
    return  requestToServer(
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
    )
}


export const registerUser = async (body: string) => {
    return requestToServer(
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