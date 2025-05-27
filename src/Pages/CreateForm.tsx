import { useRedirect } from "../Static/utils"
import { ChangeEvent, createContext, Dispatch, FormEvent, memo, RefObject, SetStateAction, useCallback, useEffect, useRef, useState } from "react";
import { showFormStore } from "../Static/store";
import { Answer, Form, FormCreate, Question} from "../Static/interfaces";
import { useParams } from "react-router-dom";
import { Input } from '../Components/Input'
import { create } from "zustand";
import { Button } from "../Components/Button";
import { useImmer } from "use-immer";
const save = (data: any) => {
    sessionStorage.setItem('createformdata', JSON.stringify(data))
    
}

export default function Createform () {
    useRedirect()
    const [form, setForm] = useImmer(JSON.parse(sessionStorage.getItem('createformdata') ?? JSON.stringify({
            title: '',
            description: '',
            questions: [
                {
                    text: '',
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
    }), [])  
    
    const setAnswerText = useCallback((text: string, questionID: number, answerID: number) =>
        setForm( draft => {
            draft.questions[questionID].answer_options ||= []
            draft.questions[questionID].answer_options[answerID].text = text
    }), [])
    
    const addQuestion = useCallback(() => setForm( draft =>
        {draft.questions.push({
                    text: '',
                    answer_options: [
                        {
                            text: '',
                            is_correct: false
                        }
                    ]
            })}
    ), [])

    const addAnswer = useCallback((questionID: number) => 
        setForm(draft =>{
            draft.questions ||= []
            draft.questions[questionID].answer_options.push({
                            text: '',
                            is_correct: false
                        })
    }),[])

    const setAnswerCorrect = useCallback((state: boolean, questionID: number, answerID: number) =>
        setForm( draft => {
            draft.questions[questionID].answer_options ||= []
            draft.questions[questionID].answer_options[answerID].is_correct = state
    }), [])


    return(
        <main className="createform__container" >
            <form 
            onSubmit={(event) => {
                event.preventDefault()
            }}>
                <header >
                    <label>Заголовок формы:</label>

                    <Input 
                    value={form.title} 
                    onChange ={( event: ChangeEvent<HTMLInputElement> ) => 
                        setTitle(event.currentTarget.value) 
                    } 
                    placeholder="" 
                    name="title" />

                </header>
                <label >Описание формы:</label>
                <textarea name="description" /> 
                <section>
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
                </section>

                <Button 
                isPretty
                text="добавить вопрос"
                onclick={() => {
                    addQuestion()
                }}
                type="button" /> 


                <Button 
                isPretty 
                type='submit' 
                text="Отослать"
                onclick={(ev) => {console.log(form)}}></Button>
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
        <article >
            <label htmlFor="">'Текст вопроса:</label>
            <Input isPretty  
            name={`answer${props.id}text`}
            placeholder=""
            onChange={(event: ChangeEvent<HTMLInputElement>) => {
                props.questionTextSetter(event.currentTarget.value, props.id)

            }}
            value={props.question.text} />
            <label htmlFor="">Варианты ответов:</label>
            <section>
                {props.question.answer_options.map( (answer, index) => 
                    <AnswerElement 
                    key={(answer.id ??  Math.random() * index)}
                    answerTextSetter={props.answerTextSetter} 
                    AnswerCorrectSetter={props.answerCorrectSetter} 
                    answer={answer} 
                    queid={props.id} 
                    id={index} 
                    addAnswer={props.addAnswer}/> 
                )}
                <Button type='button' onclick={() => props.addAnswer(props.id)} text="Добавить вариант ответа"/>
            </section>

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
        <article>
            <label>{`Вариант ответа №${props.id + 1}:`}</label>
            <Input isPretty 
            value={props.answer.text}
            name={`answer${props.queid}.${props.id}`}
            onChange={(event: ChangeEvent<HTMLInputElement>) => props.answerTextSetter(event.currentTarget.value, props.queid, props.id )}/>
        </article>
    )
})
