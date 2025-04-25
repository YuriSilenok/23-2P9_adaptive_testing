import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { userStore } from "../Static/store";

export default function MainRedirect ({forAuth = false}) {
    const nav = useNavigate()
    const {nick} = userStore()
    useEffect(() => {if (forAuth) {
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