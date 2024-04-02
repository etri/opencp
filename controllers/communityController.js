import createError from 'http-errors'
import repository from '../data-access/index.js'
import newCommunityService from '../services/community/index.js'

const communityService = newCommunityService(repository)
function getUrlPath (communityId, boardId) {
  return `/community/${communityId}/privates/${boardId}`
}
const communityController = {
  createCommnunity: async (req, res, next) => {
    const body = req.body
    try {
      await communityService.createCommunity(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listApplies: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.listApplies(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  approval: async (req, res, next) => {
    const body = req.body
    try {
      await communityService.approval(req.url, body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  changeLevel: async (req, res, next) => {
    const body = req.body
    const method = req.method
    const url = req.originalUrl
    try {
      await communityService.changeLevel(method, url, body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listCommunities: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.listCommunities(body.communityType)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listChildren: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getChildren(body.communityId)
      console.log(svcResult)
      res.status(200).send({
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  createNewMessage: async (req, res, next) => {
    const body = req.body
    try {
      const svcResult = await communityService.createNewMessage(req.session.userId, body.communityId)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  modifyMessage: async (req, res, next) => {
    const body = req.body
    try {
      await communityService.modifyMessage(req.session.userId, body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listMessage: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getMessageList(req.session.userId, body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  modifyPrivate: async (req, res, next) => {
    const body = req.body
    try {
      await communityService.modifyPrivate(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  uploadImages: (req, res, next) => {
    console.log(req.fields)
    console.log(req.files.imagefile)
    const fields = req.fields
    const file = req.files.imagefile

    res.status(200).send({
      success: true,
      data: {
        path: getUrlPath(fields.communityId, fields.privateId) + '/' + file.newFilename,
        filename: file.newFilename
      }
    })
  },
  uploadPrivateFiles: async (req, res, next) => {
    try {
      const fields = req.fields
      const file = req.files.file

      const uploadFileInfo = {
        ...fields,
        urlPath: getUrlPath(fields.communityId, fields.privateId) + '/' + file.newFilename,
        filename: file.newFilename,
        originalname: file.originalFilename
      }
      await communityService.uploadPrivateFiles(uploadFileInfo)
      res.status(200).send({
        success: true,
        data: {
          path: getUrlPath(fields.communityId, fields.privateId) + '/' + file.newFilename,
          filename: file.newFilename
        }
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  registCategory: async (req, res, next) => {
    const body = req.body
    try {
      await communityService.registCategory(body)
      res.status(200).send({
        success: true
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listPrivates: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.listPrivates(req.session.userId, body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  postNewPrivate: async (req, res, next) => {
    const body = req.body
    try {
      const svcResult = await communityService.postNewPrivate(req.session.userId, body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  privateDetails: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getPrivateDetails(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  messageDetails: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getMessageDetails(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  listMembers: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getMembersInfo(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  getPrivateWiki: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getPrivateWiki(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  },
  getInfo: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.getCommunityInfo(body, req.session.userId)
      console.log(svcResult)
      req.session.level = svcResult.level
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
  listCategories: async (req, res, next) => {
    const body = req.query
    try {
      const svcResult = await communityService.listCategories(body)
      res.status(200).send({
        success: true,
        data: svcResult
      })
    } catch (err) {
      next(createError(500, err.message))
    }
  }
}
export { communityController }
