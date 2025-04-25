export default function Regisration () {
    return(
        <div className="auth-container">
            <h2>Регистрация</h2>
            <form id="auth-form">
                <input type="text" placeholder="login" className="input" autoComplete="off" datatype="off" name="login" />
                <input type="text" placeholder="password" className="input" datatype="password" name="password" />
                <div id="checkbox-container"> 
                    <input id="remember" type='checkbox' />
                    <label htmlFor="#remember"> Запомнить меня</label>
                </div>
                <button type='button' onClick={e => {}} id="button">Авторизоваться</button>
            </form>
        </div>
    )
}