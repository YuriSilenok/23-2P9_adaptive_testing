export const URL = 'http://localhost:8001' as const

export const APIUrls = {
    usersMeURL: `${URL}/auth/users/me`,
    logInURL: `${URL}/auth/login`,
    logOutURL: `${URL}/auth/logout`,
    registerURL: `${URL}/auth/register`,
    createPollURL: `${URL}/auth/create_poll`,
    pingPollURL: (pollID: number) : `${typeof URL}/auth/ping_poll/${number}` => `${URL}/auth/ping_poll/${pollID}`,
    getPollURL: (pollID: number): `${typeof URL}/auth/get_poll/${number}` => `${URL}/auth/get_poll/${pollID}`,
    submitAnswersURL: (pollID: number): `${typeof URL}/auth/polls/${number}/submit-answers/` => `${URL}/auth/polls/${pollID}/submit-answers/`,
    checkPollURL: `${URL}/auth/polls/check`,
} as const


export type apiUrl = {
    [K in keyof typeof APIUrls]: 
        typeof APIUrls[K] extends (pollID: number) => any ? ReturnType<typeof APIUrls[K]> : typeof APIUrls[K]
}[keyof typeof APIUrls]
