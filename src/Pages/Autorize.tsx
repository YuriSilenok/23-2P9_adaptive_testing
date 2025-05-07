import { useNavigate } from "react-router-dom"
import React, { FormEvent, useEffect, useRef } from "react"
import { Authentification, Identification, Auth } from "../Static/Users"
import { userStore } from "../Static/store"
import { Input } from "../Components/Input"

export default function Autorize () {

    const nav = useNavigate()
    const {DelUser, RegUser} = userStore()
    const queryParams = new URLSearchParams(window.location.search)

    function handleAuth (event: FormEvent<HTMLFormElement>) {
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
            <form onSubmit={(event) => {handleAuth(event)}} id="auth-form">

                <Input name="login" min={3} max={50} defaultValue={ queryParams.get('login') ?? '' } invalidMessage="Некорректное имя пользователя" />
                
                <Input name="password" min={3} max={50} defaultValue={ queryParams.get('password') ?? '' } invalidMessage="Некорректный пароль" />

                <div id="checkbox-container"> 
                    <input name="remember" id="remember" type='checkbox' />
                    <label htmlFor="#remember"> Запомнить меня</label>
                </div>
                <button type='submit' className="main_button" >Авторизоваться</button>
                <div onClick={ () => { nav('/users/registration') } } id="reg-link" >Нет аккаунта?<br /><span>ЗАРЕГИСТРИРОВАТЬСЯ!</span></div>
            </form>
            {/* <svg xmlns="http://www.w3.org/2000/svg" width="25" height="24" viewBox="0 0 25 24" fill="none">
                <path d="M10.6699 2.75C14.674 2.75 17.9199 5.99594 17.9199 10C17.9199 11.7319 17.3127 13.3219 16.2995 14.5688L21.2003 19.4697C21.4931 19.7626 21.4931 20.2374 21.2003 20.5303C20.934 20.7966 20.5173 20.8208 20.2237 20.6029L20.1396 20.5303L15.2387 15.6295C13.9918 16.6427 12.4018 17.25 10.6699 17.25C6.66586 17.25 3.41992 14.0041 3.41992 10C3.41992 5.99594 6.66586 2.75 10.6699 2.75ZM10.6699 4.25C7.49428 4.25 4.91992 6.82436 4.91992 10C4.91992 13.1756 7.49428 15.75 10.6699 15.75C13.8456 15.75 16.4199 13.1756 16.4199 10C16.4199 6.82436 13.8456 4.25 10.6699 4.25Z" fill="white"></path>
            </svg> */}
        </div>
    )
}