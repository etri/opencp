import express from 'express'
import { userController } from '../controllers/userController.js'
import { userValidation } from '../middleware/validates/user.js'
const route = express.Router()

route
  .get('/overlap', userValidation.overlap, userController.checkOverlap)
route
  .post('/signIn', userValidation.signIn, userController.signIn)
  .post('/signOut', userController.signOut)

route
  .post('/signUp', userValidation.userInfo, userController.createUser)
  .post('/users', userValidation.userInfo, userController.updateUserInfo)
  .post('/users/disable', userValidation.id, userController.disableUser)

route
  .post('/favorites', userValidation.favorite, userController.setFavorite)

route
  .post('/scribes', userValidation.hashtag, userController.setScribeHashtag)
  .post('/hashtags/delete', userValidation.hashtag, userController.delHashtag)
route
  .post('/join', userValidation.applyInfo, userController.joinCommunity)
  .post('/resign', userValidation.member, userController.resign)
export { route }
