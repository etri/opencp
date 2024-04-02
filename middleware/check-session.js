// check-session.js
// author: Yeonheon Gu
// since: 2022-11-01

import createError from 'http-errors'
import reqIp from 'request-ip'

/**
 * session middleware
 * @param {Request} req
 * @param {Response} res
 * @param {callback} next
 * @returns
 */
function checkSession (req, res, next) {
  const session = req.session
  if (!session) {
    next(createError(400, 'Session not exists'))
    return
  }

  const clientIP = reqIp.getClientIp(req)

  // IP 주소까지 확인해야 세션 아이디가 탈취되도 안전
  if (!session.userId) {
    next(createError(400, 'Session not exists'))
    return
  }

  if (session.clientIP !== clientIP) {
    next(createError(400, 'Invalid Session'))
    return
  }
  next()
}

export default checkSession
