import { ChangeEvent, useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Input } from "../Components/Input"
import React from "react"

export default function StudentNavigator () {
    const navigate = useNavigate()


    const handleSubmit = (event) => {
        event.preventDefault()
        const data = Object.fromEntries(new FormData(event.currentTarget))
        if (!data.id) {
            alert('input form id')
            return
        }
        navigate(`/showform?id=${data.id}`)
    }

    const handleChange = (e: InputEvent) => {
        (e.currentTarget! as HTMLInputElement).value = (e.currentTarget! as HTMLInputElement).value.replace(/[^\d]/g, '')
    };

    return(
        <>
            <main className="studentnavigator__container">
                <form 
                onSubmit={(event) => {
                    handleSubmit(event)
                }} 
                id="studentnavigator__form" >

                    <legend>Найти форму</legend>

                    <Input isPretty 
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