import bcrypt from 'bcrypt'
import models from '../../models/index.mjs'
import jwt from 'jsonwebtoken'

const login = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: {
        email: req.body.email
      }
    })
    if (user) {
      const isPasswordValid = await bcrypt.compare(req.body.password, user.passwordHash)
      if (isPasswordValid) {
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET)
        user.token = token
        await user.save()
        res.status(200).json({ token, email: user.email, id: user.id, type: user.type })
      } else {
        res.status(401).json({ message: 'Invalid email or password' })
      }
    } else {
      res.status(401).json({ message: 'Invalid email or password' })
    }
  } catch (err) {
    next(err)
  }
}

const logout = async (req, res, next) => {
  try {
    const user = await models.User.findOne({
      where: {
        token: req.body.token
      }
    })
    if (user) {
      user.token = null
      await user.save()
      res.status(200).json({ message: 'User logged out' })
    } else {
      res.status(401).json({ message: 'Invalid token' })
    }
  } catch (err) {
    next(err)
  }
}

const register = async (req, res, next) => {
  try {
    const user = await models.User.create({
      email: req.body.email,
      passwordHash: await bcrypt.hash(req.body.password, 10),
      type: 'regular'
    })
    res.status(201).json(user)
  } catch (err) {
    next(err)
  }
}

export default {
  login,
  logout,
  register
}
