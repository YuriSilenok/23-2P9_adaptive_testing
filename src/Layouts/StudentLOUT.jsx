import { useContext, useRef } from "react"
import { useNavigate } from "react-router-dom"
import logo from '../assets/react.svg'  

export default function FormLayout () {
    const navigate = useNavigate()
    const input = useRef()


    const toFormById = () => {
        const id = input.current.value
        if (!id) {
            alert('input form id')
            return
        }
        navigate(`/showform/${id}`)
    }

    const handleChange = (e) => {
        e.target.value = e.target.value.replace(/[^\d]/g, '')
      };

    return(
        <>
            <div className="studentpage" id="formlout">
                <img src={logo} />
                <input onChange={handleChange} maxLength={8} placeholder="id теста" autoComplete="off" className="input" ref={input} type='text' />
                <button className="main_button" onClick={() => {toFormById()}} >Подключиться</button>
            </div>
            <div className="background-animate">
                <div id="figure-1" />
                <div id="figure-2" /> 
            </div>
        </>
    )
}