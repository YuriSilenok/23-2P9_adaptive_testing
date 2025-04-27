import { Link, Outlet, useNavigate } from "react-router-dom"
import ThemeSwitcher from "../Components/ThemeSwither"
import UserProfile from "../Components/UserMenu"
import logo from '../assets/logo.svg'
import { userStore } from "../Static/store"
import { useEffect } from "react"

export default function MainLOUT () {
    const nav = useNavigate()
    const { nick, status  } = userStore()

    useEffect(() => {
        window.location.pathname === '/' && nick 
        ? [ 
            status === 'Student' 
            ? nav('/forstudent')
            : nav('/forteacher')
        ] 
        : null}
        , [window.location.pathname])

    return(
        <>
            <div id="main-nav">
                <img id="icon" src={logo} onClick={() => {nav('/forstudent')}} /> 
                <nav className="top-nav">
                </nav>
                <aside>
                    {window.location.pathname === '/users/autorize' ? null : <UserProfile /> }    
                    <ThemeSwitcher />
                </aside>
            </div>
            <Outlet />
        </>
    )
}