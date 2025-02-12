import './LoginForm.css'
import React, { useState, useContext, useEffect } from 'react'
import AppContext from '../../state/AppContext'
import { useLocation, useNavigate } from 'react-router-dom'

const LoginForm = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { user } = useContext(AppContext)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [type, setType] = useState('regular')
  const location = useLocation()
  const navigate = useNavigate()

  const handleLoginClick = () => {
    user.login(email, password)
  }

  useEffect(() => {
    user.emitter.addListener('LOGIN_SUCCESS', () => {
      setIsAuthenticated(true)
      navigate(location.state.from)
    })
  }, [])

  const handleRegisterClick = () => {
    user.register(email, password, type)
  }

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
        <button onClick={handleRegisterClick}>Register</button>
        <div>
          <label>
            <input
              type='radio'
              value='regular'
              defaultChecked={true}
              onChange={() => setType('regular')}
            />
            Regular
          </label>
          <label>
            <input
              type='radio'
              value='admin'
              onChange={() => setType('admin')}
            />
            Admin
          </label>
        </div>
      </div>
    </div>
  )
}

export default LoginForm
