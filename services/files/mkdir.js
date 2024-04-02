// mkdir.js
// author: Yeonheon Gu
// since: 2022-10-28

import fs from 'fs'

function isNotExistsMkDirAsync (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, (err) => {
      if (err) {
        fs.mkdir(path, { recursive: true }, err => {
          if (err) {
            reject(err)
            return
          }
          resolve()
        })
      }
      resolve()
    })
  })
}
/**
 * make directory if directory not exits
 * @param {string} path - directory path
 * @returns Promise
 */
function mkDirAsync (path) {
  return new Promise((resolve, reject) => {
    fs.access(path, fs.F_OK, err => {
      if (!err) {
        reject(new Error('already exists'))
        return
      }
      fs.mkdir(path, { recursive: true }, err => {
        if (err) {
          reject(err)
          return
        }
        resolve()
      })
    })
  })
}
export {
  isNotExistsMkDirAsync,
  mkDirAsync
}
