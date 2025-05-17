import  { RefObject } from "react";

export const WaitModal = (props: {ref: RefObject<HTMLDialogElement | null>}) => {
    return(
        <dialog ref={props.ref} className="WaitModal" >
            <div className="WaitModal__container">
                <div id="circle1"></div>
                <div id="circle2"></div>
                <div id="circle3"></div>
                <div id="square"></div>
            </div> 
        </dialog>
    )
}