import fs from 'fs'
import { isNotExistsMkDirAsync } from './mkdir.js'
import rmDirAsync from './rmdir.js'

export function mkdir (path) {
  !fs.existsSync(path) && fs.mkdirSync(path, { recursive: true })
}

export default {
  isNotExistsMkDirAsync,
  mkdir,
  rmDirAsync
}
