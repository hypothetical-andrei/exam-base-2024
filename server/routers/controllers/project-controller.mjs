import models from '../../models/index.mjs'
import { Op } from 'sequelize'

const getAllProjects = async (req, res, next) => {
  try {
    const query = {}
    const filterQuery = {}
    if (req.query.filterField && req.query.filterValue) {
      query.where = {
        [req.query.filterField]: {
          [Op.like]: `%${req.query.filterValue}%`
        }
      }
      filterQuery.where = {
        [req.query.filterField]: {
          [Op.like]: `%${req.query.filterValue}%`
        }
      }
    }
    if (req.query.pageSize && req.query.pageNumber) {
      query.limit = req.query.pageSize
      query.offset = parseInt(req.query.pageSize) * parseInt(req.query.pageNumber)
    }
    if (req.query.sortField && req.query.sortOrder) {
      query.order = [[req.query.sortField, req.query.sortOrder]]
    }
    const count = await models.Project.count({
      ...filterQuery,
      include: {
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: 'project'
        },
        required: false
      }
    })
    const data = await models.Project.findAll({
      ...query,
      include: {
        model: models.Permission,
        where: {
          forUser: req.params.uid,
          type: 'project'
        },
        required: false
      }
    })
    res.status(200).json({ data, count })
  } catch (err) {
    next(err)
  }
}

const getOneOwnedProject = async (req, res, next) => {
  try {
    const project = await models.Project.findByPk(req.params.pid)
    if (project) {
      res.status(200).json(project)
    } else {
      res.status(404).json({ message: 'Project not found' })
    }
  } catch (err) {
    next(err)
  }
}

const createOwnedProject = async (req, res, next) => {
  try {
    const project = await models.Project.create({ ...req.body, userId: req.params.uid })
    // create permission for project
    await models.Permission.create({
      forResource: project.id,
      forUser: req.params.uid,
      type: 'project',
      rights: ['read', 'write']
    })
    res.status(201).json(project)
  } catch (err) {
    next(err)
  }
}

const updateOwnedProject = async (req, res, next) => {
  try {
    const project = await models.Project.findByPk(req.params.pid)
    if (project) {
      await project.update(req.body)
      res.status(200).json(project)
    } else {
      res.status(404).json({ message: 'Project not found' })
    }
  } catch (err) {
    next(err)
  }
}

const deleteOwnedProject = async (req, res, next) => {
  try {
    const project = await models.Project.findByPk(req.params.pid)
    const permission = await models.Permission.findOne({
			where: {
				forResource: req.params.pid,
				forUser: req.params.uid,
				type: 'project'
			}
		})
    const tasks = await models.Task.findAll({
      where: {
        projectId: req.params.pid
      }
    })

    if (tasks) {

        // find all the permissions for the tasks
        const taskPermissions = await models.Permission.findAll({
            where: {
                forResource: {
                    [Op.in]: tasks.map(task => task.id)
                },
                type: 'task'
            }
        })
        // delete all the permissions for the tasks
        for (let i = 0; i < taskPermissions.length; i++) {
            const taskPermission = taskPermissions[i]
            await taskPermission.destroy()
        }
        // delete all the tasks
        for (let i = 0; i < tasks.length; i++) {
            const task = tasks[i]
            await task.destroy()
        }
    }
    if (project && permission) {
      await permission.destroy()
      await project.destroy()
      res.status(204).end()
    } else {
      res.status(404).json({ message: 'Project not found' })
    }
  } catch (err) {
    next(err)
  }
}

export default {
  getAllProjects,
  getOneOwnedProject,
  createOwnedProject,
  updateOwnedProject,
  deleteOwnedProject
}
