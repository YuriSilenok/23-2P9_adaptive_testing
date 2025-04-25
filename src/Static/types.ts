type Question = {
    header: string,
    answers: [label: string]
}

type Theme = 'light' | 'dark'

type Status = 'Student' | 'Teacher' | unknown

export {Question, Theme, Status}