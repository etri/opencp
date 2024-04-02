import logger from '../../../utils/logger.js'
import Joi from 'joi'
const queryPart = {
  boardList: async (req, res, next) => {
    logger.debug('queryPart board')
    const query = req.query
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      start: Joi.number().max(100),
      length: Joi.number().max(100),
      category: Joi.array().items(Joi.number().min(1).max(32))
    })
    try {
      await schema.validateAsync(query)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  privateDetail: async (req, res, next) => {
    logger.debug('queryPart privateDetail')
    const query = req.query
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      privateId: Joi.number().required()
    })
    try {
      await schema.validateAsync(query)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  messageDetail: async (req, res, next) => {
    logger.debug('queryPart messageDetail')
    const query = req.query
    const schema = Joi.object().keys({
      communityId: Joi.number().required(),
      messageId: Joi.number().required()
    })
    try {
      await schema.validateAsync(query)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  communityId: async (req, res, next) => {
    logger.debug('queryPart communityId')
    console.log(req.url)
    const query = req.query
    const schema = Joi.object().keys({
      communityId: Joi.number().required()
    })
    try {
      await schema.validateAsync(query)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  },
  communityType: async (req, res, next) => {
    logger.debug('bodyPart communities')
    const query = req.query
    console.log(query)
    const schema = Joi.object().keys({
      communityType: Joi.number().allow('')
    })
    try {
      await schema.validateAsync(query)
      next()
    } catch (err) {
      logger.error(err.message)
      res.status(400).json({ success: false, msg: err.message })
    }
  }
}
export { queryPart }
