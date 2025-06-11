import { Link, Outlet, Routes, useNavigate } from "react-router-dom"
import ThemeSwitcher from "../Components/ThemeSwither"
import UserProfile from "../Components/UserMenu"
import logo from '../assets/logo.svg'
import {userStore} from "../stores/userStore"
import React ,{ useEffect, useRef } from "react"
import { WaitModal } from "../Components/WaitModal"
import { isPathAvailable, Paths } from "../config/routes.config"

export default function MainLOUT () {
    const nav = useNavigate()
    const status = userStore().status
    const wm = useRef(null)
    
    useEffect(
        () => {
            if (['student', "teacher"].includes(status) && !isPathAvailable(status)) {
                nav(`/for${status}`)
            } 

            if (status === 'forbidden' && !isPathAvailable('forbidden')) {
                nav("/403")
            }

            if (status === 'unautorized' && !isPathAvailable('unautorized')) {
                nav("/users/autorize")
            }

            if (status === 'serverunavailable') {
                nav('/503')
            }
    })

    if (status === 'undefined') {
        return <WaitModal ref={wm} isOpen /> 
    }
    console.log(status)
    

    return(
        <>
            <nav id="main-nav">
                <img id="icon" src={logo} onClick={() => {
                    sessionStorage.removeItem('formdata')
                    status === 'student'
                    ? nav('/forstudent')
                    : nav('/forteacher')
                }} /> 
                <nav className="top-nav">
                </nav>
                <aside>
                    {window.location.pathname === '/users/autorize' ? null : <UserProfile /> }    
                    <ThemeSwitcher />
                    <svg onClick={() => {
                        const newWindow = window.open("", "_self")
                        newWindow?.close()
                    }} viewBox="0 0 16 16" width="25" height="25" display="inline-block" overflow="visible" >
                        <path d="M2 2.75C2 1.784 2.784 1 3.75 1h2.5a.75.75 0 0 1 0 1.5h-2.5a.25.25 0 0 0-.25.25v10.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2 13.25Zm10.44 4.5-1.97-1.97a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215l3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734l1.97-1.97H6.75a.75.75 0 0 1 0-1.5Z"></path>
                    </svg>
                </aside>
            </nav>
            <Outlet />
        </>
    )
}