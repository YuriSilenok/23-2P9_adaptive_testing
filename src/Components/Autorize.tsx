import { useNavigate } from "react-router-dom"
import React, { FormEvent, useEffect, useRef } from "react"
import { Authentification, Identification, Auth } from "../Static/Users"
import { userStore } from "../Static/store"

export default function Autorize () {

    const nav = useNavigate()
    const {DelUser, RegUser} = userStore()

    function handleSubmit (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const data = Object.fromEntries(new FormData(event.currentTarget)) as unknown as Auth
        if (Identification(data.login)) {
            const AuthData = Authentification(data.login, data.password)
            if (AuthData) {
                RegUser({nick: AuthData.name, status: AuthData.status}, data.remember )
                nav('/')

            } else {
                console.log("Неверный пароль")
            }
        } else {
            console.log("Неверный логин")
        }
    }

    return(
        <div className="auth-container">
            <h2>Авторизация</h2>
            <form onSubmit={(event) => {handleSubmit(event)}} id="auth-form">
                <input
                    maxLength={7} 
                    autoComplete="nope" 
                    placeholder="login" 
                    className="input"
                    name="login" />
                <input 
                    type='password'
                    maxLength={10} 
                    autoComplete="new-pw" 
                    placeholder="password" 
                    className="input"
                    datatype="new"
                    name="password" />
                <div id="checkbox-container"> 
                    <input name="remember" id="remember" checked={true} type='checkbox' />
                    <label htmlFor="#remember"> Запомнить меня</label>
                </div>
                <button type='submit' id="button">Авторизоваться</button>
                <div onClick={ () => { nav('/users/registration') } } id="reg-link" >Нет аккаунта?<br /><span>ЗАРЕГИСТРИРОВАТЬСЯ!</span></div>
            </form>
            
        </div>
    )
}