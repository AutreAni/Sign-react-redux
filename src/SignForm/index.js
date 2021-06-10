import React, { useState } from 'react';
import InputField from './InputField';
import { validateData } from './validate';
import { setCurrentUser } from '../actions/currentUser';
import { useDispatch } from 'react-redux';
import { faUser, faLock, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import "../css-modules/SignForm/style.css";
import { registerCurrentUser } from '../actions/currentUser';



const SignForm = () => {
    const [loggingin, setLoggingin] = useState(true);
    const [registering, setRegistering] = useState(false);
    const [validUsername, setValidUsername] = useState(true);
    const [validEmail, setValidEmail] = useState(true);
    const [validPassword, setValidPassword] = useState(true);
    const [validConfPass, setValidConfPass] = useState(true);
    const [wrongDataMsg, setWrongDataMsg] = useState();
    const [loading, setLoading] = useState(false);
    const BASE_URL = `https://jsonplaceholder.typicode.com/users`;
    const dispatch = useDispatch();

    const createLoginForm = () => {
        if (!registering && loggingin) return;
        if (registering) setRegistering(false);
        if (!loggingin) setLoggingin(true);
        setWrongDataMsg(null);
        setValidUsername(true);
        setValidEmail(true);
        setValidConfPass(true);
        setValidPassword(true);
    }

    const createSignupForm = () => {
        if (registering && !loggingin) return;
        if (!registering) setRegistering(true);
        if (loggingin) setLoggingin(false);
        setWrongDataMsg(null);
        setValidUsername(true);
        setValidEmail(true);
        setValidConfPass(true);
        setValidPassword(true);
    }

    const setValidData = {
        Username: setValidUsername,
        Password: setValidPassword,
        Email: setValidEmail,
        ConfPass: setValidConfPass,
    }

    const handleFocusout = (e) => {
        if (e.target.tagName !== "INPUT") return;
        const name = e.target.name;
        if (!name) return;
        const validate = validateData[name];
        if (registering) setValidData[name](validate(e.target.value));
    }

    const handleFocus = (e) => {
        if (e.target.tagName !== "INPUT") return;
        const name = e.target.name;
        if (!name) return;
        setValidData[name](true);
        setWrongDataMsg(null);
    }

    const registerNewUser = (data) => {
        dispatch(registerCurrentUser(data, BASE_URL))
    }

    const checkUserLoginCredentials = (obj) => {
        const url = `${BASE_URL}?username=${obj.username}&email=${obj.password}`;
        setLoading(true);
        fetch(url)
            .then(response => {
                if (response.status !== 200) {
                    setLoading(false)
                    throw new Error();
                }
                setLoading(false)
                setWrongDataMsg(null);
                return response.json()
            })
            .then(data => {
                if (!data.length) {
                    setLoading(false);
                    setWrongDataMsg("Wrong username or password");
                    return;
                }
                setLoading(false);
                dispatch(setCurrentUser(data[0]))
            })
            .catch(err =>{ 
                setLoading(false);
                setWrongDataMsg("Server is not connected")
            })
    }

    const checkUserRegisterCredentials = (obj) => {
       setLoading(true);
       fetch(`${BASE_URL}?email=${obj.email}`)
            .then(res => res.json())
            .then(data => {
                if (data.length) {
                    setLoading(false)
                    setWrongDataMsg("An account with this email already exists");
                    return
                } else {
                    setLoading(false)
                    setWrongDataMsg(null);
                    registerNewUser(obj);
                }
            })
            .catch(err =>{
                 setLoading(false);
                 setWrongDataMsg("Server is not connected");
         })

    }



    const formSubmit = (e) => {
        const form = e.target.closest("form");
        e.preventDefault();
        let data = {};
        data["username"] = form.Username.value;
        data["email"] = registering ? form.Email.value : null;
        data["password"] = form.Password.value;
        data["confPass"] = registering ? form.ConfPass.value : null;

        if (loggingin) { 
         if (!data.username.length || !data.password.length) {
                setWrongDataMsg("*All fields are required");
                return;
            }else{
                checkUserLoginCredentials(data);
            }
        }
        if (registering) {
            if (!data.username.length || !data.password.length
                || !data.email.length || !data.confPass.length) {
                setWrongDataMsg("*All fields are required");
                return;
            } else if (!validUsername
                || !validEmail
                || !validPassword
                || !validConfPass) {
                return;
            } else {
                checkUserRegisterCredentials(data);
            }
        }
    }



    return (
        <div className="sign__form">
            <div className="main__wrapper">
                <div className="inner__wrapper">
                    <div className="buttons__wrapper">
                        <div className={loggingin ? "active btn__wrapper" : "btn__wrapper"}>
                            <button className="button"
                                onClick={createLoginForm}>
                                Login
             </button>
                        </div>
                        <div className={registering ? "active btn__wrapper" : "btn__wrapper"}>
                            <button className="button"
                                onClick={createSignupForm}>
                                Sign Up
             </button>
                        </div>
                    </div>
                    <form id="form"
                        onSubmit={formSubmit}
                        onFocus={handleFocus}
                    >
                    <InputField
                            className="username__wrapper"
                            name="Username"
                            icon={faUser}
                            inputType="text"
                            placeholder="Username"
                            handleFocusout={handleFocusout}
                            errorMsg={!validUsername && registering ? "*Field can not be empty" : null}
                        />

                        {registering ?
                            (<InputField
                                className="email__wrapper"
                                name="Email"
                                icon={faEnvelope}
                                inputType="email"
                                placeholder="Email"
                                handleFocusout={handleFocusout}
                                errorMsg={!validEmail ? "*Please, insert a valid email" : null}
                            />) : null}

                        <InputField
                            className="password__wrapper"
                            name="Password"
                            icon={faLock}
                            inputType="password"
                            placeholder="Password"
                            handleFocusout={handleFocusout}
                            errorMsg={!validPassword && registering ? ("*Password must be at least 8 characters, must contain a lowercase letter, an uppercase letter and a digit"
                            ) : null}
                        />
                        {registering ?
                            (<InputField
                                className="confirm__password__wrapper"
                                name="ConfPass"
                                icon={faLock}
                                inputType="password"
                                placeholder="Confirm password"
                                handleFocusout={handleFocusout}
                                errorMsg={!validConfPass ? ("*Passwords should match") : null}
                            />) : null}

                        <div className = {`sign__btn ${wrongDataMsg 
                                                      || loading 
                                                      || (registering 
                                                        && (!validUsername
                                                         || !validPassword 
                                                         || !validEmail
                                                         || !validConfPass)) ? "disabled": ""}`}>
                            <button>{registering ? "Register" : "Log In"}</button>
                            {wrongDataMsg ? <p className="errorMsg">{wrongDataMsg}</p> : null}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignForm;


