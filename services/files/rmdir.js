// rmdir.js
// author: Yeonheon Gu
// since: 2022-10-28

import fs from 'fs'

/**
 * remove directory recursively
 * @param {string} path - target directory path
 * @returns Promise
 */
function rmDirAsync (path) {
  return new Promise((resolve, reject) => {
    fs.rm(path, { recursive: true, force: true }, err => {
      if (err) {
        reject(err)
        return
      }
      resolve()
    })
  })
}

export default rmDirAsync
