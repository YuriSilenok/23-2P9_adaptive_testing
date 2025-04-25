import {Question, Status} from './types'


interface userStoreShema {
    nick: string | undefined,
    status: Status,
    token: string | null,
    RegUser: (data:userShema, isRemember: boolean) => void,
    DelUser: Function
}

interface userShema {
    nick: string | undefined,
    status: Status,
    token?: string | null
}

interface ShowFormShema {
    title: string,
    description: string,
    questions: [Question]
}

export {userShema, userStoreShema, ShowFormShema}

