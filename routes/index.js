import express from 'express'
import multer from 'multer'
const upload = multer({ dest: './uploads' })

const route = express.Router()

// 메인페이지
route.get('/', (req, res, next) => {
  const session = req.session || {}
  if ('level' in session) {
    delete session.level// 세션 삭제

    req.session.save(function () { // 데이터 저장이 끝났을때 호출됨 안전하게 redirect하기 위함
      res.redirect('/') // 웹페이지 강제 이동
    })
  } else {
    res.render('index', { session })
  }
})

// 회원가입 페이지
route.get('/join', (req, res, next) => {
  res.render('join')
})

// 로그인 페이지
route.get('/login', (req, res, next) => {
  if (req.session.userId) {
    req.session.destroy(err => {
      if (err) throw err
      res.redirect(302, '/') // 웹페이지 강제 이동
    })
  } else {
    res.render('login')
  }
  //
})

route.get('/community/:communityId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  res.render('community/private/index', { session, communityId })
})

route.get('/community/private/board/list/:communityId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  res.render('community/private/board/list', { session, communityId })
})
route.get('/community/private/board/detail/:communityId/:index/:privateId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  const privateId = req.params.privateId
  const index = req.params.index
  res.render('community/private/board/detail', { session, communityId, index, privateId })
})
route.get('/community/private/board/upsert/:communityId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  res.render('community/private/board/upsert', { session, communityId })
})
route.get('/community/message/list/:communityId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  res.render('community/message/list', { session, communityId })
})
route.get('/community/message/upsert/:communityId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  res.render('community/message/upsert', { session, communityId })
})
route.get('/community/message/detail/:communityId/:index/:messageId', (req, res, next) => {
  const session = req.session
  const communityId = req.params.communityId
  const messageId = req.params.messageId
  const index = req.params.index
  res.render('community/message/detail', { session, communityId, index, messageId })
})
route.get('/recommend/list', (req, res, next) => {
  res.status(200).send()
})

route.get('/template/maindoor', (req, res, next) => {
  res.render('template/maindoor')
})

route.post('/upload', upload.any(), function (req, res, next) {
  console.log(req.files)
  console.log(req.body.content)
})
export { route }
