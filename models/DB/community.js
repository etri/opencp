export class Community {
  constructor (communityInfo) {
    this.id = communityInfo.id
    this.type = communityInfo.type
    this.name = communityInfo.name
    this.creator = communityInfo.creator
    this.owner = communityInfo.owner
    this.create_dt = communityInfo.create_dt
    this.prvt_wiki = communityInfo.prvt_wiki
    this.prvt_wiki_up_usr = communityInfo.prvt_wiki_up_usr
    this.prvt_wiki_up_dt = communityInfo.prvt_wiki_up_dt
    this.pblc_wiki = communityInfo.pblc_wiki
    this.pblc_wiki_up_usr = communityInfo.pblc_wiki_up_usr
    this.pblc_wiki_up_dt = communityInfo.pblc_wiki_up_dt
    this.status = communityInfo.status
  }
}
export class PrivateAttach {
  constructor (attachInfo) {
    this.id = attachInfo.attachId
    this.prv_id = attachInfo.privateId
    this.cm_id = attachInfo.communityId
    this.path = attachInfo.urlPath
    this.filename = attachInfo.filename
    this.org_filename = attachInfo.originalname
  }
}
export class Privates {
  constructor (postInfo) {
    this.in_id = postInfo.userId
    this.cm_id = postInfo.communityId
    this.id = postInfo.privateId
    this.title = postInfo.title
    this.content = postInfo.content
    this.lvl = postInfo.level
    this.top_fix = Boolean(postInfo.topFix)
    this.cmt_invisible = Boolean(postInfo.commentInvisible)
    this.cmt_disable = Boolean(postInfo.commentDisable)
    this.status = postInfo.status
    this.invisible = postInfo.invisible
    this.up_id = postInfo.userId
  }
}
export class Messages {
  constructor (postInfo) {
    this.in_id = postInfo.userId
    this.cm_id = postInfo.communityId
    this.id = postInfo.messageId
    this.title = postInfo.title
    this.content = postInfo.content
    this.lvl = postInfo.level
    this.top_fix = Boolean(postInfo.topFix)
    this.cmt_invisible = Boolean(postInfo.commentInvisible)
    this.cmt_disable = Boolean(postInfo.commentDisable)
    this.status = postInfo.status
    this.invisible = postInfo.invisible
    this.up_id = postInfo.userId
  }
}
export class CommunityMessage {
  constructor (messageInfo) {
    this.id = messageInfo.messageId
    this.cm_id = messageInfo.communityId
    this.title = messageInfo.title
    this.content = messageInfo.content
    this.lvl = messageInfo.level
    this.top_fix = messageInfo.topFix
    this.cmt_invisible = messageInfo.commentInvisible
    this.cmt_disable = messageInfo.commentDisable
    this.in_id = messageInfo.userId
  }
}
export class PrivatesLists {
  constructor (postInfo) {
    this.usr_id = postInfo.userId
    this.lvl = postInfo.userLevel
    this.cm_id = postInfo.communityId
    this.start = postInfo.start
    this.offset = postInfo.length
    this.category = postInfo.category
  }
}
