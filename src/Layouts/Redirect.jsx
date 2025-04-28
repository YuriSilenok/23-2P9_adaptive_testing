import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userStore } from "../Static/store";

export default function MainRedirect ({checkAccount = false}) {
    const nav = useNavigate()
    const {nick} = userStore()
    useEffect(() => {if (checkAccount) {
        !nick 
        ? nav('/users/autorize')
        : null
    } else {
        nav('/users/autorize')
    }})

    return(
        <Outlet />
    )
}