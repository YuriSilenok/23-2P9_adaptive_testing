import { createContext, use, useContext, useEffect, useRef, useState } from "react";
import {  useNavigate, useParams } from "react-router-dom";


export default function FormElement () {
    const nav = useNavigate()
    const mainform = useRef(null)
    const data = useRef({
        'title': 'name',
        'discription': 'discription',
        'qustions': {            
            'question1':{'label': 'quename',
                'datatype' : 'checkbox',
                'answers': {
                    'ans1': {
                        'label': 'answer1',
                        'istrue' : 1
                    },
                    'ans2' : {
                        'label' : 'answer2',
                        'istrue' : 0
                    },
                    'ans3' : {
                        'label': 'answer3',
                        'istrue' : 0
                    }
                }
            },
            'question2':{'label': 'quename',
                'datatype' : 'checkbox',
                'answers': {
                    'ans1': {
                        'label': 'answer1',
                        'istrue' : 1
                    },
                    'ans2' : {
                        'label' : 'answer2',
                        'istrue' : 0
                    },
                    'ans3' : {
                        'label': 'answer3',
                        'istrue' : 0
                    }
                }
            }
        }
    })
    const handleClick = () => {
        nav('/forstudent')
    }
    
    const saving = () => {
        document.dispatchEvent(new CustomEvent('saving'))
    }
// =============================================================
    return(       
        <>
            <div className="form-container">
                <form ref={mainform} id="form" name="mainform">
                    {Object.values(data.current.qustions).map(el => {return <Question key={el} data={el} />})}
                </form>
            </div>
        </>
    )
}

const Question = ({ data }) => {

    const counter = useRef(0)
    const setCounter = () => {
        counter.current++
    }
    
    return(
        <>
            <label name='das' >{data.label}</label>
            <label>Варианты ответов</label>
            <div>
                {Object.values(data.answers).map(el => {setCounter()
                    return <Answer key={el} data={el} counter={counter.current}  /> 
                })}
            </div>
        </>   
    )
}

const Answer = ({ data, counter }) => {
    document.addEventListener('saving', () => {
        
    const provided = useContext(output)
    console.log(provided)
    })

    const answer = useRef(null)

    const [istrue, setTrue] = useState(0)

    const handleClick = () => {
        istrue ? answer.current.classList.remove('answer-false') : answer.current.classList.add('answer-false')
        setTrue(!istrue)
    }

    return(
        <>
            <div ref={answer} className="answer" onClick={() => {handleClick()}}>
                <label>{data.label}</label>
            </div>
            
        </>
    )
}