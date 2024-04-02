import { MEMBER_LEVEL } from '../../consts.js'
export class PrivateLists {
  constructor (listInfo) {
    this.id = listInfo.id
    this.index = listInfo.idx
    this.title = listInfo.title
    this.views = listInfo.views
    this.likes = listInfo.likes
    this.commentCnt = listInfo.cmt_cnt
    this.lastCommentDate = listInfo.cmt_udt
    this.writer = listInfo.nick
    this.inDt = listInfo.in_dt.substring(0, 10)
    this.categories = listInfo.categories
    this.isNew = listInfo.is_new
  }
}
export class PrivateDetails {
  constructor (detailInfo) {
    this.privateId = detailInfo.id
    this.communityId = detailInfo.cm_id
    this.title = detailInfo.title
    this.content = detailInfo.content
    this.level = detailInfo.lvl
    this.views = detailInfo.views
    this.likes = detailInfo.likes
    this.topFix = detailInfo.top_fix !== 0
    this.commentInvisible = detailInfo.cmt_invisible !== 0
    this.commentDisable = detailInfo.cmt_disable !== 0
    this.commentCount = detailInfo.cmt_cnt
    this.latestCommentDate = detailInfo.cmt_udt
    this.inId = detailInfo.in_id
    this.inDt = detailInfo.in_dt.substring(0, 10)
    this.upId = detailInfo.up_id
    this.upDt = detailInfo.up_dt
    this.delYn = detailInfo.del_yn !== 0
    this.delDt = detailInfo.del_dt
    this.delId = detailInfo.del_id
    this.status = detailInfo.status
    this.invisible = detailInfo.invisible !== 0
    this.nick = detailInfo.nick
    this.nextId = detailInfo.next_id
    this.previewId = detailInfo.prev_id
  }
}
export class MessageDetails {
  constructor (detailInfo) {
    this.messageId = detailInfo.id
    this.communityId = detailInfo.cm_id
    this.title = detailInfo.title
    this.content = detailInfo.content
    this.level = detailInfo.lvl
    this.views = detailInfo.views
    this.likes = detailInfo.likes
    this.topFix = detailInfo.top_fix !== 0
    this.commentInvisible = detailInfo.cmt_invisible !== 0
    this.commentDisable = detailInfo.cmt_disable !== 0
    this.commentCount = detailInfo.cmt_cnt
    this.latestCommentDate = detailInfo.cmt_udt
    this.inId = detailInfo.in_id
    this.inDt = detailInfo.in_dt.substring(0, 10)
    this.upId = detailInfo.up_id
    this.upDt = detailInfo.up_dt
    this.delYn = detailInfo.del_yn !== 0
    this.delDt = detailInfo.del_dt
    this.delId = detailInfo.del_id
    this.status = detailInfo.status
    this.invisible = detailInfo.invisible !== 0
    this.nick = detailInfo.nick
    this.nextId = detailInfo.next_id
    this.previewId = detailInfo.prev_id
  }
}
export class BoardFiles {
  constructor (fileInfo) {
    this.path = fileInfo.path
    this.filename = fileInfo.filename
    this.orgFilename = fileInfo.org_filename
    this.downloadCount = fileInfo.dw_cnt
  }
}
export class MemberLists {
  constructor (memberInfo) {
    this.nick = memberInfo.nick
    this.level = memberInfo.lvl
    this.tel = memberInfo.tel
    this.email = memberInfo.email1
    this.regDate = (memberInfo.lvl < MEMBER_LEVEL.NON_M ? memberInfo.join_dt.substring(0, 10) : '')
    this.lastLoginDt = (memberInfo.last_login_dt ? memberInfo.last_login_dt.substring(0, 10) : '')
    this.index = memberInfo.idx
  }
}
export class PrivateWiki {
  constructor (wikiInfo) {
    this.privateWiki = wikiInfo.prvt_wiki
  }
}
export class CommunityInfo {
  constructor (communityInfo) {
    this.name = communityInfo.name
    this.createAt = communityInfo.create_dt.substring(0, 10)
    this.joinAt = communityInfo.join_dt.substring(0, 10)
    this.level = communityInfo.lvl
    this.memberCount = communityInfo.member_cnt
  }
}
export class CommunityMessage {
  constructor (messageInfo) {
    this.id = messageInfo.id
    this.title = messageInfo.title
    this.views = messageInfo.views
    this.likes = messageInfo.likes
    this.commentCnt = messageInfo.cmt_cnt
    this.commentLatestDt = messageInfo.cmt_udt
    this.writer = messageInfo.nick
    this.inDt = messageInfo.in_dt.substring(0, 10)
    this.index = messageInfo.idx
    this.isNew = messageInfo.is_new
  }
}
