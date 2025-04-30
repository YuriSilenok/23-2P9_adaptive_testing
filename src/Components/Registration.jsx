export default function Regisration () {
    return(
        <div className="registration-container">
            <h2>Регистрация</h2>
            <form id="registration-form">
                <input type="text" placeholder="login" className="input" autoComplete="off" datatype="off" name="login" />
                <input 
                type="password" 
                placeholder="password" 
                className="input" 
                name="password" />
                <input 
                type="password"
                placeholder="repeat password"
                className="input"
                name="password-rp" />
                <button type='button' onClick={e => {}} className="main_button">Зарегистрироваться</button>
            </form>
        </div>
    )
}