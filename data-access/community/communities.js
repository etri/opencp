import { dbConfig } from '../../config.js'
import Knex from 'knex'
import logger from '../../utils/logger.js'
import * as CONSTS from '../../consts.js'
import * as DbDTO from '../../models/DB/community.js'

const knex = Knex(dbConfig)
function Communities (conn = knex) {
  async function createCommunity (pCommunityInfo) {
    logger.debug('DAO createCommunity')
    const communityInfo = new DbDTO.Community({
      type: pCommunityInfo.type,
      name: pCommunityInfo.name,
      creator: pCommunityInfo.userId,
      create_dt: conn.fn.now(),
      owner: pCommunityInfo.userId,
      prvt_wiki: pCommunityInfo.wiki,
      pblc_wiki: pCommunityInfo.wiki,
      pblc_wiki_up_usr: pCommunityInfo.userId,
      prvt_wiki_up_usr: pCommunityInfo.userId,
      pblc_wiki_up_dt: conn.fn.now(),
      prvt_wiki_up_dt: conn.fn.now()
    })
    return await conn('community').insert(communityInfo).returning('id')
  }
  async function getApplies (communityId) {
    logger.debug('DAO getApplies')
    return await conn
      .select('*')
      .from('cmnty_member')
      .where('cm_id', communityId)
      .andWhere('disable', false)
      .andWhere('lvl', CONSTS.MEMBER_LEVEL.NON_M)
  }
  async function changeMemberLevel (communityId, memberId, memberLevel) {
    logger.debug('DAO changeMemberLevel')
    return await conn('cmnty_member')
      .update({
        lvl: memberLevel
      })
      .where('cm_id', communityId)
      .andWhere('usr_id', memberId)
  }
  async function changeUserCommunityLevel (communityId, memberId, memberLevel) {
    logger.debug('DAO changeUserCommunityLevel')
    return await conn('usr_community')
      .update({
        lvl: memberLevel
      })
      .where('cm_id', communityId)
      .andWhere('usr_id', memberId)
  }
  async function getCommunityLists (communityType) {
    logger.debug('DAO getCommunityLists')
    return await conn
      .select('a.name', 'b.nick', 'a.type as communityType', 'c.member_cnt as memberCnt', conn.raw(`left(a.pblc_wiki, ${CONSTS.MAIN_DOOR_WIKI_MAXIMUM}) as wiki`))
      .from('community as a')
      .leftJoin('user as b', 'a.owner', 'b.id')
      .joinRaw('left join lateral (select count(*) member_cnt from cmnty_member c where a.id = c.cm_id) c on true')
      .whereIn('a.type', [CONSTS.COMMUNITY_TYPE.AGENCY, CONSTS.COMMUNITY_TYPE.COMMUNITY, CONSTS.COMMUNITY_TYPE.PROJECT])
      .modify((queryBuilder) => {
        if (communityType) {
          queryBuilder.andWhere('type', communityType)
        }
      })
      .limit(12)
  }
  async function getCommunityOwner (communityId) {
    logger.debug('DAO getCommunityOwner')
    return await conn
      .select('user.nick')
      .from('community')
      .leftJoin('user', 'community.owner', 'user.id')
      .where('community.id', communityId)
  }
  async function countCommunityMembers (communityId) {
    const [result] = await conn
      .count('* as cnt')
      .from('cmnty_member')
      .where('cm_id', communityId)
    return result.cnt
  }
  async function getMainDoor (communityId) {
    return await conn
      .select('left(pblc_wiki, 50) as pblcWiki')
      .from('community')
      .where('cm_id', communityId)
  }
  async function registRelationship (communityId, parentId, communityType, parentType) {
    logger.debug('DAO registRelationship')
    return await conn('cmnty_relationship').insert({
      cm_id: communityId,
      prnt_id: parentId,
      cm_type: communityType,
      prnt_type: parentType
    })
  }
  async function getChildren (communityId) {
    logger.debug('DAO getChildren')
    const [[data]] = await conn.raw(`CALL getRelationship(${communityId})`)
    return data
  }
  async function getCategoryCount (communityId) {
    logger.debug('DAO getCategoryCount')
    const [result] = await conn
      .count('* as cnt')
      .from('brd_category')
      .where('cm_id', communityId)
    return result.cnt
  }
  async function getBoardCategoryId (communityId) {
    logger.debug('DAO getBoardCategoryId')
    const [seq] = await conn
      .max('id as seq')
      .from('brd_category')
      .where('cm_id', communityId)
    if (seq.seq === null) {
      seq.seq = CONSTS.BOARD_CATEGORY_FIXED_COUNT
    }
    return seq.seq + 1
  }
  async function registCategory (communityId, categoryId, category) {
    logger.debug('DAO registCategory')
    return await conn('brd_category')
      .insert({
        cm_id: communityId,
        id: categoryId,
        name: category
      })
  }
  async function getMembersInfo (communityId) {
    logger.debug('DAO getMembersInfo')
    return await conn
      .select('b.nick', 'a.lvl', 'b.tel', 'b.email1', 'a.join_dt', 'b.last_login_dt')
      .rowNumber('idx', ['a.join_dt', 'a.lvl'])
      // .rowNumber('idx', [{ column: 'a.join_dt', order: 'asc' }, { column: 'a.lvl', order: 'asc' }])
      .from('cmnty_member as a')
      .leftJoin('user as b', 'a.usr_id', 'b.id')
      .where('cm_id', communityId)
  }
  async function getCommunityInfo (communityId, userId) {
    logger.debug('DAO getCommunityInfo')
    return await conn
      .select('a.name', 'a.create_dt', 'b.join_dt', 'c.member_cnt', 'b.lvl')
      .from('community as a')
      .leftJoin('cmnty_member as b', function () {
        this
          .on('a.id', '=', 'b.cm_id')
          .andOnIn('b.usr_id', [userId])
      })
      .joinRaw('left join lateral (select count(*) member_cnt from cmnty_member c where a.id = c.cm_id) c on true')
      .where('a.id', communityId)
  }
  async function getCategories (communityId) {
    logger.debug('DAO getCategories')
    return await conn
      .select('id', 'name')
      .from('brd_category')
      .where(function () {
        this.where('cm_id', communityId).orWhere('cm_id', '=', 0)
      })
  }
  async function getMemberLevel (userId, communityId) {
    logger.debug('DAO getCategories')
    const [level] = await conn
      .select('lvl')
      .from('cmnty_member')
      .where('cm_id', communityId)
      .andWhere('usr_id', userId)
    return level
  }
  return {
    createCommunity,
    getApplies,
    changeMemberLevel,
    changeUserCommunityLevel,
    getCommunityLists,
    getCommunityOwner,
    countCommunityMembers,
    getMainDoor,
    registRelationship,
    getChildren,
    getCategoryCount,
    getBoardCategoryId,
    registCategory,
    getMembersInfo,
    getCommunityInfo,
    getCategories,
    getMemberLevel
  }
}
export default Communities
