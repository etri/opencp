import { dbConfig } from '../../config.js'
import * as DbDTO from '../../models/DB/user.js'
import Knex from 'knex'
import logger from '../../utils/logger.js'

const knex = Knex(dbConfig)

function UserRepository (conn = knex) {
  function getMatchId (userId) {
    logger.debug('DAO getMatchId')
    return conn
      .select('id')
      .from('user')
      .where('id', userId)
  }
  function getMatchTel (userTel) {
    logger.debug('DAO getMatchTel')
    return conn
      .select('tel')
      .from('user')
      .where('tel', userTel)
  }
  function getMatchEmail (userEmail) {
    logger.debug('DAO getMatchEmail')
    return conn
      .select('email1')
      .from('user')
      .where('email1', userEmail)
  }
  async function getUserHashtag (userId, hashtags) {
    logger.debug('DAO getUserHashtag')
    return conn
      .select('hashtag')
      .from('usr_hashtag')
      .where('usr_id', userId)
      .whereIn('hashtag', hashtags)
  }
  async function createUser (userInfo) {
    logger.debug('DAO createUser')
    // const userInfo = new User(pUserInfo)
    // userInfo.profile = '안녕하세요. ' + userInfo.id + ' 입니다.'
    return await conn('user').insert(userInfo)
  }
  async function setUserHashtag (userHashtags) {
    logger.debug('DAO setUserHashtag')
    return await conn('usr_hashtag')
      .insert(userHashtags)
  }

  async function createPersonalCommunity (userId) {
    logger.debug('DAO createPersonalCommunity')
    return await conn('community').insert({
      type: 2,
      name: userId + '님의 개인 커뮤니티',
      creator: userId,
      owner: userId,
      create_dt: conn.fn.now(),
      prvt_wiki: userId + '님의 개인 커뮤니티입니다.',
      prvt_wiki_up_usr: userId,
      prvt_wiki_up_dt: conn.fn.now(),
      pblc_wiki: userId + '님의 개인 커뮤니티입니다.',
      pblc_wiki_up_usr: userId,
      pblc_wiki_up_dt: conn.fn.now()
    }).returning('id')
  }

  async function registMember (userId, communityId, level) {
    logger.debug('DAO registMember')
    return await conn('cmnty_member').insert({
      cm_id: communityId,
      usr_id: userId,
      lvl: level,
      join_dt: conn.fn.now()
    })
  }
  async function registCommunity (userId, communityId, communityType, level) {
    logger.debug('DAO registCommunity')
    return await conn('usr_community').insert({
      usr_id: userId,
      cm_id: communityId,
      cm_type: communityType,
      lvl: level,
      join_dt: conn.fn.now()
    })
  }
  async function getUserInfo (id, pw) {
    logger.debug('DAO getUserInfo')
    const userInfo = await conn
      .select('*')
      .from('user')
      .where('id', id)
      .andWhere('pw', pw)
    return userInfo
  }
  function updateLastSignIn (id, ip) {
    logger.debug('DAO updateLastSignIn')
    return conn('user')
      .update({
        last_login_dt: conn.fn.now(),
        last_login_ip: ip
      })
      .where('id', id)
  }
  function updateUserInfo (pUserInfo) {
    logger.debug('DAO updateUserInfo')
    const userInfo = new DbDTO.User(pUserInfo)
    return conn('user')
      .update({
        pw: userInfo.pw,
        name: userInfo.name,
        nick: userInfo.nick,
        email1: userInfo.email1,
        email2: userInfo.email2,
        tel: userInfo.tel
      })
      .where('id', userInfo.id)
  }
  function disableUser (userId) {
    logger.debug('DAO disableUser')
    return conn('user')
      .update({
        disable: true
      })
      .where('id', userId)
  }

  async function getLastCreatedCommunity (userId, communityType) {
    logger.debug('DAO getLastCreatedCommunity')
    return await conn
      .max('id as id')
      .from('community')
      .where('owner', userId)
      .modify((queryBuilder) => {
        if (communityType) {
          queryBuilder.whereIn('type', communityType)
        }
      })
  }
  async function setFavorite (userId, communityId, isRegist) {
    logger.debug('DAO setFavorite')
    return await conn('usr_community')
      .update({
        favorite: isRegist
      })
      .where('usr_id', userId)
      .andWhere('cm_id', communityId)
  }
  async function countScribeHashTag (scribeInfo) {
    logger.debug('DAO countScribeHashTag')
    const [result] = await conn
      .count('* as cnt')
      .from('usr_scribe')
      .where('usr_id', scribeInfo.usr_id)
      .andWhere('cm_id', scribeInfo.cm_id)
    return result.cnt
  }
  async function setScribeHashtag (scribeInfo) {
    logger.debug('DAO setScribeHashtag')
    return await conn('usr_scribe').insert(scribeInfo)
  }
  async function getMemberInfo (userId, communityId) {
    logger.debug('DAO getMemberInfo')
    const [memberList] = await conn
      .select('*')
      .from('cmnty_member')
      .where('cm_id', communityId)
      .andWhere('usr_id', userId)
    return memberList
  }
  async function getScribeHashTag (scribeInfo) {
    logger.debug('DAO getScribeHashTag')
    return await conn
      .select('*')
      .from('usr_scribe')
      .where('cm_id', scribeInfo.cm_id)
      .andWhere('usr_id', scribeInfo.usr_id)
      .andWhere('hashtag', scribeInfo.hashtag)
  }
  async function deleteScribeHashtag (userId, communityId, hashtag) {
    logger.debug('DAO deleteScribeHashtag')
    return await conn('usr_scribe')
      .where('usr_id', userId)
      .andWhere('cm_id', communityId)
      .andWhere('hashtag', hashtag)
      .del()
  }
  async function disableMember (memberId, communityId) {
    logger.debug('DAO disableMember')
    return await conn('cmnty_member')
      .update({
        disable: true
      })
      .where('cm_id', communityId)
      .andWhere('usr_id', memberId)
  }
  async function disableUserCommunity (memberId, communityId) {
    logger.debug('DAO disableUserCommunity')
    return await conn('usr_community')
      .update({
        disable: true
      })
      .where('cm_id', communityId)
      .andWhere('usr_id', memberId)
  }
  async function getReceivedMessage (userId, communityId, start, length) {
    logger.debug('DAO getReceivedMessage')
    return await conn
      .select('*')
      .from('msg_received as a')
      .leftJoin('message as b', function () {
        this
          .on('a.usr_id', '=', 'b.usr_id')
          .andOn('a.cm_id', '=', 'b.cm_id')
          .andOn('a.msg_id', '=', 'b.id')
      })
      .where('a.rcv_usr_id', userId)
      .orderBy('a.msg_id')
      .offset(start)
      .limit(length)
      .modify((queryBuilder) => {
        if (communityId) {
          queryBuilder.andWhere('a.cm_id', communityId)
        }
      })
  }
  return {
    getMatchId,
    getMatchTel,
    getMatchEmail,
    getUserHashtag,
    createUser,
    setUserHashtag,
    createPersonalCommunity,
    registMember,
    registCommunity,
    getUserInfo,
    updateLastSignIn,
    updateUserInfo,
    disableUser,
    getLastCreatedCommunity,
    setFavorite,
    countScribeHashTag,
    setScribeHashtag,
    getMemberInfo,
    getScribeHashTag,
    deleteScribeHashtag,
    disableMember,
    disableUserCommunity,
    getReceivedMessage
  }
}
function makeUserRepository () {
  async function transaction () {
    return await knex.transaction()
  }
  // async trx => {
  //   try {
  //     return await callback(trx)
  //   } catch (err) {
  //     // await trx.rollback()
  //     throw new Error(err)
  //     // logger.error(err.message)
  //   }
  // }
  // )
  // let conn
  // try {
  //   conn = await knex.transaction()
  //     .then(async (trx) => { return await callback(trx) })
  // } catch (err) {
  //   conn.rollback()
  // }
  // .then(async (trx) => { return await callback(trx) })

  return {
    transaction,
    transacting (trx) {
      return UserRepository(trx)
    },
    ...UserRepository()
  }
}
export default makeUserRepository
// registMember  (obj={}) {
// const {pUserInfo, pCommunityInfo, pLevel, pTrx} = obj
//   const userInfo = new User(pUserInfo)
//   const communityInfo = new Community(pCommunityInfo)

//   return knex.transaction(async trx => {
//     await trx('user_community').insert({
//       usr_id: userInfo.id,
//       cm_id: communityInfo.id,
//       cm_ctg: communityInfo.ctg_id,
//       level: pLevel,
//       join_dt: knex.fn.now()
//     }).modify((queryBuilder) => {
//       if (pTrx) {
//         queryBuilder.transacting(pTrx)
//       }
//     })
//     await trx('cmnty_member').insert({
//       cm_id: communityInfo.id,
//       usr_id: userInfo.id,
//       level: pLevel,
//       memo: '생성자',
//       join_dt: knex.fn.now()
//     }).modify((queryBuilder) => {
//       if (pTrx) {
//         queryBuilder.transacting(pTrx)
//       }
//     })
//   })
// },
