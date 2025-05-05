import React, { DialogHTMLAttributes, FormEvent, Ref, RefObject, useRef, useState } from "react"
import { themeStore, useUrl } from "../Static/store"
import axios from "axios"
import { Form, useNavigate } from "react-router-dom"

export default function Regisration () {
    const dialog: RefObject<HTMLDialogElement | null> = useRef(null)
    const user: RefObject<{login: string, password: string}> = useRef({login:'',password:''})
    
    const {URL} = useUrl()

    async function handleRegistration (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const form = Object.fromEntries( await new FormData(event.currentTarget))
        let data = await fetch(`${URL.hostname}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify( form )
        })
        switch (data.status) {
            case 200:
                dialog.current?.showModal()
        }
    }

    return(
        <>
            <section className="registration-container">
                <Modal ref={dialog} user={user} />
                <form onSubmit={ (event:FormEvent<HTMLFormElement>) => {event.preventDefault(), dialog.current?.showModal()} } id="registration-form">

                    <legend>Регистрация</legend>
                    <input type="text" 
                    placeholder="username" 
                    className="input" 
                    autoComplete="off" 
                    datatype="off" 
                    name="username"
                    onChange={(event) => {user.current.login = event.currentTarget.value}} />

                    <input type="text" 
                    placeholder="name" 
                    className="input" 
                    autoComplete="off" 
                    datatype="off" 
                    name="name" />

                    <input type="text"
                    placeholder="telegram link"
                    className="input"
                    defaultValue="https:t.me//example.com/"
                    name="telegram_link"/>

                    <fieldset>
                        <legend>Выберите роль:</legend>

                        <div>
                            <input type="radio" checked
                            name="role"
                            defaultValue='teacher'
                            className="main_radio"
                            id="for_teacher"/>

                            <label htmlFor="for_teacher">Учитель</label>

                            <input type="radio"
                            name="role"
                            defaultValue='student'
                            className="main_radio"
                            id="for_student"
                            checked
                            />
                            
                            <label htmlFor="for_student">Студент</label>
                        </div>


                    </fieldset>

                    <input 
                    type="password" 
                    placeholder="password" 
                    className="input" 
                    name="password" 
                    onChange={(event) => {user.current.password = event.currentTarget.value}}/>

                    <input 
                    type="password"
                    placeholder="repeat password"
                    className="input"
                    // name="password-rp"
                    />
                    <button type='submit' className="main_button">Зарегистрироваться</button>
                </form>
            </section>
        </>
    )
}

const Modal = ({ref, user}) => {
    const nav = useNavigate()

    return(
        <>
            <dialog ref={ref}>
                <p>You Are Registered</p>
                <button onClick={() => {nav(`/users/autorize?login=${user.current.login}&password=${user.current.password}`)}} >Авторизоваться</button>
            </dialog>
        </>
    )
}