import { Button } from "./Button"
import { useNavigate } from "react-router-dom"

export const SuccessfulModal = ({ref, labels, redirectURI}) => {
    return(
        <>
            <dialog ref={ref}  >
                <label>{labels[0]}</label>
                <Button text={labels[1]} isPretty type='submit' onclick={() => {useNavigate()(redirectURI)} } />
            </dialog>
        </>
    )
}