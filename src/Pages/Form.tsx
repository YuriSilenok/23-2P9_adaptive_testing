import { memo, useEffect } from "react";
import { showFormStore } from "../Static/store";
import React from "react";

export default function ShowForm () {
    const {form} = showFormStore()
    useEffect( () => {
        console.warn(form)
    } ,[])

    return(
        <div className="show-form-container">
            <h2> { form.title } </h2>
            <h4> { form.description } </h4>
            <div className="show-form-questions">
                {form.questions.map(element => {
                    console.warn(element)
                    return <Question element={element} /> 
                })}
            </div>
        </div>
    )
}


const Question = ({element}) => {
    return(
        <div className="question-container">
            <input className="question-checkbox" type="checkbox" />
        </div>
    )
}