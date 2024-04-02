import logger from '../../utils/logger.js'
import * as CONSTS from '../../consts.js'
import { ROOT_FOLDER } from '../../config.js'
import fileManage from '../files/index.js'
import * as clientDTO from '../../models/client/community.js'
import * as DbDTO from '../../models/DB/community.js'

const TEST_USER = 'testUser1'
// import * as cheerio from 'cheerio'
function makeCommunityService (repository) {
  const communityRepository = repository.communityRepository
  const userRepository = repository.userRepository
  const commonRepository = repository.commonRepository
  async function createCommunity (communityInfo) {
    logger.debug('Service createCommunity')
    let trx
    let communityId
    try {
      trx = await userRepository.transaction()
      communityId = await communityRepository.transacting(trx).createCommunity(communityInfo)
      fileManage.isNotExistsMkDirAsync(ROOT_FOLDER + '/community/' + communityId)
      await userRepository.transacting(trx).registMember(communityInfo.userId, communityId, CONSTS.MEMBER_LEVEL.OWNER)
      await userRepository.transacting(trx).registCommunity(communityInfo.userId, communityId, communityInfo.type, CONSTS.MEMBER_LEVEL.OWNER)
      await communityRepository.transacting(trx).registRelationship(communityId, communityInfo.parentId, communityInfo.type, communityInfo.parentType)
    } catch (err) {
      await trx.rollback()
      logger.error(err.message)
      fileManage.rmDirAsync(ROOT_FOLDER + '/community/' + communityId)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function listApplies (memberInfo) {
    logger.debug('Service listApplies')
    return await communityRepository.getApplies(memberInfo.communityId)
  }

  async function changeLevel (method, url, changeInfo) {
    logger.debug('Service changeLevel')
    let trx
    try {
      trx = await communityRepository.transaction()
      await communityRepository.transacting(trx).changeMemberLevel(changeInfo.communityId, changeInfo.memberId, changeInfo.memberLevel)
      await communityRepository.transacting(trx).changeUserCommunityLevel(changeInfo.communityId, changeInfo.memberId, changeInfo.memberLevel)
      await commonRepository.transacting(trx).logging(method, url, JSON.stringify(changeInfo), changeInfo.userId)
    } catch (err) {
      await trx.rollback()
      logger.error(err.message)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function approval (method, url, approvalInfo) {
    logger.debug('Service approval')
    try {
      approvalInfo.memberLevel = CONSTS.MEMBER_LEVEL.PBLC_4
      await changeLevel(method, url, approvalInfo)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function listCommunities (communityType) {
    logger.debug('Service listCommunities')
    try {
      return await communityRepository.getCommunityLists(communityType)
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function getChildren (communityId) {
    logger.debug('Service getChildren')

    try {
      const lists = await communityRepository.getChildren(communityId)
      let node
      const treeData = []
      const parentsIndex = []
      for (let i = 0; i < lists.length; i++) {
        parentsIndex[lists[i].key] = i
        lists[i].children = []
      }
      for (let i = 0; i < lists.length; i++) {
        node = lists[i]
        if (node.lvl !== 0) {
          lists[parentsIndex[node.prnt]].children.push(node)
        } else {
          treeData.push(node)
        }
      }
      return treeData
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function createNewMessage (userId, communityId) {
    if (!userId) userId = TEST_USER
    logger.debug('Service createNewMessage')
    let trx
    let messageId
    try {
      trx = await communityRepository.transaction()
      messageId = await communityRepository.transacting(trx).getMessageSeq(communityId)
      await communityRepository.transacting(trx).createMessage(userId, communityId, messageId)
      await fileManage.isNotExistsMkDirAsync(ROOT_FOLDER + '/community/' + communityId + '/messages/' + messageId)
      return messageId
    } catch (err) {
      logger.error(err.message)
      await trx.rollback()
      await fileManage.rmDirAsync(ROOT_FOLDER + '/community/' + communityId + '/messages/' + messageId)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function modifyMessage (userId, messageInfo) {
    if (!userId) userId = TEST_USER
    logger.debug('Service createNewMessage')
    let trx
    try {
      messageInfo = { ...messageInfo, userId }
      const messagContent = new DbDTO.CommunityMessage(messageInfo)
      const setCategory = messageInfo.category.map((data, idx) => ({ seq: idx + 1, msg_id: messageInfo.messageId, cm_id: messageInfo.communityId, ctg_id: data }))
      const setHashtag = messageInfo.hashtag.map((data) => ({ msg_id: messageInfo.messageId, cm_id: messageInfo.communityId, hashtag: data }))

      await fileManage.isNotExistsMkDirAsync(ROOT_FOLDER + '/community/' + messageInfo.communityId + '/messages/' + messageInfo.messageId)
      trx = await communityRepository.transaction()
      await communityRepository.transacting(trx).modifyMessage(messagContent)
      await communityRepository.transacting(trx).deleteMessageCategory(messagContent)
      await communityRepository.transacting(trx).setMessageCategory(setCategory)
      await communityRepository.transacting(trx).deleteMessageHashtag(messagContent)
      await communityRepository.transacting(trx).setMessageHashtag(setHashtag)
    } catch (err) {
      logger.error(err.message)
      await trx.rollback()
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function getMessageList (userId, messageInfo) {
    logger.debug('Service getMessageList')
    try {
      const listData = await communityRepository.listMessage(userId, messageInfo.communityId, messageInfo.start, messageInfo.length)
      console.log(listData)
      const lists = listData.map(data => new clientDTO.CommunityMessage(data))
      return lists
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  async function chkCategoryCount (communityId) {
    logger.debug('Service chkCategoryCount')
    try {
      const count = await communityRepository.getCategoryCount(communityId)

      if (count >= CONSTS.BOARD_CATEGORY_MAXIMUM) {
        throw new Error('커뮤니티 카테고리는 최대 8개까지 등록 가능합니다.')
      }
      return true
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function registCategory (categoryInfo) {
    logger.debug('Service registCategory')
    let trx
    try {
      trx = await communityRepository.transaction()
      await chkCategoryCount(categoryInfo.communityId)
      const categoryId = await communityRepository.transacting(trx).getBoardCategoryId(categoryInfo.communityId)
      await communityRepository.transacting(trx).registCategory(categoryInfo.communityId, categoryId, categoryInfo.category)
    } catch (err) {
      logger.error(err.message)
      await trx.rollback()
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function listPrivates (userId, privateInfo) {
    logger.debug('Service listPrivates')
    try {
      // const userLevel = await communityRepository.getMemberLevel(userId, privateInfo.communityId)
      // const search = new DbDTO.PrivatesLists(...privateInfo, userId, userLevel)
      // console.log(search)
      const listData = await communityRepository.listPrivates(userId, privateInfo.communityId, privateInfo.start, privateInfo.length, privateInfo.category)
      const privateIds = listData.map(data => data.id)
      const privateLists = listData.map(data => ({ ...new clientDTO.PrivateLists(data), categories: [] }))
      const categories = await communityRepository.getPrivateCategories(privateInfo.communityId, privateIds)

      for (let i = 0; i < categories.length; i++) {
        const listIndex = privateIds.indexOf(categories[i].prv_id, 0)
        privateLists[listIndex].categories.push(categories[i].name)
      }
      return privateLists
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function postNewPrivate (userId, privateInfo) {
    logger.debug('Service postNew')
    let trx
    let privateId
    try {
      trx = await communityRepository.transaction()
      privateId = await communityRepository.transacting(trx).getPrivateSeq(privateInfo.communityId)
      await communityRepository.transacting(trx).createPrivates(userId, privateInfo.communityId, privateId)
      fileManage.isNotExistsMkDirAsync(ROOT_FOLDER + '/community/' + privateInfo.communityId + '/privates/' + privateId)
      return privateId
    } catch (err) {
      logger.error(err.message)
      await trx.rollback()
      fileManage.rmDirAsync(ROOT_FOLDER + '/community/' + privateInfo.communityId + '/privates/' + privateId)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function modifyPrivate (privateInfo) {
    logger.debug('Service modifyPrivate')
    let trx
    try {
      const setContents = new DbDTO.Privates(privateInfo)
      trx = await communityRepository.transaction()
      await fileManage.isNotExistsMkDirAsync(ROOT_FOLDER + '/community/' + privateInfo.communityId + '/privates/' + privateInfo.privateId)
      await communityRepository.transacting(trx).modifyPrivate(setContents)
      if (privateInfo.category) {
        const setCategory = privateInfo.category.map((data, idx) => ({ seq: idx + 1, prv_id: privateInfo.privateId, cm_id: privateInfo.communityId, ctg_id: data }))
        await communityRepository.transacting(trx).deletePrivateCategory(setContents)
        await communityRepository.transacting(trx).setPrivateCategory(setCategory)
      }
      if (privateInfo.hashtag) {
        const setHashtag = privateInfo.hashtag.map((data) => ({ prv_id: privateInfo.privateId, cm_id: privateInfo.communityId, hashtag: data }))
        await communityRepository.transacting(trx).deletePrivateHashtag(setContents)
        await communityRepository.transacting(trx).setPrivateHashtag(setHashtag)
      }
    } catch (err) {
      logger.error(err.message)
      await trx.rollback()
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function uploadPrivateFiles (fileInfo) {
    logger.debug('Service uploadFiles')
    let trx
    try {
      trx = await communityRepository.transaction()
      const uploadInfo = new DbDTO.PrivateAttach(fileInfo)
      const attachId = await communityRepository.transacting(trx).getPrivateAttachSeq(uploadInfo)
      uploadInfo.id = attachId

      await communityRepository.transacting(trx).uploadPrivateFiles(uploadInfo)
    } catch (err) {
      await trx.rollback()
      logger.error(err.message)
      throw err
    } finally {
      if (!await trx.isCompleted()) { await trx.commit() }
    }
  }
  async function getPrivateDetails (privateInfo) {
    logger.debug('Service getPrivateDetails')

    try {
      const detailInfo = new DbDTO.Privates(privateInfo)
      await communityRepository.setPrivateViews(detailInfo)
      const contents = await communityRepository.getPrivateDetails(detailInfo)
      const titles = await communityRepository.getPrivateOrderlyTitles(contents)
      // const moveTitles = titles.map(({ type, title }) => Object.fromEntries([[type, title]]))
      const moveTitles = {}
      titles.forEach((e) => { moveTitles[e.type] = { title: e.title, inDt: e.in_dt, id: e.id } })
      const files = await communityRepository.getPrivateFiles(detailInfo)
      const categories = await communityRepository.getPrivateCategories(detailInfo.cm_id, [detailInfo.id])
      const hashtags = await communityRepository.getPrivateHashtags(detailInfo)

      const details = new clientDTO.PrivateDetails(contents)
      details.files = files.map(data => ({ ...new clientDTO.BoardFiles(data) }))
      details.categories = categories.map(data => data.name)
      details.hashtags = hashtags.map(data => data.hashtag)
      details.titles = moveTitles
      return details
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function getMessageDetails (messageInfo) {
    logger.debug('Service getMessageDetails')

    try {
      const detailInfo = new DbDTO.Messages(messageInfo)
      await communityRepository.setMessageViews(detailInfo)
      const contents = await communityRepository.getMessageDetails(detailInfo)
      const titles = await communityRepository.getMessageOrderlyTitles(contents)
      const moveTitles = {}
      titles.forEach((e) => { moveTitles[e.type] = { title: e.title, inDt: e.in_dt, id: e.id } })
      const files = await communityRepository.getMessageFiles(detailInfo)

      const details = new clientDTO.MessageDetails(contents)
      details.files = files.map(data => ({ ...new clientDTO.BoardFiles(data) }))
      details.titles = moveTitles
      return details
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  async function getMembersInfo (communityInfo) {
    logger.debug('Service getMembersInfo')

    try {
      const mebersData = await communityRepository.getMembersInfo(communityInfo.communityId)
      const memberList = mebersData.map(data => ({ ...new clientDTO.MemberLists(data) }))

      return memberList
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function getPrivateWiki (communityInfo) {
    logger.debug('Service getPrivateWiki')

    try {
      const [wikiData] = await communityRepository.getPrivateWiki(communityInfo.communityId)

      const wiki = new clientDTO.PrivateWiki(wikiData)

      return wiki
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function getCommunityInfo (communityInfo, userId) {
    logger.debug('Service getCommunityInfo')

    try {
      const [communityData] = await communityRepository.getCommunityInfo(communityInfo.communityId, userId)

      const communityMainInfo = new clientDTO.CommunityInfo(communityData)
      return communityMainInfo
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }
  async function listCategories (communityInfo, userId) {
    logger.debug('Service getCommunityInfo')

    try {
      const categories = await communityRepository.getCategories(communityInfo.communityId)
      return categories
    } catch (err) {
      logger.error(err.message)
      throw err
    }
  }

  return {
    repository,
    createCommunity,
    listApplies,
    changeLevel,
    approval,
    listCommunities,
    getChildren,
    createNewMessage,
    getMessageList,
    chkCategoryCount,
    registCategory,
    listPrivates,
    postNewPrivate,
    modifyPrivate,
    uploadPrivateFiles,
    getPrivateDetails,
    getMembersInfo,
    getPrivateWiki,
    getCommunityInfo,
    listCategories,
    modifyMessage,
    getMessageDetails
  }
  // async function writePrivate (privateInfo) {
  //   logger.debug('Service writePrivate')
  //   let trx
  //   try {
  //     trx = await communityRepository.transaction()
  // const privateId = await communityRepository.transacting(trx).getPrivateSeq(privateInfo.communityId)

  // await mkdirp(ROOT_FOLDER + '/community/' + privateInfo.communityId + '/privates/' + privateId)
  // const $ = cheerio.load(privateInfo.content)

  // $('img').each(function (idx, element) {
  //   const oldpath = element.attribs.src.replace(/\n/g, '')
  //   const newpath = '/community/' + privateInfo.communityId + '/privates/' + privateId + '/' + element.attribs['data-id']
  //   fs.renameSync(ROOT_FOLDER + oldpath, ROOT_FOLDER + newpath, (err) => {
  //     logger.error(err)
  //   })
  //   $(this).attr('src', newpath)
  // })
  //     await communityRepository.transacting(trx).writePrivate(privateInfo.userId, privateInfo.communityId, privateId, privateInfo.title, $.html(), privateInfo.level)
  //     const setCategory = []
  //     for (let i = 0; i < privateInfo.category.length; i++) {
  //       setCategory[i] = {
  //         seq: i + 1,
  //         prv_id: privateId,
  //         cm_id: privateInfo.communityId,
  //         ctg_id: privateInfo.category[i]
  //       }
  //     }
  //     await communityRepository.transacting(trx).setPrivateCategory(setCategory)
  //     return {
  //       result: true,
  //       msg: 'OK'
  //     }
  //   } catch (err) {
  //     logger.error(err.message)
  //     await trx.rollback()
  //     return {
  //       result: false,
  //       msg: err.message
  //     }
  //   } finally {
  //     if (!await trx.isCompleted()) { await trx.commit() }
  //   }
  // }
  // const listCommunities = () => {
  //   return communityRepository.listCommunities()
  // }
  // const listCommunityFolder = () => {
  //   return communityRepository.listCommunityFolder()
  // }
  // const listCommunityFile = () => {
  //   return communityRepository.listCommunityFile()
  // }
  // const listMembers = () => {
  //   return communityRepository.listMembers()
  // }
  // const listFolders = () => {
  //   return communityRepository.listFolders()
  // }
  // const listFiles = () => {
  //   return communityRepository.listFiles()
  // }
  // const listExtends = () => {
  //   return communityRepository.listExtends()
  // }
  // const setBoardCategory = () => {
  //   return communityRepository.setBoardCategory()
  // }
  // const setPblcWiki = () => {
  //   return communityRepository.setPblcWiki()
  // }
  // const setPrvtWiki = () => {
  //   return communityRepository.setPrvtWiki()
  // }
}
export default makeCommunityService
