import { dbConfig } from '../../config.js'
import Knex from 'knex'
// import * as DbDTO from '../../models/DB/community.js'
// import logger from '../../utils/logger.js'
// import * as CONSTS from '../../consts.js'
import newMessages from './messages.js'
import newPrivates from './privates.js'
import newCommunities from './communities.js'

const knex = Knex(dbConfig)
// function newMessages (conn = knex) {
//   async function getMessageSeq (communityId) {
//     logger.debug('DAO getMessageSeq')
//     const [seq] = await conn
//       .max('id as seq')
//       .from('cmnty_message')
//       .where('cm_id', communityId)
//     if (seq.seq === null) {
//       seq.seq = 0
//     }
//     return seq.seq + 1
//   }
//   async function createMessage (userId, communityId, messageId) {
//     logger.debug('DAO createMessage')
//     return await conn('cmnty_message')
//       .insert({
//         cm_id: communityId,
//         id: messageId,
//         in_dt: conn.fn.now(),
//         in_id: userId
//       })
//   }
//   async function getMessageDetails (detailInfo) {
//     logger.debug('DAO getMessageDetails')
//     const [details] = await conn
//       .select('a.*', 'b.nick', conn.raw('ifnull(c.next_id, 0) as next_id'), conn.raw('ifnull(d.prev_id, 0) prev_id'))
//       .from('cmnty_message as a')
//       .leftJoin('user as b', 'a.in_id', 'b.id')
//       .joinRaw('left join lateral(select min(c.id) next_id FROM cmnty_message c WHERE a.id < c.id AND a.cm_id = c.cm_id AND c.status = 1) c on true')
//       .joinRaw('left join lateral(select max(d.id) prev_id FROM cmnty_message d WHERE a.id > d.id AND a.cm_id = d.cm_id AND d.status = 1) d on true')
//       .where('a.cm_id', detailInfo.cm_id)
//       .andWhere('a.id', detailInfo.id)
//     return details
//   }
//   async function getMessageOrderlyTitles (contentInfo) {
//     logger.debug('DAO getMessageOrderlyTitles')
//     console.log(contentInfo.prev_id, contentInfo.next_id)
//     const titles = await conn
//       .select(conn.raw(`case when a.id = ${contentInfo.prev_id} then 'prev' else 'next' end type`)
//         , conn.raw('convert(a.in_dt, date) in_dt')
//         , 'a.id')
//       .from('cmnty_message as a')
//       .whereIn('a.id', [contentInfo.prev_id, contentInfo.next_id])
//       .andWhere('a.cm_id', contentInfo.cm_id)
//     return titles
//   }
//   async function getMessageFiles (detailInfo) {
//     logger.debug('DAO getMessageFiles')
//     return await conn
//       .select('*')
//       .from('cmnty_msg_attach')
//       .where('cm_id', detailInfo.cm_id)
//       .andWhere('msg_id', detailInfo.id)
//   }
//   async function setMessageViews (detailInfo) {
//     logger.debug('DAO setMessageViews')
//     return await conn('cmnty_message')
//       .increment({
//         views: 1
//       })
//       .where('cm_id', detailInfo.cm_id)
//       .andWhere('id', detailInfo.id)
//   }
//   async function modifyMessage (messageInfo) {
//     logger.debug('DAO modifyPrivate')
//     messageInfo.up_id = messageInfo.usr_id
//     messageInfo.up_dt = conn.fn.now()
//     return await conn('cmnty_message')
//       .where('cm_id', '=', messageInfo.cm_id)
//       .andWhere('id', '=', messageInfo.id)
//       .update(messageInfo)
//   }
//   async function deleteMessageCategory (deleteInfo) {
//     logger.debug('DAO deleteMessageCategory')
//     return await conn('cmnty_msg_category')
//       .where('cm_id', deleteInfo.cm_id)
//       .andWhere('msg_id', deleteInfo.id)
//       .del()
//   }
//   async function setMessageCategory (setCategory) {
//     logger.debug('DAO setMessageCategory')
//     return await conn('cmnty_msg_category')
//       .insert(setCategory)
//   }
//   async function deleteMessageHashtag (deleteInfo) {
//     logger.debug('DAO deleteMessageHashtag')
//     return await conn('cmnty_msg_hashtag')
//       .where('cm_id', deleteInfo.cm_id)
//       .andWhere('msg_id', deleteInfo.id)
//       .del()
//   }
//   async function setMessageHashtag (setCategory) {
//     logger.debug('DAO setMessageHashtag')
//     return await conn('cmnty_msg_hashtag')
//       .insert(setCategory)
//   }
//   async function listMessage (userId, communityId, start, length) {
//     logger.debug('DAO listMessage')
//     return await conn
//       .select('a.id', 'a.title', 'a.views', 'a.likes', 'a.cmt_cnt', 'a.cmt_udt', 'b.nick', 'a.in_dt'
//         , conn.raw('case when convert(a.in_dt, date) = convert(now(), date) then true else false end is_new'))
//       .rowNumber('idx', 'a.in_dt')
//       .from('cmnty_message as a')
//       .leftJoin('user as b', 'a.in_id', 'b.id')
//       .where('a.cm_id', communityId)
//       .offset(start)
//       .limit(length)
//       .orderBy('a.id')
//   }
//   return {
//     getMessageSeq,
//     createMessage,
//     getMessageDetails,
//     getMessageOrderlyTitles,
//     getMessageFiles,
//     setMessageViews,
//     modifyMessage,
//     deleteMessageCategory,
//     setMessageCategory,
//     deleteMessageHashtag,
//     setMessageHashtag,
//     listMessage
//   }
// }
// function newPrivates (conn = knex) {
//   async function getPrivateSeq (communityId) {
//     logger.debug('DAO getPrivateSeq')
//     const [seq] = await conn
//       .max('id as seq')
//       .from('prvt_board')
//       .where('cm_id', communityId)
//     if (seq.seq === null) {
//       seq.seq = 0
//     }
//     return seq.seq + 1
//   }
//   async function modifyPrivate (postInfo) {
//     logger.debug('DAO modifyPrivate')
//     postInfo.up_id = postInfo.usr_id
//     postInfo.up_dt = conn.fn.now()
//     return await conn('prvt_board')
//       .where('cm_id', '=', postInfo.cm_id)
//       .andWhere('id', '=', postInfo.id)
//       .update(postInfo)
//   }
//   async function setPrivateCategory (setCategory) {
//     logger.debug('DAO setPrivateCategory')
//     return await conn('prvt_category')
//       .insert(setCategory)
//   }
//   async function setPrivateHashtag (setHashtag) {
//     logger.debug('DAO setPrivateHashtag')
//     return await conn('prvt_hashtag')
//       .insert(setHashtag)
//   }
//   async function listPrivates (userId, communityId, start, length, category) {
//     logger.debug('DAO listPrivates')
//     return await conn
//       .select('b.id', 'b.title', 'b.views', 'b.likes', 'b.cmt_cnt', 'b.cmt_udt', 'b.in_id', 'b.in_dt'
//         , conn.raw('case when convert(b.in_dt, date) = convert(now(), date) then true else false end is_new'))
//       .rowNumber('idx', 'b.in_dt')
//       .from('cmnty_member as a')
//       .leftJoin('prvt_board as b', function () {
//         this
//           .on('a.cm_id', '=', 'b.cm_id')
//           .andOn('a.lvl', '<=', 'b.lvl')
//           .andOn('b.status', '=', 1)
//       })
//       .modify((queryBuilder) => {
//         if (category) {
//           queryBuilder.joinRaw(`inner join lateral(select * from prvt_category c where b.id = c.prv_id and b.cm_id = c.cm_id and c.ctg_id in (${[category]}) limit 1) c on true`)
//         }
//       })
//       .where('a.usr_id', userId)
//       .andWhere('a.cm_id', communityId)
//       .offset(start)
//       .limit(length)
//       .orderBy('b.id')
//   }
//   async function createPrivates (userId, communityId, privateId) {
//     logger.debug('DAO createPrivates')
//     return await conn('prvt_board')
//       .insert({
//         id: privateId,
//         cm_id: communityId,
//         lvl: CONSTS.MEMBER_LEVEL.PRVT_M,
//         in_id: userId,
//         in_dt: conn.fn.now()
//       })
//   }
//   async function getPrivateCategories (communityId, privateIds) {
//     logger.debug('DAO getPrivateCategories')
//     return await conn
//       .select('a.prv_id', 'a.seq', 'b.name')
//       .from('prvt_category as a')
//       .leftJoin('brd_category as b', function () {
//         this
//           .on((queryBuilder) =>
//             queryBuilder
//               .on('a.cm_id', '=', 'b.cm_id')
//               .orOn('b.cm_id', '=', 0)
//           )
//           .andOn('a.ctg_id', '=', 'b.id')
//       })
//       .where('a.cm_id', communityId)
//       .whereIn('a.prv_id', privateIds)
//       .orderBy('a.prv_id')
//       .orderBy('a.seq')
//   }
//   async function getPrivateAttachSeq (attachInfo) {
//     logger.debug('DAO getPrivateAttachSeq')
//     const [seq] = await conn
//       .max('id as seq')
//       .from('prvt_attach')
//       .where('cm_id', attachInfo.cm_id)
//       .andWhere('prv_id', attachInfo.prv_id)
//     if (seq.seq === null) {
//       seq.seq = 0
//     }
//     return seq.seq + 1
//   }
//   async function uploadPrivateFiles (uploadFileInfo) {
//     logger.debug('DAO uploadPrivateFiles')
//     return await conn('prvt_attach')
//       .insert(uploadFileInfo)
//   }
//   async function deletePrivateCategory (deleteInfo) {
//     logger.debug('DAO deletePrivateCategory')
//     return await conn('prvt_category')
//       .where('cm_id', deleteInfo.cm_id)
//       .andWhere('prv_id', deleteInfo.id)
//       .del()
//   }
//   async function deletePrivateHashtag (deleteInfo) {
//     logger.debug('DAO deletePrivateHashtag')
//     return await conn('prvt_hashtag')
//       .where('cm_id', deleteInfo.cm_id)
//       .andWhere('prv_id', deleteInfo.id)
//       .del()
//   }
//   async function getPrivateDetails (detailInfo) {
//     logger.debug('DAO getPrivateDetails')
//     const [details] = await conn
//       .select('a.*', 'b.nick', conn.raw('ifnull(c.next_id, 0) as next_id'), conn.raw('ifnull(d.prev_id, 0) prev_id'))
//       .from('prvt_board as a')
//       .leftJoin('user as b', 'a.in_id', 'b.id')
//       .joinRaw('left join lateral(select min(c.id) next_id FROM prvt_board c WHERE a.id < c.id AND a.cm_id = c.cm_id AND c.status = 1) c on true')
//       .joinRaw('left join lateral(select max(d.id) prev_id FROM prvt_board d WHERE a.id > d.id AND a.cm_id = d.cm_id AND d.status = 1) d on true')
//       .where('a.cm_id', detailInfo.cm_id)
//       .andWhere('a.id', detailInfo.id)
//     return details
//   }
//   async function getPrivateOrderlyTitles (contentInfo) {
//     logger.debug('DAO getPrivateTitles')
//     const titles = await conn
//       .select(conn.raw(`case when a.id = ${contentInfo.prev_id} then 'prev' else 'next' end type`)
//         , conn.raw(' concat(\'[\', b.1st_category, \']\', \'[\', b.2st_category, \'] \', a.title) title')
//         , conn.raw('convert(a.in_dt, date) in_dt')
//         , 'a.id')
//       .from('prvt_board as a')
//       .leftJoin(conn.min('c.name as 1st_category').max('c.name as 2st_category')
//         .from('prvt_category as b')
//         .leftJoin('brd_category as c', function () {
//           this
//             .on((queryBuilder) =>
//               queryBuilder
//                 .on('b.cm_id', '=', 'c.cm_id')
//                 .orOn('c.cm_id', '=', 0)
//             )
//             .andOn('b.ctg_id', '=', 'c.id')
//         }).as('b')
//         .whereIn('b.prv_id', [contentInfo.prev_id, contentInfo.next_id])
//         .andWhere('b.cm_id', contentInfo.cm_id)
//         .orderBy('b.seq')
//         .limit(2)
//       , conn.raw('true'))
//       .whereIn('a.id', [contentInfo.prev_id, contentInfo.next_id])
//       .andWhere('a.cm_id', contentInfo.cm_id)
//     return titles
//   }
//   async function getPrivateFiles (detailInfo) {
//     logger.debug('DAO getPrivateFiles')
//     return await conn
//       .select('*')
//       .from('prvt_attach')
//       .where('cm_id', detailInfo.cm_id)
//       .andWhere('prv_id', detailInfo.id)
//   }
//   async function getPrivateHashtags (detailInfo) {
//     logger.debug('DAO getPrivateHashtags')
//     return await conn
//       .select('hashtag')
//       .from('prvt_hashtag')
//       .where('cm_id', detailInfo.cm_id)
//       .andWhere('prv_id', detailInfo.id)
//   }
//   async function getPrivateWiki (communityId) {
//     logger.debug('DAO getPrivateWiki')
//     return await conn
//       .select('prvt_wiki')
//       .from('community')
//       .where('id', communityId)
//   }
//   async function setPrivateViews (detailInfo) {
//     logger.debug('DAO setPrivateViews')
//     return await conn('prvt_board')
//       .increment({
//         views: 1
//       })
//       .where('cm_id', detailInfo.cm_id)
//       .andWhere('id', detailInfo.id)
//   }
//   return {
//     getPrivateSeq,
//     modifyPrivate,
//     setPrivateCategory,
//     setPrivateHashtag,
//     listPrivates,
//     createPrivates,
//     getPrivateCategories,
//     getPrivateAttachSeq,
//     uploadPrivateFiles,
//     deletePrivateCategory,
//     deletePrivateHashtag,
//     getPrivateDetails,
//     getPrivateOrderlyTitles,
//     getPrivateFiles,
//     getPrivateHashtags,
//     getPrivateWiki,
//     setPrivateViews
//   }
// }
// function newCommunities (conn = knex) {
//   async function createCommunity (pCommunityInfo) {
//     logger.debug('DAO createCommunity')
//     const communityInfo = new DbDTO.Community({
//       type: pCommunityInfo.type,
//       name: pCommunityInfo.name,
//       creator: pCommunityInfo.userId,
//       create_dt: conn.fn.now(),
//       owner: pCommunityInfo.userId,
//       prvt_wiki: pCommunityInfo.wiki,
//       pblc_wiki: pCommunityInfo.wiki,
//       pblc_wiki_up_usr: pCommunityInfo.userId,
//       prvt_wiki_up_usr: pCommunityInfo.userId,
//       pblc_wiki_up_dt: conn.fn.now(),
//       prvt_wiki_up_dt: conn.fn.now()
//     })
//     return await conn('community').insert(communityInfo).returning('id')
//   }
//   async function getApplies (communityId) {
//     logger.debug('DAO getApplies')
//     return await conn
//       .select('*')
//       .from('cmnty_member')
//       .where('cm_id', communityId)
//       .andWhere('disable', false)
//       .andWhere('lvl', CONSTS.MEMBER_LEVEL.NON_M)
//   }
//   async function changeMemberLevel (communityId, memberId, memberLevel) {
//     logger.debug('DAO changeMemberLevel')
//     return await conn('cmnty_member')
//       .update({
//         lvl: memberLevel
//       })
//       .where('cm_id', communityId)
//       .andWhere('usr_id', memberId)
//   }
//   async function changeUserCommunityLevel (communityId, memberId, memberLevel) {
//     logger.debug('DAO changeUserCommunityLevel')
//     return await conn('usr_community')
//       .update({
//         lvl: memberLevel
//       })
//       .where('cm_id', communityId)
//       .andWhere('usr_id', memberId)
//   }
//   async function getCommunityLists (communityType) {
//     logger.debug('DAO getCommunityLists')
//     return await conn
//       .select('a.name', 'b.nick', 'a.type as communityType', 'c.member_cnt as memberCnt', conn.raw(`left(a.pblc_wiki, ${CONSTS.MAIN_DOOR_WIKI_MAXIMUM}) as wiki`))
//       .from('community as a')
//       .leftJoin('user as b', 'a.owner', 'b.id')
//       .joinRaw('left join lateral (select count(*) member_cnt from cmnty_member c where a.id = c.cm_id) c on true')
//       .whereIn('a.type', [CONSTS.COMMUNITY_TYPE.AGENCY, CONSTS.COMMUNITY_TYPE.COMMUNITY, CONSTS.COMMUNITY_TYPE.PROJECT])
//       .modify((queryBuilder) => {
//         if (communityType) {
//           queryBuilder.andWhere('type', communityType)
//         }
//       })
//       .limit(12)
//   }
//   async function getCommunityOwner (communityId) {
//     logger.debug('DAO getCommunityOwner')
//     return await conn
//       .select('user.nick')
//       .from('community')
//       .leftJoin('user', 'community.owner', 'user.id')
//       .where('community.id', communityId)
//   }
//   async function countCommunityMembers (communityId) {
//     const [result] = await conn
//       .count('* as cnt')
//       .from('cmnty_member')
//       .where('cm_id', communityId)
//     return result.cnt
//   }
//   async function getMainDoor (communityId) {
//     return await conn
//       .select('left(pblc_wiki, 50) as pblcWiki')
//       .from('community')
//       .where('cm_id', communityId)
//   }
//   async function registRelationship (communityId, parentId, communityType, parentType) {
//     logger.debug('DAO registRelationship')
//     return await conn('cmnty_relationship').insert({
//       cm_id: communityId,
//       prnt_id: parentId,
//       cm_type: communityType,
//       prnt_type: parentType
//     })
//   }
//   async function getChildren (communityId) {
//     logger.debug('DAO getChildren')
//     const [[data]] = await conn.raw(`CALL getRelationship(${communityId})`)
//     return data
//   }
//   async function getCategoryCount (communityId) {
//     logger.debug('DAO getCategoryCount')
//     const [result] = await conn
//       .count('* as cnt')
//       .from('brd_category')
//       .where('cm_id', communityId)
//     return result.cnt
//   }
//   async function getBoardCategoryId (communityId) {
//     logger.debug('DAO getBoardCategoryId')
//     const [seq] = await conn
//       .max('id as seq')
//       .from('brd_category')
//       .where('cm_id', communityId)
//     if (seq.seq === null) {
//       seq.seq = CONSTS.BOARD_CATEGORY_FIXED_COUNT
//     }
//     return seq.seq + 1
//   }
//   async function registCategory (communityId, categoryId, category) {
//     logger.debug('DAO registCategory')
//     return await conn('brd_category')
//       .insert({
//         cm_id: communityId,
//         id: categoryId,
//         name: category
//       })
//   }
//   async function getMembersInfo (communityId) {
//     logger.debug('DAO getMembersInfo')
//     return await conn
//       .select('b.nick', 'a.lvl', 'b.tel', 'b.email1', 'a.join_dt', 'b.last_login_dt')
//       .rowNumber('idx', ['a.join_dt', 'a.lvl'])
//       // .rowNumber('idx', [{ column: 'a.join_dt', order: 'asc' }, { column: 'a.lvl', order: 'asc' }])
//       .from('cmnty_member as a')
//       .leftJoin('user as b', 'a.usr_id', 'b.id')
//       .where('cm_id', communityId)
//   }
//   async function getCommunityInfo (communityId, userId) {
//     logger.debug('DAO getCommunityInfo')
//     return await conn
//       .select('a.name', 'a.create_dt', 'b.join_dt', 'c.member_cnt')
//       .from('community as a')
//       .leftJoin('cmnty_member as b', function () {
//         this
//           .on('a.id', '=', 'b.cm_id')
//           .andOnIn('b.usr_id', [userId])
//       })
//       .joinRaw('left join lateral (select count(*) member_cnt from cmnty_member c where a.id = c.cm_id) c on true')
//       .where('a.id', communityId)
//   }
//   async function getCategories (communityId) {
//     logger.debug('DAO getCategories')
//     return await conn
//       .select('id', 'name')
//       .from('brd_category')
//       .where(function () {
//         this.where('cm_id', communityId).orWhere('cm_id', '=', 0)
//       })
//   }
//   return {
//     createCommunity,
//     getApplies,
//     changeMemberLevel,
//     changeUserCommunityLevel,
//     getCommunityLists,
//     getCommunityOwner,
//     countCommunityMembers,
//     getMainDoor,
//     registRelationship,
//     getChildren,
//     getCategoryCount,
//     getBoardCategoryId,
//     registCategory,
//     getMembersInfo,
//     getCommunityInfo,
//     getCategories
//   }
// }
function CommunityRepository (conn = knex) {
  const privates = newPrivates(conn)
  const messages = newMessages(conn)
  const communities = newCommunities(conn)
  return {
    ...privates,
    ...messages,
    ...communities
  }
}
function makeCommunityRepository () {
  async function transaction () {
    return await knex.transaction()
  }
  return {
    transaction,
    transacting (trx) {
      return CommunityRepository(trx)
    },
    ...CommunityRepository()
  }
}
export default makeCommunityRepository
