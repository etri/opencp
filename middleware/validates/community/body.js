import logger from '../../../utils/logger.js'
import Joi from 'joi'
const bodyPart = {
  communityInfo: async (req, res, next) => {
    logger.debug('bodyPart communityInfo')
    const body = req.body
    const schema = Joi.object().keys({
      type: Joi.number().required(),
      name: Joi.string().max(250).required(),
      wiki: Joi.string().required(),
      parentId: Joi.number(),
      parentType: Joi.number()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  approval: async (req, res, next) => {
    logger.debug('bodyPart approval')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      memberId: Joi.string().min(5).max(30).alphanum().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  level: async (req, res, next) => {
    logger.debug('bodyPart level')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      memberId: Joi.string().min(5).max(30).alphanum().required(),
      memberLevel: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  communityId: async (req, res, next) => {
    logger.debug('bodyPart communityId')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  newMessage: async (req, res, next) => {
    logger.debug('bodyPart newMessage')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  modifyMessage: async (req, res, next) => {
    logger.debug('bodyPart modifyMessage')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      messageId: Joi.number().required(),
      title: Joi.string().max(250).required(),
      content: Joi.string().required(),
      level: Joi.number().required(),
      topFix: Joi.boolean().required(),
      commentDisable: Joi.boolean().required(),
      commentInvisible: Joi.boolean().required(),
      status: Joi.number().required(),
      category: Joi.array().items(Joi.number().min(1).max(32)).required(),
      hashtag: Joi.array().items(Joi.string().min(1).max(32)).max(10)
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  privatePosts: async (req, res, next) => {
    logger.debug('communityValidation private')
    const body = req.body
    console.log(body)
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      privateId: Joi.number().required(),
      title: Joi.string().max(250).required(),
      content: Joi.string().required(),
      level: Joi.number().required(),
      topFix: Joi.boolean().required(),
      commentDisable: Joi.boolean().required(),
      commentInvisible: Joi.boolean().required(),
      status: Joi.number().required(),
      category: Joi.array().items(Joi.number().min(1).max(32)).max(6),
      hashtag: Joi.array().items(Joi.string().min(1).max(32)).max(10)
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  category: async (req, res, next) => {
    logger.debug('communityValidation category')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      category: Joi.string().max(50).required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  postNew: async (req, res, next) => {
    logger.debug('communityValidation private')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required()
    })
    try {
      await schema.validateAsync(body)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },

  uploadImages: async (req, res, next) => {
    logger.debug('communityValidation uploadImages')
    const body = req.body
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      privateId: Joi.number().required()
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
export { bodyPart }
