import { ROOT_FOLDER } from '../../config.js'
import fileManage from '../../services/files/index.js'
import formidable from 'formidable'
import fs from 'fs'
import Joi from 'joi'
function getSavePath (communityId, boardId) {
  return ROOT_FOLDER + '/community/' + communityId + '/privates/' + boardId
}
const schema = Joi.object().keys({
  communityId: Joi.number().required(),
  privateId: Joi.number().required()
})
const communityFiles = {
  uploadImages: async (req, res, next) => {
    const promise = new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.parse(req, async (err, fields, files) => {
        if (err) reject(err)
        try {
          await schema.validateAsync(fields)
        } catch (err) {
          reject(err)
        }
        const { communityId, privateId } = fields
        const savePath = getSavePath(communityId, privateId)
        const file = files.imagefile // file: form field name
        // await fileManage.isNotExistsMkDirAsync(savePath)
        fileManage.mkdir(savePath)
        fs.rename(file.filepath, savePath + '/' + file.newFilename, err => {
          if (!err) {
            // success
            resolve({ fields, files })
          } else {
            reject(err)
          }
        })
      })
    })
    return promise.then(({ fields, files }) => {
      req.fields = fields
      req.files = files
      next()
    }).catch((err) => {
      res.status(400).json({ success: false, msg: err.message })
    })
  },
  uploadFiles: async (req, res, next) => {
    const promise = new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.parse(req, async (err, fields, files) => {
        if (err) reject(err)
        try {
          await schema.validateAsync(fields)
        } catch (err) {
          reject(err)
        }
        const { communityId, privateId } = fields
        const savePath = getSavePath(communityId, privateId)
        const file = files.file // file: form field name
        // await fileManage.isNotExistsMkDirAsync(savePath)
        fileManage.mkdir(savePath)
        fs.rename(file.filepath, savePath + '/' + file.originalFilename, err => {
          if (!err) {
            // success
            resolve({ fields, files })
          } else {
            reject(err)
          }
        })
      })
    })
    return promise.then(({ fields, files }) => {
      req.fields = fields
      req.files = files
      next()
    }).catch((err) => {
      res.status(400).json({ success: false, msg: err.message })
    })
  }
}
export { communityFiles }
// import multer from 'multer'
// import fs from 'fs'
// const storage = multer.diskStorage({
//   destination: async function (req, file, callback) {
//     const pathData = JSON.parse(req.body.data)
//     if (!pathData.communityId) { callback(new Error('communityId 가 입력되지 않았습니다.')) }
//     if (!pathData.privateId) { callback(new Error('privateId 가 입력되지 않았습니다.')) }
//     const path = ROOT_FOLDER + '/community/' + pathData.communityId + '/privates/' + pathData.privateId
//     await fileManage.isNotExistsMkDirAsync(path)
//     callback(null, path)
//   }
// })
// const upload = multer({ storage })
// const communityFiles = {
//   singleImage: upload.single('imagefile'),
//   singleFile: upload.single('file')
// }
