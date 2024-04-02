import express from 'express'
import validation from '../middleware/validates/community/index.js'
import { communityController } from '../controllers/communityController.js'
import { communityFiles } from '../middleware/files/files.js'

const route = express.Router()
const bodyValidation = validation.bodyPart
const queryValidation = validation.queryPart
route
  .get('/applies', queryValidation.communityId, communityController.listApplies)
  .post('/approval', bodyValidation.approval, communityController.approval)

route
  .get('/communities/info', queryValidation.communityId, communityController.getInfo)
  .get('/recommend/list', queryValidation.communityType, communityController.listCommunities)
  .post('/communities', bodyValidation.communityInfo, communityController.createCommnunity)

route
  .get('/members', queryValidation.communityId, communityController.listMembers)

route
  .get('/communities/message', queryValidation.boardList, communityController.listMessage)
  .get('/communities/message/details', queryValidation.messageDetail, communityController.messageDetails)
  .post('/communities/message/new', bodyValidation.newMessage, communityController.createNewMessage)
  .post('/communities/message', bodyValidation.modifyMessage, communityController.modifyMessage)
  .post('/communities/message/images', communityFiles.uploadImages, communityController.uploadImages)
  .post('/communities/message/files', communityFiles.uploadFiles, communityController.uploadPrivateFiles)

route
  .get('/privates', queryValidation.boardList, communityController.listPrivates)
  .get('/privates/wiki', queryValidation.communityId, communityController.getPrivateWiki)
  .get('/privates/details', queryValidation.privateDetail, communityController.privateDetails)
  .post('/privates', bodyValidation.privatePosts, communityController.modifyPrivate)
  .post('/privates/new', bodyValidation.postNew, communityController.postNewPrivate)
  .post('/privates/images', communityFiles.uploadImages, communityController.uploadImages)
  .post('/privates/files', communityFiles.uploadFiles, communityController.uploadPrivateFiles)

route
  .get('/categories', queryValidation.communityId, communityController.listCategories)
  .post('/categories', bodyValidation.category, communityController.registCategory)
  .post('/levels', bodyValidation.level, communityController.changeLevel)
  .get('/children', queryValidation.communityId, communityController.listChildren)

export { route }
