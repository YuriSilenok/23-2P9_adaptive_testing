import React, { ChangeEventHandler } from "react"

export const Input = (props: {name: string, onChange?: Function, max?: number, min?: number, defaultValue?: string, invalidMessage?:string, isPretty?: boolean}) => {
    return(<>
            <input 
            type="text" 
            maxLength={props.max ?? 50} 
            minLength={props.min ?? 3} 
            name={props.name}
            defaultValue={props.defaultValue} 
            className={props.isPretty ? 'pretty_input' : 'main_input'}
            onInvalid={e => {
                e.preventDefault()
                e.currentTarget.classList.remove('invalid')
                e.currentTarget.offsetWidth
                e.currentTarget.classList.add('invalid')
            }}
            placeholder={props.name} 
            onChange={e => {
                if (props.name === 'password') {
                    (document.querySelector('[name=repeat]') ?? undefined)?.classList.remove('invalid')
                }
                e.currentTarget.classList.remove('invalid')
                props.onChange 
                    ? props.onChange(e) 
                    : undefined
            }} />

            <label className="valid_message">{props.invalidMessage ?? 'invalid field'}</label>

            {/* {props.name === 'username' ? <label>username already Registered</label> : null} */}
        </>
    )
}