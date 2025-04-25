import { use } from "react"

type Status = 'Student' | 'Teacher'
type login = string


interface User {
    name: string,
    password: string,
    status: Status
}

interface Auth {
    login: string,
    password: string,
    remember: boolean,
    formdata?: FormDataEntryValue
}

const Users:User[] = [
    {
        name: "1",
        password: '1',
        status: 'Student'
    },
    {
        name: 'janpol',
        password:'12345',
        status: "Teacher"
    }
]

function Identification<T>(nick: T){
    for (const user of Users) {
        if (user.name === nick) {
            return true
        }
    }   
    return false
}

const Authentification = (nick: string, pass: string| number) => {
    for (const user of Users) {
        if (user.name === nick) {
            if (user.password === pass) {
                return user
            }
        }
    }
    return false
}

export {Authentification, Identification, Auth}