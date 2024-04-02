import logger from '../../utils/logger.js'
import * as CONSTS from '../../consts.js'
import * as DbDTO from '../../models/DB/user.js'
import * as clientDTO from '../../models/client/user.js'
function makeUserService (repository) {
  const userRepository = repository.userRepository
  async function checkOverlap (userInfo) {
    logger.debug('Service checkOverlap')
    let chkId
    let chkTel
    let chkEmail
    try {
      if (userInfo.id) {
        chkId = await userRepository.getMatchId(userInfo.id)
      }
      if (userInfo.tel) {
        chkTel = await userRepository.getMatchTel(userInfo.tel)
      }
      if (userInfo.email) {
        chkEmail = await userRepository.getMatchEmail(userInfo.email)
      }
      const data = []
      if (chkId && chkId.length) {
        data[data.length] = 'id'
      }
      if (chkTel && chkTel.length) {
        data[data.length] = 'tel'
      }
      if (chkEmail && chkEmail.length) {
        data[data.length] = 'email'
      }
      return {
        success: data.length === 0,
        data
      }
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  async function createUser (userInfo) {
    logger.debug('Service createUser')
    const overlap = await checkOverlap(userInfo)
    if (!overlap.success) { return overlap }

    let trx
    try {
      trx = await userRepository.transaction()
      const createUserInfo = new DbDTO.User(userInfo)
      createUserInfo.profile = '안녕하세요. ' + userInfo.id + ' 입니다.'
      await userRepository.transacting(trx).createUser(createUserInfo)
      const duplication = [...new Set(userInfo.hashtag)]
      const userHashtag = duplication.map((data) => ({ usr_id: userInfo.id, hashtag: data }))

      await userRepository.transacting(trx).setUserHashtag(userHashtag)
      const communityId = await userRepository.transacting(trx).createPersonalCommunity(userInfo.id)

      await userRepository.transacting(trx).registCommunity(userInfo.id, communityId, CONSTS.COMMUNITY_TYPE.PERSONAL, CONSTS.MEMBER_LEVEL.OWNER)
      await userRepository.transacting(trx).registMember(userInfo.id, communityId, CONSTS.MEMBER_LEVEL.OWNER)
      return {
        success: true,
        data: null
      }
    } catch (err) {
      trx && await trx.rollback()
      logger.error(err.message)
      throw err
    } finally {
      if (trx && !await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function checkQualification (userInfo, userIp) {
    logger.debug('Service checkQualification')
    try {
      const qualification = await userRepository.getUserInfo(userInfo.id, userInfo.pw)
      if (!qualification) {
        throw new Error('아이디나 비밀번호를 확인하세요')
      }
      await userRepository.updateLastSignIn(userInfo.id, userIp)
      const [loginUserInfo] = qualification.map(data => ({ ...new clientDTO.User(data) }))
      return loginUserInfo
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function updateUserInfo (userInfo) {
    logger.debug('Service updateUserInfo')
    let chkTel
    let chkEmail
    try {
      if (userInfo.tel) {
        chkTel = await userRepository.getMatchTel(userInfo.tel)
      }
      if (userInfo.email) {
        chkEmail = await userRepository.getMatchEmail(userInfo.email)
      }

      if (chkTel && chkTel.length) {
        throw new Error('이미 사용중인 휴대전화번호 입니다.')
      }
      if (chkEmail && chkEmail.length) {
        throw new Error('이미 사용중인 이메일 입니다.')
      }

      return await userRepository.updateUserInfo(userInfo)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function disableUser (userId) {
    logger.debug('Service disableUser')
    const chkType = CONSTS.COMMUNITY_TYPE
    const chkAnyOwner = await userRepository.getLastCreatedCommunity(userId, [chkType.AGENCY, chkType.COMMUNITY, chkType.PROJECT])
    if (chkAnyOwner && chkAnyOwner.length) {
      throw new Error('소유중인 커뮤니티가 있어, 플랫폼을 탈퇴할수 없습니다.')
    }
    return await userRepository.disableUser(userId)
  }
  async function setFavorite (registInfo) {
    logger.debug('Service setFavorite')
    return await userRepository.setFavorite(registInfo.userId, registInfo.communityId, registInfo.isRegist === 'true')
  }
  async function checkLimitsScribeHashtag (hashtagInfo) {
    try {
      const cntScribeHashtag = await userRepository.countScribeHashTag(hashtagInfo)

      if (cntScribeHashtag >= CONSTS.SCRIBE_HASHTAG_MAXIMUM) {
        throw new Error(`해시태그는 커뮤니티 별 최대 ${CONSTS.SCRIBE_HASHTAG_MAXIMUM}개까지 등록 가능합니다.`)
      }
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function checkScribeHashtag (hashtagInfo) {
    logger.debug('Service checkScribeHashtag')
    try {
      const [hashtag] = await userRepository.getScribeHashTag(hashtagInfo)

      if (hashtag) {
        throw new Error(`[#${hashtagInfo.hashtag}] 은(는) 이미 구독 중인 해시태그 입니다.`)
      }
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function setScribeHashtag (hashtagInfo) {
    logger.debug('Service setScribeHashtag')
    try {
      const scribeInfo = new DbDTO.Scribe(hashtagInfo)
      await checkLimitsScribeHashtag(scribeInfo)
      await checkScribeHashtag(scribeInfo)
      await userRepository.setScribeHashtag(scribeInfo)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function checkApplyQualification (applyInfo) {
    logger.debug('Service checkApplyQualification')
    // member에서 disable이면 탈퇴한거임(강퇴?재가입 방지? 블랙리스트? 여쭤보기)
    try {
      const checkResult = await userRepository.getMemberInfo(applyInfo.userId, applyInfo.communityId)

      if (checkResult.lvl === CONSTS.MEMBER_LEVEL.NON_M) {
        throw new Error('커뮤니티 가입 승인 대기 중입니다.')
      }
      if (checkResult.lvl <= CONSTS.MEMBER_LEVEL.NON_M) {
        throw new Error('이미 가입한 커뮤니티 입니다.')
      }
      if (checkResult.disable === true) {
        throw new Error('탈퇴한 커뮤니티 입니다.')
      }
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function joinCommunity (applyInfo) {
    logger.debug('Service joinCommunity')
    let trx
    try {
      await checkApplyQualification(applyInfo)
      trx = await userRepository.transaction()
      await userRepository.transacting(trx).registCommunity(applyInfo.userId, applyInfo.communityId, applyInfo.communityType, CONSTS.MEMBER_LEVEL.NON_M)
      await userRepository.transacting(trx).registMember(applyInfo.userId, applyInfo.communityId, CONSTS.MEMBER_LEVEL.NON_M)
    } catch (err) {
      trx && await trx.rollback()
      logger.error(err.message)
      throw err
    } finally {
      if (trx && !await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function deleteScribeHashtag (hashtagInfo) {
    logger.debug('Service deleteScribeHashtag')
    return await userRepository.deleteScribeHashtag(hashtagInfo.userId, hashtagInfo.communityId, hashtagInfo.hashtag)
  }
  async function resignCommunity (resignInfo) {
    logger.debug('Service resignCommunity')
    let trx
    try {
      trx = await userRepository.transaction()
      await userRepository.transacting(trx).disableMember(resignInfo.userId, resignInfo.communityId)
      await userRepository.transacting(trx).disableUserCommunity(resignInfo.userId, resignInfo.communityId)
    } catch (err) {
      await trx.rollback()
      logger.error(err.message)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  return {
    userRepository,
    checkOverlap,
    createUser,
    checkQualification,
    updateUserInfo,
    disableUser,
    setFavorite,
    checkLimitsScribeHashtag,
    setScribeHashtag,
    checkApplyQualification,
    joinCommunity,
    deleteScribeHashtag,
    resignCommunity
  }
  /*

  const setScrapCategory = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const setScribe = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const listScribe = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }

  const listFavorite = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const setScrap = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const listScrap = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const setProfile = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const setHashtag = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const listCommunity = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const listMessage = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const createMessage = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const updateMessage = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const deleteMessage = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const createMessageComment = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const updateMessageComment = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const deleteMessageComment = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  }
  const likeMessage = (userInfo) => {
    return userRepository.setScrapCategory(userInfo)
  } */
}
export default makeUserService
