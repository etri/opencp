export class User {
  constructor (userInfo) {
    this.id = userInfo.id
    this.name = userInfo.name
    this.nick = userInfo.nick
    this.email1 = userInfo.email1
    this.email2 = userInfo.email2
    this.tel = userInfo.tel
    this.disable = userInfo.disable !== 0
    this.lastLoginDate = userInfo.last_login_dt
    this.lastLoginIp = userInfo.last_login_ip
    this.profile = userInfo.profile
    this.agencyId = userInfo.agncy_id
  }
}
