import React, {useContext, useEffect, useState} from 'react'
import {useNavigate} from "react-router-dom";
import AppContext from "../../state/AppContext";

const RegisterForm = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    const {user} = useContext(AppContext)

    const [error, setError] = useState('')
    const navigate = useNavigate()


    useEffect(() => {
      const subscribe =  user.emitter.addListener('REGISTER_SUCCESS', () => {
            navigate('/login')
        })
        return () => {
          console.log('unmount and unsubsribe')
          subscribe.remove()
        }
    }, []);
    function handleRegister() {

        if (password !== confirmPassword) {
            setError('visible')
            setPassword('')
            setConfirmPassword('')
        } else {
            setError('')
            user.register(email, password)
        }
    }

    return (
        <div className='login-form'>
            <div className='form-container'>
                <h1>Register</h1>
                <input
                    type='text'
                    placeholder='email'
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                />

                <input
                    type='password'
                    placeholder='Confirm password'
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                />
                <button onClick={handleRegister}>Register</button>
                <div className={`error ${error}`}>
                    Passwords do not match
                </div>
            </div>
        </div>
    )
}
export default RegisterForm
