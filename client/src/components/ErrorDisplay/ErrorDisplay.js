import './ErrorDisplay.css'
import React, { useEffect, useState, useContext } from 'react'
import AppContext from '../../state/AppContext'

const ErrorDisplay = () => {
  const globalState = useContext(AppContext)
  const [message, setMessage] = useState('')
  const [isVisibile, setIsVisible] = useState(false)

  useEffect(() => {
    globalState.user.emitter.addListener('LOGIN_ERROR', () => {
      setMessage('LOGIN_ERROR')
    })
    globalState.user.emitter.addListener('LOGOUT_ERROR', () => {
      setMessage('LOGOUT_ERROR')
    })

    globalState.user.emitter.addListener('REGISTER_ERROR', () => {
        setMessage('REGISTER_ERROR')
    })

    globalState.project.emitter.addListener('GET_PROJECTS_ERROR', () => {
      setMessage('GET_PROJECTS_ERROR')
    })
    globalState.project.emitter.addListener('ADD_PROJECT_ERROR', () => {
      setMessage('ADD_PROJECT_ERROR')
    })
    globalState.project.emitter.addListener('SAVE_PROJECT_ERROR', () => {
      setMessage('SAVE_PROJECT_ERROR')
    })
    globalState.project.emitter.addListener('DELETE_PROJECT_ERROR', () => {
      setMessage('DELETE_PROJECT_ERROR')
    })
  }, [])

  useEffect(() => {
    if (message) {
      setIsVisible(true)
      setTimeout(() => {
        setIsVisible(false)
        setMessage('')
      }, 5000)
    }
  }, [message])

  return (
    <div className={'error-display' + (message ? ' visible' : '')}>
      <div>Error: {message}</div>
    </div>
  )
}

export default ErrorDisplay
