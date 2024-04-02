export class User {
  constructor (userInfo) {
    this.id = userInfo.id
    this.pw = userInfo.pw
    this.name = userInfo.name
    this.nick = userInfo.nick
    this.email1 = userInfo.email1
    this.email2 = userInfo.email2
    this.tel = userInfo.tel
    this.disable = userInfo.disable
    this.last_login_dt = userInfo.last_login_dt
    this.last_login_ip = userInfo.last_login_ip
    this.profile = userInfo.profile
    this.agncy_id = userInfo.agncy_id
  }
}
export class Scribe {
  constructor (scribeInfo) {
    this.usr_id = scribeInfo.userId
    this.cm_id = scribeInfo.communityId
    this.hashtag = scribeInfo.hashtag
  }
}
