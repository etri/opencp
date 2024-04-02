import { dbConfig } from '../../config.js'
import logger from '../../utils/logger.js'
import Knex from 'knex'
import * as CONSTS from '../../consts.js'
const knex = Knex(dbConfig)

function Privates (conn = knex) {
  async function getPrivateSeq (communityId) {
    logger.debug('DAO getPrivateSeq')
    const [seq] = await conn
      .max('id as seq')
      .from('prvt_board')
      .where('cm_id', communityId)
    if (seq.seq === null) {
      seq.seq = 0
    }
    return seq.seq + 1
  }
  async function modifyPrivate (postInfo) {
    logger.debug('DAO modifyPrivate')
    postInfo.up_id = postInfo.usr_id
    postInfo.up_dt = conn.fn.now()
    return await conn('prvt_board')
      .where('cm_id', '=', postInfo.cm_id)
      .andWhere('id', '=', postInfo.id)
      .update(postInfo)
  }
  async function setPrivateCategory (setCategory) {
    logger.debug('DAO setPrivateCategory')
    return await conn('prvt_category')
      .insert(setCategory)
  }
  async function setPrivateHashtag (setHashtag) {
    logger.debug('DAO setPrivateHashtag')
    return await conn('prvt_hashtag')
      .insert(setHashtag)
  }
  async function listPrivates (userId, communityId, start, length, category) {
    logger.debug('DAO listPrivates')
    return await conn
      .select('b.id', 'b.title', 'b.views', 'b.likes', 'b.cmt_cnt', 'b.cmt_udt', 'b.in_id', 'b.in_dt', 'c.nick'
        , conn.raw('case when convert(b.in_dt, date) = convert(now(), date) then true else false end is_new'))
      .rowNumber('idx', 'b.in_dt')
      .from('cmnty_member as a')
      .leftJoin('prvt_board as b', function () {
        this
          .on('a.cm_id', '=', 'b.cm_id')
          .andOn('a.lvl', '<=', 'b.lvl')
          .andOn('b.status', '=', 1)
      })
      .leftJoin('user as c', 'b.in_id', 'c.id')
      .modify((queryBuilder) => {
        if (category) {
          queryBuilder.joinRaw(`inner join lateral(select * from prvt_category c where b.id = c.prv_id and b.cm_id = c.cm_id and c.ctg_id in (${[category]}) limit 1) c on true`)
        }
      })
      .where('a.usr_id', userId)
      .andWhere('a.cm_id', communityId)
      .offset(start)
      .limit(length)
      .orderBy('b.id')
  }
  async function createPrivates (userId, communityId, privateId) {
    logger.debug('DAO createPrivates')
    return await conn('prvt_board')
      .insert({
        id: privateId,
        cm_id: communityId,
        lvl: CONSTS.MEMBER_LEVEL.PRVT_M,
        in_id: userId,
        in_dt: conn.fn.now()
      })
  }
  async function getPrivateCategories (communityId, privateIds) {
    logger.debug('DAO getPrivateCategories')
    return await conn
      .select('a.prv_id', 'a.seq', 'b.name')
      .from('prvt_category as a')
      .leftJoin('brd_category as b', function () {
        this
          .on((queryBuilder) =>
            queryBuilder
              .on('a.cm_id', '=', 'b.cm_id')
              .orOn('b.cm_id', '=', 0)
          )
          .andOn('a.ctg_id', '=', 'b.id')
      })
      .where('a.cm_id', communityId)
      .whereIn('a.prv_id', privateIds)
      .orderBy('a.prv_id')
      .orderBy('a.seq')
  }
  async function getPrivateAttachSeq (attachInfo) {
    logger.debug('DAO getPrivateAttachSeq')
    const [seq] = await conn
      .max('id as seq')
      .from('prvt_attach')
      .where('cm_id', attachInfo.cm_id)
      .andWhere('prv_id', attachInfo.prv_id)
    if (seq.seq === null) {
      seq.seq = 0
    }
    return seq.seq + 1
  }
  async function uploadPrivateFiles (uploadFileInfo) {
    logger.debug('DAO uploadPrivateFiles')
    return await conn('prvt_attach')
      .insert(uploadFileInfo)
  }
  async function deletePrivateCategory (deleteInfo) {
    logger.debug('DAO deletePrivateCategory')
    return await conn('prvt_category')
      .where('cm_id', deleteInfo.cm_id)
      .andWhere('prv_id', deleteInfo.id)
      .del()
  }
  async function deletePrivateHashtag (deleteInfo) {
    logger.debug('DAO deletePrivateHashtag')
    return await conn('prvt_hashtag')
      .where('cm_id', deleteInfo.cm_id)
      .andWhere('prv_id', deleteInfo.id)
      .del()
  }
  async function getPrivateDetails (detailInfo) {
    logger.debug('DAO getPrivateDetails')
    const [details] = await conn
      .select('a.*', 'b.nick', conn.raw('ifnull(c.next_id, 0) as next_id'), conn.raw('ifnull(d.prev_id, 0) prev_id'))
      .from('prvt_board as a')
      .leftJoin('user as b', 'a.in_id', 'b.id')
      .joinRaw('left join lateral(select min(c.id) next_id FROM prvt_board c WHERE a.id < c.id AND a.cm_id = c.cm_id AND c.status = 1) c on true')
      .joinRaw('left join lateral(select max(d.id) prev_id FROM prvt_board d WHERE a.id > d.id AND a.cm_id = d.cm_id AND d.status = 1) d on true')
      .where('a.cm_id', detailInfo.cm_id)
      .andWhere('a.id', detailInfo.id)
    return details
  }
  async function getPrivateOrderlyTitles (contentInfo) {
    logger.debug('DAO getPrivateTitles')
    const titles = await conn
      .select(conn.raw(`case when a.id = ${contentInfo.prev_id} then 'prev' else 'next' end type`)
        , conn.raw(' concat(\'[\', b.1st_category, \']\', \'[\', b.2st_category, \'] \', a.title) title')
        , conn.raw('convert(a.in_dt, date) in_dt')
        , 'a.id')
      .from('prvt_board as a')
      .leftJoin(conn.min('c.name as 1st_category').max('c.name as 2st_category')
        .from('prvt_category as b')
        .leftJoin('brd_category as c', function () {
          this
            .on((queryBuilder) =>
              queryBuilder
                .on('b.cm_id', '=', 'c.cm_id')
                .orOn('c.cm_id', '=', 0)
            )
            .andOn('b.ctg_id', '=', 'c.id')
        }).as('b')
        .whereIn('b.prv_id', [contentInfo.prev_id, contentInfo.next_id])
        .andWhere('b.cm_id', contentInfo.cm_id)
        .orderBy('b.seq')
        .limit(2)
      , conn.raw('true'))
      .whereIn('a.id', [contentInfo.prev_id, contentInfo.next_id])
      .andWhere('a.cm_id', contentInfo.cm_id)
    return titles
  }
  async function getPrivateFiles (detailInfo) {
    logger.debug('DAO getPrivateFiles')
    return await conn
      .select('*')
      .from('prvt_attach')
      .where('cm_id', detailInfo.cm_id)
      .andWhere('prv_id', detailInfo.id)
  }
  async function getPrivateHashtags (detailInfo) {
    logger.debug('DAO getPrivateHashtags')
    return await conn
      .select('hashtag')
      .from('prvt_hashtag')
      .where('cm_id', detailInfo.cm_id)
      .andWhere('prv_id', detailInfo.id)
  }
  async function getPrivateWiki (communityId) {
    logger.debug('DAO getPrivateWiki')
    return await conn
      .select('prvt_wiki')
      .from('community')
      .where('id', communityId)
  }
  async function setPrivateViews (detailInfo) {
    logger.debug('DAO setPrivateViews')
    return await conn('prvt_board')
      .increment({
        views: 1
      })
      .where('cm_id', detailInfo.cm_id)
      .andWhere('id', detailInfo.id)
  }
  return {
    getPrivateSeq,
    modifyPrivate,
    setPrivateCategory,
    setPrivateHashtag,
    listPrivates,
    createPrivates,
    getPrivateCategories,
    getPrivateAttachSeq,
    uploadPrivateFiles,
    deletePrivateCategory,
    deletePrivateHashtag,
    getPrivateDetails,
    getPrivateOrderlyTitles,
    getPrivateFiles,
    getPrivateHashtags,
    getPrivateWiki,
    setPrivateViews
  }
}
export default Privates
