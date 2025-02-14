import './LoginForm.css'
import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../state/AppContext'
import { useLocation, useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const location = useLocation()
  const navigate = useNavigate()

  const handleLoginClick = () => {
    user.login(email, password)
  }

  useEffect(() => {
    user.emitter.addListener('LOGIN_SUCCESS', () => {
      setIsAuthenticated(true)
      if(location.state && location.state.from){
        navigate(location.state.from)
      }else{
        navigate('/')
      }
    })
  }, [])

  return (
    <div className='login-form'>
      <div className='form-container'>
        <h1>Login</h1>
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
        <button onClick={handleLoginClick}>Login</button>
      </div>
    </div>
  )
}

export default LoginForm
