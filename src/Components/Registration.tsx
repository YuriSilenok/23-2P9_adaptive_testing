import React, { DialogHTMLAttributes, FormEvent, Ref, RefObject, useRef, useState } from "react"
import { themeStore, ThrowStore, useUrl } from "../Static/store"
import axios from "axios"
import { Form, useNavigate } from "react-router-dom"
import { RegistrationForm } from "../Static/interfaces"
import { Input } from "./Base"

export default function Regisration () {
    const dialog: RefObject<HTMLDialogElement | null> = useRef(null)
    const user: RefObject<{login: string, password: string}> = useRef({login:'',password:''})
    const {URL} = useUrl()
    const {ThrowMsg} = ThrowStore()

    
    
    function validity(form: HTMLFormElement):HTMLFormElement | null {
        const Form = Object.fromEntries(new FormData(form)) as Partial<RegistrationForm>
        if ( !( Form.name && Form.name.length >= 3 ) ) {
            ThrowMsg('name', form)
        }
    }

    async function handleRegistration (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        
        let data = await fetch(`${URL.hostname}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // body: JSON.stringify( form )
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
                <form onSubmit={ (event:FormEvent<HTMLFormElement>) => {event.preventDefault(), dialog.current?.showModal(),validity(event.currentTarget)} } id="registration-form">

                    <legend>Регистрация</legend>

                    <Input 
                    name='username' 
                    onChange={(event) => {
                        user.current.login = event.currentTarget.value
                    }} />                     

                    <Input 
                    name='name' 
                    onChange={undefined} /> 

                    <Input 
                    name="telegram_link" 
                    onChange={undefined} /> 

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

                    <Input 
                    name='password' 
                    onChange={(event) => {
                        user.current.password = event.currentTarget.value
                    }} /> 

                    <Input 
                    name='repeat' 
                    onChange={undefined} /> 

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