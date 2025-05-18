
import { Status} from './types'

interface userStoreShema {
    nick: string | undefined,
    status: 'teacher' | 'student',
    RegUser: (data:userShema, isRemember: boolean) => void,
    DelUser: Function
}

export interface RegistrationForm {
    nickname: string
    name:string
    telegram_link: string
    role: 'student' | 'teacher'
    password: string
    password_rp: string
}

interface userShema {
    nick: string | undefined,
    status: 'teacher' | 'student',
}

interface Answer {
    text: string
}

export interface Question {
    text: string,
    answer_options: Answer[]
}

interface Form {
    title: string,
    description: string,
    questions: Question[]
}

interface ShowFormShema {
    form: Form,
    setForm: (_:Form) => void
}

export {userShema, userStoreShema, ShowFormShema, Form}

