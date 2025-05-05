import React, { ChangeEventHandler } from "react"

export const Input = ({name, onChange}) => {
    return(<>
            <input type="text" maxLength={50} minLength={3} name={name} className="input" placeholder={name} onChange={e => {e.currentTarget.classList.remove('invalid'), onChange(e) ?? undefined}} />
            <label className="valid_message">invalid field</label>
            {name === 'username' ? <label>username already Registered</label> : null}
        </>
    )
}