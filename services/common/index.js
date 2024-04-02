import logger from '../../utils/logger.js'

function makeCommonService (repository) {
  const commonRepository = repository.commonRepository
  async function StartLogging (method, url) {
    logger.debug(`${method} - ${url} `)
  }
  async function EndLogging (method, url, statusCode, seconds) {
    logger.debug(`${method} - ${url}  (${statusCode}) - [${seconds}s]`)
  }
  async function DBlogging (method, url, value, userId) {
    try {
      await commonRepository.logging(method, url, value, userId)
      return {
        result: true,
        msg: 'OK'
      }
    } catch (err) {
      return {
        result: false,
        msg: err.message
      }
    }
  }
  return {
    StartLogging,
    EndLogging,
    DBlogging
  }
}
export default makeCommonService
