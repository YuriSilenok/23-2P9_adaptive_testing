import { useRedirect } from "../Static/utils"
import { ChangeEvent, Dispatch, FormEvent, memo, RefObject, SetStateAction, useEffect, useRef, useState } from "react";
import { showFormStore } from "../Static/store";
import { Form, Question } from "../Static/interfaces";
import { useParams } from "react-router-dom";
import { Input } from '../Components/Input'


export default function Createform () {
    useRedirect()
    const form: RefObject<Form> = useRef( sessionStorage.getItem(`createformdata`) as unknown as Form
                        ?? {
                            title: undefined, 
                            description: undefined, 
                            questions: [
                                {
                                    text: undefined, 
                                    answer_options: [
                                        {
                                            text: undefined, 
                                            is_correct: false
                                        }
                                    ]
                                }
                            ] 
                        }
    )


    return(
        <main className="createform__container" >
            <form>
                <header >
                    <label>Заголовок формы:</label>
                    <Input isPretty={false} placeholder="" name="title" />
                </header>
                <label >Описание формы:</label>
                <textarea name="description" /> 
                <section>
                    {form.current.questions.map( question => {return <Createform></Createform>})}
                </section>
            </form>
        </main>
    )
}


//     const submitHandler = (event: FormEvent<HTMLFormElement>) => {
//         event.preventDefault()
//         const data = Object.fromEntries(new FormData(event.currentTarget))
//         console.log(data)
//     }


//     return(
//         <main className="showform__container">
//             <header> <Input name="title_input" placeholder="Название формы" /> </header>
//             <form onSubmit={(event: FormEvent<HTMLFormElement>) => {
//                 submitHandler(event)
//             }} >

//                 <Input name="description_input" placeholder="Описаниие формы"/> 

//                 <section className="showform__questions">
//                     {form.questions.map(element => {
//                         return <QuestionElement key={element.header} element={element} /> 
//                     })}
//                 </section>
//                 <button type='submit' className="pretty_button" >Отправить</button>
//             </form>
//         </main>
//     )
// }


// const QuestionElement = (props: {element: Question}) => {
//     const {id} = useParams()
//     const [activeAnswer, setActiveAnswer] = useState(sessionStorage.getItem(`${props.element.header}${id}`) ?? '')
    
//     return(
//         <article className="question__container">
//             <legend className="question__legend" >{props.element.header}</legend>

//             <fieldset className="question__answers__fieldset" >
//                 {props.element.answers.map( answer => {

//                     return <AnswerElement 
//                     state={activeAnswer} 
//                     setter={setActiveAnswer} 
//                     name={props.element.header} 
//                     key={answer.label} 
//                     label={answer.label} /> 
//                 })}
//             </fieldset>
//         </article>
//     )
// }

// const AnswerElement = (answer: {state: string, setter: Dispatch<SetStateAction<string>>, label: string, name: string}) => {
//     const {id} = useParams()

//     return(
//         <article onClick={() => {
//             if (answer.state === answer.label) {
//                 answer.setter('')
//                 sessionStorage.setItem(`${answer.name}${id}`, '')
//                 return
//             } else {
//             answer.setter(answer.label)
//             }
//             sessionStorage.setItem(`${answer.name}${id}`, answer.label)
//         }} className="answer__container">

//             <input hidden
//             onChange={ (event: ChangeEvent<HTMLInputElement>) => {event.currentTarget}} 
//             type="radio" 
//             className="answer__input" 
//             name={answer.name} 
//             value={answer.label}
//             checked={
//                 answer.state === answer.label 
//                 || sessionStorage.getItem(`${answer.name}${id}`) === answer.label
//             } />

//             <label className="answer__label">{answer.label}</label> 
//         </article>
//     )
// }