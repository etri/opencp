import { dbConfig } from '../../config.js'
import logger from '../../utils/logger.js'
import Knex from 'knex'
const knex = Knex(dbConfig)

function Messages (conn = knex) {
  async function getMessageSeq (communityId) {
    logger.debug('DAO getMessageSeq')
    const [seq] = await conn
      .max('id as seq')
      .from('cmnty_message')
      .where('cm_id', communityId)
    if (seq.seq === null) {
      seq.seq = 0
    }
    return seq.seq + 1
  }
  async function createMessage (userId, communityId, messageId) {
    logger.debug('DAO createMessage')
    return await conn('cmnty_message')
      .insert({
        cm_id: communityId,
        id: messageId,
        in_dt: conn.fn.now(),
        in_id: userId
      })
  }
  async function getMessageDetails (detailInfo) {
    logger.debug('DAO getMessageDetails')
    const [details] = await conn
      .select('a.*', 'b.nick', conn.raw('ifnull(c.next_id, 0) as next_id'), conn.raw('ifnull(d.prev_id, 0) prev_id'))
      .from('cmnty_message as a')
      .leftJoin('user as b', 'a.in_id', 'b.id')
      .joinRaw('left join lateral(select min(c.id) next_id FROM cmnty_message c WHERE a.id < c.id AND a.cm_id = c.cm_id AND c.status = 1) c on true')
      .joinRaw('left join lateral(select max(d.id) prev_id FROM cmnty_message d WHERE a.id > d.id AND a.cm_id = d.cm_id AND d.status = 1) d on true')
      .where('a.cm_id', detailInfo.cm_id)
      .andWhere('a.id', detailInfo.id)
    return details
  }
  async function getMessageOrderlyTitles (contentInfo) {
    logger.debug('DAO getMessageOrderlyTitles')
    console.log(contentInfo.prev_id, contentInfo.next_id)
    const titles = await conn
      .select(conn.raw(`case when a.id = ${contentInfo.prev_id} then 'prev' else 'next' end type`)
        , conn.raw('convert(a.in_dt, date) in_dt')
        , 'a.id')
      .from('cmnty_message as a')
      .whereIn('a.id', [contentInfo.prev_id, contentInfo.next_id])
      .andWhere('a.cm_id', contentInfo.cm_id)
    return titles
  }
  async function getMessageFiles (detailInfo) {
    logger.debug('DAO getMessageFiles')
    return await conn
      .select('*')
      .from('cmnty_msg_attach')
      .where('cm_id', detailInfo.cm_id)
      .andWhere('msg_id', detailInfo.id)
  }
  async function setMessageViews (detailInfo) {
    logger.debug('DAO setMessageViews')
    return await conn('cmnty_message')
      .increment({
        views: 1
      })
      .where('cm_id', detailInfo.cm_id)
      .andWhere('id', detailInfo.id)
  }
  async function modifyMessage (messageInfo) {
    logger.debug('DAO modifyPrivate')
    messageInfo.up_id = messageInfo.usr_id
    messageInfo.up_dt = conn.fn.now()
    return await conn('cmnty_message')
      .where('cm_id', '=', messageInfo.cm_id)
      .andWhere('id', '=', messageInfo.id)
      .update(messageInfo)
  }
  async function deleteMessageCategory (deleteInfo) {
    logger.debug('DAO deleteMessageCategory')
    return await conn('cmnty_msg_category')
      .where('cm_id', deleteInfo.cm_id)
      .andWhere('msg_id', deleteInfo.id)
      .del()
  }
  async function setMessageCategory (setCategory) {
    logger.debug('DAO setMessageCategory')
    return await conn('cmnty_msg_category')
      .insert(setCategory)
  }
  async function deleteMessageHashtag (deleteInfo) {
    logger.debug('DAO deleteMessageHashtag')
    return await conn('cmnty_msg_hashtag')
      .where('cm_id', deleteInfo.cm_id)
      .andWhere('msg_id', deleteInfo.id)
      .del()
  }
  async function setMessageHashtag (setCategory) {
    logger.debug('DAO setMessageHashtag')
    return await conn('cmnty_msg_hashtag')
      .insert(setCategory)
  }
  async function listMessage (userId, communityId, start, length) {
    logger.debug('DAO listMessage')
    console.log(userId, communityId, start, length)
    return await conn
      .select('b.id', 'b.title', 'b.views', 'b.likes', 'b.cmt_cnt', 'b.cmt_udt', 'b.in_id', 'b.in_dt', 'c.nick'
        , conn.raw('case when convert(b.in_dt, date) = convert(now(), date) then true else false end is_new'))
      .rowNumber('idx', 'b.in_dt')
      .from('cmnty_member as a')
      .leftJoin('cmnty_message as b', function () {
        this
          .on('a.cm_id', '=', 'b.cm_id')
          .andOn('a.lvl', '<=', 'b.lvl')
          .andOn('b.status', '=', 1)
      })
      .leftJoin('user as c', 'b.in_id', 'c.id')
      .where('a.usr_id', userId)
      .andWhere('a.cm_id', communityId)
      .offset(start)
      .limit(length)
      .orderBy('b.id')
  }
  return {
    getMessageSeq,
    createMessage,
    getMessageDetails,
    getMessageOrderlyTitles,
    getMessageFiles,
    setMessageViews,
    modifyMessage,
    deleteMessageCategory,
    setMessageCategory,
    deleteMessageHashtag,
    setMessageHashtag,
    listMessage
  }
}
export default Messages
