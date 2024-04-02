// import { logger } from '../../logger.js'
import logger from '../../utils/logger.js'
import Joi from 'joi'
const regTel = /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/
const regPassword = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/

const userValidation = {
  overlap: async (req, res, next) => {
    logger.debug('userValidation overlap')
    const body = req.query
    const schema = Joi.object().keys({
      id: Joi.string().min(5).max(30).alphanum(),
      tel: Joi.string().pattern(new RegExp(regTel)),
      email: Joi.string().email()
    }).or('id', 'tel', 'email')
    // .unknown()
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  userInfo: async (req, res, next) => {
    logger.debug('userValidation userInfo')
    const body = req.body
    console.log(body)
    const schema = Joi.object().keys({
      id: Joi.string().min(5).max(30).alphanum().required(),
      pw: Joi.string().min(8).max(16).pattern(new RegExp(regPassword)).required(),
      repeat_pw: Joi.valid(Joi.ref('pw')),
      name: Joi.string().min(1).max(20).required(),
      nick: Joi.string().min(1).max(20).required(),
      tel: Joi.string().pattern(new RegExp(regTel)).required(),
      email1: Joi.string().email().required(),
      email2: Joi.string().email(),
      agncy_id: Joi.number(),
      hashtag: Joi.array().items(Joi.string().min(1).max(32)).max(10)
    }).and('pw', 'repeat_pw')
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  signIn: async (req, res, next) => {
    logger.debug('userValidation signIn')
    const body = req.body
    console.log(body)
    const schema = Joi.object().keys({
      id: Joi.string().min(5).max(30).alphanum().required(),
      pw: Joi.string().min(8).max(16).pattern(new RegExp(regPassword)).required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  id: async (req, res, next) => {
    logger.debug('userValidation id')
    const body = req.body
    const schema = Joi.object().keys({
      userId: Joi.string().min(5).max(30).alphanum().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  favorite: async (req, res, next) => {
    logger.debug('userValidation favorite')
    const body = req.body
    const schema = Joi.object().keys({
      userId: Joi.string().min(5).max(30).alphanum().required(),
      communityId: Joi.number().required(),
      isRegist: Joi.boolean().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  hashtag: async (req, res, next) => {
    logger.debug('userValidation hashtag')
    const body = req.body
    const schema = Joi.object().keys({
      userId: Joi.string().min(5).max(30).alphanum().required(),
      communityId: Joi.number().required(),
      hashtag: Joi.string().max(50).required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  applyInfo: async (req, res, next) => {
    logger.debug('userValidation applyInfo')
    const body = req.body
    const schema = Joi.object().keys({
      userId: Joi.string().min(5).max(30).alphanum().required(),
      communityId: Joi.number().required(),
      communityType: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  member: async (req, res, next) => {
    logger.debug('userValidation member')
    const body = req.body
    const schema = Joi.object().keys({
      userId: Joi.string().min(5).max(30).alphanum().required(),
      communityId: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  }
}
export { userValidation }
