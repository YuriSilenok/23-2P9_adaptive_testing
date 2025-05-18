import { ChangeEvent, FormEvent, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../Components/Input"
import React from "react"
import axios from "axios"
import { Waitmodal, WaitModal } from '../Components/WaitModal'
import { useRedirect } from "../Static/utils"
import { ThrowStore } from "../Static/store"

export default function StudentNavigator () {
    useRedirect()
    const {ThrowMsg} = ThrowStore()
    const navigate = useNavigate()
    const waitmodal: Waitmodal = useRef(null)


    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        waitmodal.current?.showModal()
        console.log('ksodj')
        const form = event.currentTarget
        const data = Object.fromEntries(new FormData(event.currentTarget))
        const request = axios.get(`http://localhost:8001/auth/ping_poll/${data.id}`, {
            withCredentials: true
        })
        request
        .then(() => {
            navigate(`/showform?id=${data.id}`)
            waitmodal.current?.close()
        })
        .catch(() => {
            waitmodal.current?.close()
            ThrowMsg('id', form) 
        })
    }

    const handleChange = (e: InputEvent) => {
        (e.currentTarget! as HTMLInputElement).value = (e.currentTarget! as HTMLInputElement).value.replace(/[^\d]/g, '')
    };

    return(
        <>
            <main className="studentnavigator__container">
                <WaitModal ref={waitmodal} /> 
                <form 
                onSubmit={(event: FormEvent<HTMLFormElement>) => {
                    handleSubmit(event)
                }} 
                id="studentnavigator__form" >

                    <legend>Найти форму</legend>

                    <Input isPretty required
                    name="id" 
                    onChange={(event: InputEvent) => 
                        handleChange(event)
                    } 
                    max={8} min={1} 
                    invalidMessage="Неверный ID теста" />

                    <button 
                    className="pretty_button" 
                    title="connect" 
                    type="submit" >
                        Подключиться
                    </button>

                </form>
            </main>
        </>
    )
}