import { useRedirect } from "../Static/utils"
import { ChangeEvent, createContext, Dispatch, FormEvent, memo, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { showFormStore } from "../Static/store";
import { Answer, Form, FormCreate, Question} from "../Static/interfaces";
import { useParams } from "react-router-dom";
import { Input } from '../Components/Input'
import { create } from "zustand";
import { Button } from "../Components/Button";
import { useImmer } from "use-immer";

const autoResizeTextarea = (textarea: HTMLTextAreaElement) => {
  textarea.style.height = 'auto'; // Сброс высоты
  textarea.style.height = `${textarea.scrollHeight}px`; // Установка новой высоты
};

export default function Createform () {
    useRedirect()

    const save = (data: any) => {
    sessionStorage.setItem('createformdata', JSON.stringify(data))
}

    const [form, setForm] = useImmer(JSON.parse(sessionStorage.getItem('createformdata') ?? JSON.stringify({
            title: '',
            description: '',
            questions: [
                {
                    text: '',
                    question_type: "single_choice",
                    answer_options: [
                        {
                            text: '',
                            is_correct: false
                        }
                    ]
                }
            ]
        })
    ) as Form)
    
    const setDescription = useCallback((text: string) => 
        setForm( draft => {
            draft.description = text
            save(draft)
    }), [])

    const setTitle = useCallback((text: string) => 
        setForm( draft => {
            draft.title = text
            save(draft)
    }), [])

    const setQuestionText = useCallback((text: string, questionID: number) => 
        setForm( draft => {
            draft.questions[questionID].text = text
            save(draft)
    }), [])  
    
    const setAnswerText = useCallback((text: string, questionID: number, answerID: number) =>
        setForm( draft => {
            draft.questions[questionID].answer_options ||= []
            draft.questions[questionID].answer_options[answerID].text = text
            save(draft)
    }), [])
    
    const addQuestion = useCallback(() => setForm( draft =>
        {draft.questions.push({
                    text: '',
                    question_type: "single_choice",
                    answer_options: [
                        {
                            text: '',
                            is_correct: false
                        }
                    ]
            })
        save(draft)}
    ), [])

    const addAnswer = useCallback((questionID: number) => 
        setForm(draft =>{
            draft.questions ||= []
            draft.questions[questionID].answer_options.push({
                            text: '',
                            is_correct: false
                        })
        save(draft)
    }),[])

    const setAnswerCorrect = useCallback((state: boolean, questionID: number, answerID: number) =>
        setForm( draft => {
            draft.questions[questionID].answer_options ||= []
            draft.questions[questionID].answer_options.forEach((answer) => {
                if (answer.id === answerID) {
                    answer.is_correct = state
                } else {answer.is_correct = false}
            })
            draft.questions[questionID].answer_options[answerID].is_correct = state
            save(draft)
    }), [])

    const sendForm = (formdata) => {
        console.log(JSON.stringify(formdata));
        
        const request = fetch('http://localhost:8001/auth/create_poll', {
            credentials: 'include',
            method: 'post',
            body: JSON.stringify(formdata),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        request
        .then(response => response.json())
        .then(data => console.log(data))
        
    }


    return(
        <main className="createform__container" >
            <form className="createform__form"
            onSubmit={(event) => {
                event.preventDefault()
                sendForm(form)
            }}>
                <header className="createform__header" >
                    <label className="createform__title__label">Заголовок формы:</label>

                    <Input isPretty
                    className="createform__title__input"
                    value={form.title}
                    onChange ={( event: ChangeEvent<HTMLInputElement> ) => 
                        setTitle(event.currentTarget.value) 
                    } 
                    placeholder="" 
                    name="title" />

                </header>

                <div className="description__container">
                    <label className="createform__description__label" >Описание формы:</label>
                    <textarea rows={1}
                    placeholder=""
                    value={form.description}
                    className="createform__description__textarea "
                    onChange ={( event: ChangeEvent<HTMLTextAreaElement> ) => {
                        setDescription(event.currentTarget.value)
                        autoResizeTextarea(event.currentTarget)
                    }}
                    name="description" />
                </div> 

                <section className="createform__questions__container">
                    {form.questions.map( (question, index) => 
                    <QuestionElement 
                    addAnswer={addAnswer}
                    key={index} 
                    question={question} 
                    id={index} 
                    answerTextSetter={setAnswerText} 
                    questionTextSetter={setQuestionText}
                    answerCorrectSetter={setAnswerCorrect} 
                    /> )}
                    <Button 
                    className="createform__addquestion__button"
                    isPretty
                    text="+ добавить вопрос"
                    onclick={() => {
                        addQuestion()
                    }}
                    type="button" />
                </section>

                <Button 
                className="createform__submit__button"
                isPretty 
                type='submit' 
                text="Отослать" />

                <Button isPretty
                type='button'
                text="Очистить"
                onclick={() => setForm({
                    title: '',
                    description: '',
                    questions: [
                        {
                            text: '',
                            question_type: "single_choice",
                            answer_options: [
                                {
                                    text: '',
                                    is_correct: false
                                }
                            ]
                        }
                    ]
                })} /> 
            </form>
        </main>
    )
}

const QuestionElement = memo((props: {
    question: Question
    id: number
    answerTextSetter: Function
    questionTextSetter: Function
    answerCorrectSetter: Function
    addAnswer: Function
}) => {


    return(
        <article className="question__container" >
            <label className="question__text__label" htmlFor="">Текст вопроса:</label>
            <textarea maxLength={110}
            className="question__text__input textarea pretty_input"  
            name={`answer${props.id}text`}
            placeholder=""
            onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                props.questionTextSetter(event.currentTarget.value, props.id)

            }}
            value={props.question.text} />
            <label style={{height: '0px', width: '0px'}} hidden />
            <label className="question__answers__label">Варианты ответов:</label>
            <fieldset className="question__answers__container">
                {props.question.answer_options.map( (answer, index) => 
                    <AnswerElement 
                    key={(props.id + index * index)}
                    answerTextSetter={props.answerTextSetter} 
                    AnswerCorrectSetter={props.answerCorrectSetter} 
                    answer={answer} 
                    queid={props.id} 
                    id={index} 
                    addAnswer={props.addAnswer}/> 
                )}
                <Button isPretty
                className=" question__addanswer__button"
                type='button' 
                onclick={() => 
                    props.addAnswer(props.id)
                } 
                text="+ Добавить вариант ответа"/>

            </fieldset>

        </article>
        
    )
})

const AnswerElement = memo((props: {
    answer: Answer, 
    id: number, 
    answerTextSetter: Function,
    queid: number, 
    AnswerCorrectSetter: Function
    addAnswer: Function
}) => {


    return(
        <article className="answer__container">
            <div>
                <label className="answer__text__label">{`Вариант ответа №${props.id + 1}:`}</label>
                
                <textarea maxLength={115} minLength={3}
                className="answer__text__input textarea"
                value={props.answer.text}
                name={`answer${props.queid}.${props.id}`}
                onChange={(event: ChangeEvent<HTMLTextAreaElement>) => {
                    props.answerTextSetter(event.currentTarget.value, props.queid, props.id )
                    autoResizeTextarea(event.currentTarget)
                }}
                />
            </div>

            <input 
            className="answer__text__radio"
            type='radio' 
            name={`${props.queid}answers`} 
            value={`${props.id}`} 
            checked={props.answer.is_correct}
            onClick={ (event) => {
                props.AnswerCorrectSetter(false, props.queid, props.id )
            } }
            onChange={ (event: ChangeEvent<HTMLInputElement>) => {
                props.AnswerCorrectSetter(event.currentTarget.checked, props.queid, props.id )
            } }/>
        </article>
    )
})
