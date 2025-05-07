import React, { FormEvent, Ref, RefObject, useRef, useState } from "react"
import { themeStore, ThrowStore, useUrl } from "../Static/store"
import axios from "axios"
import { Form, useNavigate } from "react-router-dom"
import { RegistrationForm } from "../Static/interfaces"
import { Input } from "../Components/Input"

export default function Regisration () {
    const SuccessfulModal: RefObject<HTMLDialogElement | null> = useRef(null)
    const WaitingModal: RefObject<HTMLDialogElement | null> = useRef(null)
    const user: RefObject<{login: string, password: string}> = useRef({login:'',password:''})
    const {URL} = useUrl()
    const {ThrowMsg} = ThrowStore()

    
    function validate(form: HTMLFormElement) {
        const Form = Object.entries(Object.fromEntries(new FormData(form)) as Partial<RegistrationForm>)
        let password: string = ''
        let flag: boolean = true
        for (const [field, value] of Form) {
            
            if (field === 'password' && value ) {
                password = value
            } 

            if (field === 'repeat' && value) {
                if (value === password) {
                } else {
                    ThrowMsg('repeat', form)
                    flag = false
                    continue
                }
            }

            if (!value || value.length < 3) {
                ThrowMsg(field, form)
                flag = false
                continue
            }

            
        }
        return flag ?  Form : false
    }
    
    function handleRegistration (event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        const validatedForm = validate(event.currentTarget)
        if (validatedForm) {

            const registrationPromise = new Promise((resolve, reject) => {

                const responce = fetch(`${URL.hostname}/auth/register`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(Object.fromEntries(validatedForm))
                })

                responce
                .then((data:Response) => {
                    data.ok 
                    ? resolve(data)
                    : reject(data)
                })
                .catch((err:Response) => {alert('Проблемки с интернетом'), reject(err)})

            })
            registrationPromise
            .then((data) => {SuccessfulModal.current?.showModal()})
            .catch((err) => {console.log(err)})
        }
    }


    return(
        <>
            <section className="registration-container">
                <Modal ref={SuccessfulModal} user={user} />
                <dialog ref={WaitingModal} className="WaitModal" >
                    <div className="WaitModal__container">
                        <div id="circle1"></div>
                        <div id="circle2"></div>
                        <div id="circle3"></div>
                        <div id="square"></div>
                    </div> 
        </dialog>
                <form onSubmit={ (event:FormEvent<HTMLFormElement>) => { handleRegistration(event) } } id="registration-form">

                    <legend>Регистрация</legend>

                    <Input 
                    name='username' 
                    onChange={(event) => {
                        user.current.login = event.currentTarget.value
                    }} invalidMessage="Некорректный логин" />

                    <Input 
                    name='name' 
                    onChange={undefined}
                    invalidMessage="Некорректное имя пользователя" /> 

                    <Input 
                    name="telegram_link" 
                    onChange={undefined}
                    defaultValue="https://t.me/example-user.com" /> 

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
                    onChange={undefined}
                    invalidMessage="Пароли не совпадают" /> 

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
            <dialog className="SuccessfulModal" ref={ref}>
                <p>Вы зарегистрированы!</p>
                <button className="main_button" onClick={() => { nav(`/users/autorize?login=${user.current.login}&password=${user.current.password}`)}} >Авторизоваться</button>
            </dialog>
        </>
    )
}