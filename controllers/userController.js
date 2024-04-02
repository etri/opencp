import createError from 'http-errors'
import logger from '../utils/logger.js'
import reqIp from 'request-ip'
import repository from '../data-access/index.js'
import newUserService from '../services/user/index.js'

const userService = newUserService(repository)

const userController = {
  checkOverlap: async (req, res, next) => {
    const userInfo = req.query
    logger.debug('GET /checkOverlap - Check overlap ')
    try {
      const svcResut = await userService.checkOverlap(userInfo)

      res.status(200).send({
        success: svcResut.success,
        data: svcResut.data
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  createUser: async (req, res, next) => {
    const userInfo = req.body
    logger.debug(`POST /createUser - Create userId ${userInfo.id}`)
    try {
      const svcResut = await userService.createUser(userInfo)
      res.status(200).send({
        success: svcResut.success,
        data: svcResut.data
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  signIn: async (req, res, next) => {
    const userInfo = req.body
    const userIp = reqIp.getClientIp(req)
    logger.info(`${userInfo.id} is logged in at the ${userIp}`)
    logger.debug(`POST /signIn - userId ${userInfo.id}`)
    try {
      const svcResult = await userService.checkQualification(userInfo, userIp)

      req.session.userId = svcResult.id
      req.session.nick = svcResult.nick
      req.session.clientIP = userIp
      req.session.save(() => {
        res.status(200).send({
          success: true,
          data: svcResult
        })
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  signOut: async (req, res, next) => {
    logger.debug('GET /signOut ')
    try {
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  updateUserInfo: async (req, res, next) => {
    const userInfo = req.body
    logger.debug(`PUT /userInfo - userId ${userInfo.id}`)
    try {
      await userService.updateUserInfo(userInfo)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  disableUser: async (req, res, next) => {
    const userId = req.body.userId
    logger.debug(`DELETE /user - userId ${userId}`)
    try {
      await userService.disableUser(userId)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  setFavorite: async (req, res, next) => {
    const registInfo = req.body
    logger.debug('PUT /setFavorite ')
    try {
      await userService.setFavorite(registInfo)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  setScribeHashtag: async (req, res, next) => {
    const hashtagInfo = req.body
    logger.debug('POST /setScribeHashtag')
    try {
      await userService.setScribeHashtag(hashtagInfo)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  joinCommunity: async (req, res, next) => {
    const body = req.body
    logger.debug(`POST /joinCommunity - Join community ${body.userId}`)
    try {
      await userService.joinCommunity(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  delHashtag: async (req, res, next) => {
    const body = req.body
    logger.debug(`DELETE /deleteScribeHashtag -  Del ${body.hashtag}`)
    try {
      await userService.deleteScribeHashtag(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  resign: async (req, res, next) => {
    const body = req.body
    logger.debug(`DELETE /resign -  Del ${body.communityId}`)
    try {
      await userService.resignCommunity(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  }
}
export { userController }
