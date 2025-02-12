import './ProjectList.css'
import React, { useContext, useEffect, useState } from 'react'
import AppContext from '../../state/AppContext'
import { useNavigate } from 'react-router-dom'

import Project from './Project'
import Paginator from '../Paginator/Paginator'

const ProjectList = () => {
  const globalState = useContext(AppContext)
  const navigate = useNavigate()
  const [projects, setProjects] = useState([])
  const [pageNumber, setPageNumber] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [filterField, setFilterField] = useState('')
  const [filterValue, setFilterValue] = useState('')
  const [sortField, setSortField] = useState('')
  const [sortOrder, setSortOrder] = useState('')

  useEffect(() => {
    globalState.project.getAll(globalState, pageNumber, pageSize, filterField, filterValue, sortField, sortOrder)
    globalState.project.emitter.addListener('GET_PROJECTS_SUCCESS', () => {
      setProjects(globalState.project.data)
    })
  }, [pageNumber, pageSize, filterField, filterValue, sortField, sortOrder])

  return (
    <div className='project-list'>
      <h1>Project List</h1>
      <table>
        <thead>
          <tr>
            <th>
              <div>
                Name
              </div>
              <input
                type='text' onChange={e => {
                  setFilterValue(e.target.value)
                  setFilterField('name')
                }} placeholder='name filter'
              />
              <button onClick={() => {
                setSortField('name')
                setSortOrder('asc')
              }}
              >⌃
              </button>
              <button onClick={() => {
                setSortField('name')
                setSortOrder('desc')
              }}
              >⌄
              </button>
            </th>
            <th>
              <div>
                Description
              </div>
              <input
                type='text' onChange={e => {
                  setFilterValue(e.target.value)
                  setFilterField('description')
                }} placeholder='description filter'
              />
              <button onClick={() => {
                setSortField('description')
                setSortOrder('asc')
              }}
              >⌃
              </button>
              <button onClick={() => {
                setSortField('description')
                setSortOrder('desc')
              }}
              >⌄
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            projects.map(project => <Project key={project.id} project={project} />)
          }
        </tbody>
      </table>
      <Paginator
        onPageChange={(pageNumber) => setPageNumber(pageNumber)}
        onPageSizeChange={(pageSize) => setPageSize(pageSize)}
        totalRecords={globalState.project.count}
        page={pageNumber}
        setPage={setPageNumber}
      />
      <div className='footer'>
        <button onClick={() => navigate('/projects/new')}>
          Create Project
        </button>
      </div>
    </div>
  )
}

export default ProjectList
