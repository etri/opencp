import makeCommunityRepository from './community/index.js'
import makeUserRepository from './user/index.js'
import makeCommonRepository from './common/index.js'
const userRepository = makeUserRepository()
const communityRepository = makeCommunityRepository()
const commonRepository = makeCommonRepository()

export default {
  userRepository,
  communityRepository,
  commonRepository
}
