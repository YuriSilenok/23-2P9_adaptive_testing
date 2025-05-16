import { Pathname } from "history"
import { Path, useNavigate } from "react-router-dom"
import { userStore } from "./store"
import { useEffect } from "react"
const PathDepends = {
    'student': ['/forstudent', '/showform'],
    'teacher': ['/forteacher', '/createform'],
}

export const useRedirect = (redirectURI?: Pathname) => {
    console.log('start')
    const nav = useNavigate()
    const userstatus = userStore().status
    const URL = window.location.pathname
    console.log(userstatus, URL,PathDepends.student.includes(URL))
    useEffect(() => {
        if (
            userstatus === 'student' && PathDepends.teacher.includes(URL) || userstatus === 'teacher' && PathDepends.student.includes(URL)
        ) {nav(redirectURI ? redirectURI : `/for${userstatus}`), console.log('redirected')}
    }, [URL])
    return
}