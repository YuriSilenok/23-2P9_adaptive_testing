export default function Regisration () {
    return(
        <div className="registration-container">
            <h2>Регистрация</h2>
            <form id="registration-form">
                <input type="text" placeholder="login" className="input" autoComplete="off" datatype="off" name="login" />
                <input 
                type="text" 
                placeholder="password" 
                className="input" 
                datatype="password" 
                name="password" />
                <input 
                type="text"
                placeholder="repeat password"
                className="input"
                name="password-rp" />
                <button type='button' onClick={e => {}} id="button">Авторизоваться</button>
            </form>
        </div>
    )
}