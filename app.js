import express from 'express'
import session from 'express-session'

import formidable from 'formidable'
import fs from 'fs'

import MakeMySQLStore from 'express-mysql-session'

import { port, ROOT_FOLDER, dbConfig } from './config.js'

import path from 'path'
import { route as indexRoute } from './routes/index.js'
import { route as userRoute } from './routes/user.js'
import { route as communityRoute } from './routes/community.js'

import morganMiddleware from './middleware/morgan.middleware.js'

// The morgan middleware does not need this.
// This is for a manual log
import logger from './utils/logger.js'

const MysqlStore = MakeMySQLStore(session)

// const __filename = fileURLToPath(import.meta.url)
const __dirname = path.resolve()

const app = express()
// const route = express.Router()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use(morganMiddleware)

const sessionMiddleware = session({
  secret: '!MO!CMNTYPLTFRM!DU!',
  resave: false,
  useAsync: true,
  saveUninitialized: false,
  store: new MysqlStore({ ...dbConfig.connection })
})

app.use(sessionMiddleware)

app.set('views', path.join(__dirname, 'public', 'html'))
app.set('view engine', 'ejs')

app.use('/', indexRoute)
app.use('/api', userRoute)
app.use('/api', communityRoute)
app.use('/community', express.static(ROOT_FOLDER + '/community'))

// app.use('/test/login', (req, res) => {
//   const userId = req.body
//   const clientIP = reqIp.getClientIp(req)
//   logger.info(`${userId} is logged in at the ${clientIP}`)
//   req.session.userId = userId
//   req.session.clientIP = clientIP
//   res.send({
//     success: true
//   })
// })

// app.use('/test/logout', (req, res) => {
//   req.session.destroy(() => {
//     res.send({
//       success: true
//     })
//   })
// })

// app.use('/test/api', checkSession, (req, res) => {
//   res.send({
//     success: true
//   })
// })

app.use('/test/upload', (req, res, next) => {
  const form = new formidable.IncomingForm()

  // 파일외에 폼에서 꺼내고 싶은 값은 fields 에서 꺼내고
  // 파일은 files 에서 꺼낸다.
  form.parse(req, (err, fields, files) => {
    if (err) {
      next(err)
      return
    }
    const { communityId, boradId } = fields

    const savePath =
      ROOT_FOLDER + '/community/' + communityId + '/privates/' + boradId
    const file = files.file // file: form field name
    // 임시파일로 저장되니깐 필요한 곳으로 이름을 변경할 것
    fs.rename(file.filepath, savePath + '/' + file.originalFilename, err => {
      if (!err) {
        // success
      }
    })
    res.json({ fields, files })
  })
})
app.locals.rootPath = path.join(__dirname, 'public', 'html')

app.use('/', express.static(path.join(__dirname, 'public')))
app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

// route.get('/signOut', (req, res) => {
//   req.session.destroy()
//   /* res.redirect("/login"); */
// })

app.use((err, req, res, next) => {
  if (res.headersSent) {
    return next(err)
  }
  res.status(500).send({
    success: false,
    message: err.message
  })
})

app.listen(port, '0.0.0.0', () => {
  logger.info(`server is running on ${port}`)
})
