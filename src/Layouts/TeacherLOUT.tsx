import { Outlet, useNavigate } from "react-router-dom";
import React from "react";

export default function TeacherLout() {
    const nav = useNavigate()
    return (
        <section className="teacher-container">
            <form  >
                <button type="button" className="main_button button" >Создать новую<br /> форму</button>
                <button type="button" className="main_button button" onClick={() => {nav('/forteacher/results')}} >Сходить нахуй</button>
            </form>
        </section>
    )
}