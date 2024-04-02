/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
function UserService () {
  const that = this

  that.SIGN_UP_URL = '/api/signUp'
  that.DUPLICATE_CHECK_URL = '/api/overlap'
  that.SIGN_IN_URL = '/api/signIn'

  that.signUp = reqData => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: that.SIGN_UP_URL,
        data: reqData,
        method: 'POST',
        success: res => resolve(res),
        error: res => reject(res)
      })
    })
  }

  that.signIn = reqData => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: that.SIGN_IN_URL,
        method: 'POST',
        data: reqData,
        success: (res) => resolve(res),
        error: (res) => reject(err)
      })
    })
  }

  that.duplicateCheck = reqData => {
    return new Promise((resolve, reject) => {
      $.ajax({
        url: that.DUPLICATE_CHECK_URL,
        data: reqData,
        method: 'GET',
        success: res => resolve(res),
        error: res => reject(res)
      })
    })
  }

  return that
}
