import { dbConfig } from '../../config.js'
import Knex from 'knex'
import logger from '../../utils/logger.js'
const knex = Knex(dbConfig)

function CommonRepository (conn = knex) {
  async function logging (routeMethod, url, value, reqUser) {
    logger.debug('DAO logging')
    return await conn('log').insert({
      method: routeMethod,
      api: url,
      param: value,
      in_id: reqUser,
      in_dt: conn.fn.now()
    })
  }
  return {
    logging
  }
}
function makeCommonRepository () {
  async function transaction () {
    return await knex.transaction()
  }

  return {
    transaction,
    transacting (trx) {
      return CommonRepository(trx)
    },
    ...CommonRepository()
  }
}
export default makeCommonRepository
