/* eslint-disable quotes */
/* eslint-disable no-undef */
/* test data */

/* --------- */

$(() => {
  console.log(communityId)
  $('#info-tab-list').tabs({
    active: (e, ui) => {},
    create: (e, ui) => {}
  })

  $('#directory-tree').treeview({
    animated: 'fast',
    collapsed: true,
    unique: true,
    toggle: function () {
      window.console && console.log('%o was toggled', this)
    }
  })
  $('#connect-tree').treeview({
    animated: 'fast',
    collapsed: true,
    unique: true,
    toggle: function () {
      window.console && console.log('%o was toggled', this)
    }
  })

  $('#board-tab-list').tabs({
    activate: (e, ui) => {
      const target = ui.newTab.data('target')
      initBoardTab(target)
    },
    create: (e, ui) => {
      const target = ui.tab.data('target')
      initBoardTab(target)
    }
  })

  function initBoardTab (target) {
    switch (target) {
      case 'user':
        if (!$.fn.dataTable.isDataTable('#user-table')) initUserTable()
        break
      case 'message':
        if (!$.fn.dataTable.isDataTable('#message-table')) initMessageTable()
        break
      case 'notice':
        if (!$.fn.dataTable.isDataTable('#notice-table')) initNoticeTable()
        break
    }
  }

  function initUserTable () {
    // const testData = [
    //   {
    //     index: 1,
    //     nick: '봄날',
    //     name: '이상원',
    //     tel: '010-8320-5701',
    //     email: 'happy78951@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-01-03',
    //     level: 1
    //   },
    //   {
    //     index: 2,
    //     nick: '에그',
    //     name: '박병철',
    //     tel: '010-8323-5701',
    //     email: 'parkWait@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-05-03',
    //     level: 2
    //   },
    //   {
    //     index: 3,
    //     nick: '고래',
    //     name: '우영우',
    //     tel: '010-6440-5701',
    //     email: 'rabbiot@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-04-03',
    //     level: 3
    //   },
    //   {
    //     index: 4,
    //     nick: '아이',
    //     name: '찬솔박',
    //     tel: '010-8125-5701',
    //     email: 'chansdol@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-01-03',
    //     level: 4
    //   },
    //   {
    //     index: 5,
    //     nick: '오이',
    //     name: '권정열',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 5
    //   },
    //   {
    //     index: 5,
    //     nick: '하루',
    //     name: '공유',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 4
    //   },
    //   {
    //     index: 5,
    //     nick: '가지',
    //     name: '권태양',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 3
    //   },
    //   {
    //     index: 5,
    //     nick: '오지',
    //     name: '오구',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 2
    //   },
    //   {
    //     index: 5,
    //     nick: '오공',
    //     name: '권그',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 1
    //   },
    //   {
    //     index: 5,
    //     nick: '태후',
    //     name: '권정열',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 2
    //   },
    //   {
    //     index: 5,
    //     nick: '태양',
    //     name: '권정열',
    //     tel: '010-1104-5701',
    //     email: 'sunsun@naver.com',
    //     regDate: '2022-01-03',
    //     lastLoginDt: '2022-06-03',
    //     level: 3
    //   }
    // ]
    $('#user-table').DataTable({
      ajax: {
        url: '/api/members',
        cache: true,
        dataSrc: 'data',
        type: 'GET',
        data: (data) => {
          data.communityId = communityId
        }
      },
      // data: testData,
      dom: 'rtp',
      autoWidth: false,
      order: [0, 'desc'],
      menuBtnTagStr: `<button class="menu_btn"><img src="/assets/menu_btn.png" alt="설정"></button>`,
      levelToImg: level => {
        switch (level) {
          case 0:
            return `<img src="/assets/user_class-1.png" alt="등급1">`
          case 1:
            return `<img src="/assets/user_class-2.png" alt="등급2">`
          case 20:
            return `<img src="/assets/user_class-3.png" alt="등급3">`
          case 30:
            return `<img src="/assets/user_class-4.png" alt="등급4">`
          case 40:
            return `<img src="/assets/user_class-5.png" alt="등급5">`
          default:
            return ''
        }
      },
      columns: [
        { data: 'index', sortable: false },
        {
          data: 'nick',
          sortable: false,
          className: 'user_name'
        },
        {
          data: 'level',
          sortable: false,
          render: (data, type, row) => {
            return $('#user-table')
              .dataTable()
              .api()
              .init()
              .levelToImg(data)
          }
        },
        { data: 'tel', sortable: false },
        { data: 'email', sortable: false },
        { data: 'regDate', sortable: true },
        { data: 'lastLoginDt', sortable: true },
        {
          data: null,
          sortable: false,
          render: (data, type, row) =>
            $('#user-table')
              .dataTable()
              .api()
              .init().menuBtnTagStr
        }
      ],
      language: {
        paginate: {
          previous: '',
          next: ''
        }
      },
      drawCallback: function (settings) {
        const tableNode = this.api()
          .table()
          .container()
        const paginate = $(tableNode).find('.dataTables_paginate')
        paginate.addClass('board_min_paging')
      }
    })
  }

  function initMessageTable () {
    // const testData = [
    //   {
    //     index: 1,
    //     title: '회원분들께 전달드립니다.',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 10,
    //     isNew: true
    //   },
    //   {
    //     index: 1,
    //     title: '김회원님 공지사항 관련 안내드립니다.',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 5,
    //     isNew: true
    //   },
    //   {
    //     index: 1,
    //     title: '회의 보고서 요청드립니다.',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 6,
    //     isNew: true
    //   },
    //   {
    //     index: 1,
    //     title: '새로운 오픈소스를 공유합니다.',
    //     writer: '나멤버',
    //     inDt: '2022-01-01',
    //     commentCnt: 1,
    //     isNew: false
    //   },
    //   {
    //     index: 1,
    //     title: '9/28 프로젝트 관련 회의 진행하려합니다.',
    //     writer: '구멤버',
    //     inDt: '2022-01-01',
    //     commentCnt: 15,
    //     isNew: false
    //   },
    //   {
    //     index: 1,
    //     title: '이건 제목',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 11,
    //     isNew: false
    //   },
    //   {
    //     index: 1,
    //     title: '이건 제목',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 112,
    //     isNew: false
    //   },
    //   {
    //     index: 1,
    //     title: '이건 제목',
    //     writer: '이상원',
    //     inDt: '2022-01-01',
    //     commentCnt: 1,
    //     isNew: false
    //   }
    // ]

    $('#message-table').DataTable({
      // data: testData,
      ajax: {
        url: '/api/communities/message',
        cache: true,
        dataSrc: 'data',
        type: 'GET',
        data: (data) => {
          data.communityId = communityId
        }
      },
      dom: 'rtp',
      autoWidth: false,
      order: [0, 'desc'],
      commentCntToTag: commentCnt => {
        return `<div class="comment"><img src="/assets/comment_icon_01.png" alt="댓글"/><span>[${commentCnt}]</span></div>`
      },
      isNewToTag: isNew => {
        if (isNew) {
          return `<div class="new_message"><img src="/assets/new_message.png" alt="새글"/></div>`
        } else return ''
      },
      columns: [
        { data: 'index', sortable: false },
        {
          data: 'title',
          sortable: false,
          className: 'board_title',
          render: (data, type, row) => {
            const { commentCntToTag, isNewToTag } = $('#message-table')
              .dataTable()
              .api()
              .init()
            return `<a href="/community/message/detail/${communityId}/${row.index}/${row.id}">${data}</a>${commentCntToTag(
              row.commentCnt
            )}${isNewToTag(row.isNew)}`
          }
        },
        { data: 'writer', sortable: false },
        { data: 'inDt', sortable: true }
      ],
      language: {
        paginate: {
          previous: '',
          next: ''
        }
      },
      drawCallback: function (settings) {
        const tableNode = this.api()
          .table()
          .container()
        const paginate = $(tableNode).find('.dataTables_paginate')
        paginate.addClass('board_min_paging')
      }
    })
  }

  function initNoticeTable () {
    // const testData = [
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   },
    //   {
    //     index: 1,
    //     title: '이것은 제목이여',
    //     writer: '작성자여',
    //     inDt: '2022-09-13',
    //     hit: 9999
    //   }
    // ]

    $('#notice-table').DataTable({
      // data: testData,
      ajax: {
        url: '/api/privates',
        cache: true,
        dataSrc: 'data',
        type: 'GET',
        data: (data) => {
          const filterList = $('.category_area').find('li').toArray()
          const dataList = filterList.map(data => ($(data).attr('class')))
          data.communityId = communityId
          data.category = dataList
        }
      },
      dom: 'rtp',
      autoWidth: false,
      order: [0, 'desc'],
      commentCntToTag: commentCnt => {
        return `<div class="comment"><img src="/assets/comment_icon_01.png" alt="댓글"/><span>[${commentCnt}]</span></div>`
      },
      isNewToTag: isNew => {
        if (isNew) {
          return `<div class="new_message"><img src="/assets/new_message.png" alt="새글"/></div>`
        } else return ''
      },
      columns: [
        { data: 'index', sortable: false },
        {
          data: 'title',
          sortable: false,
          className: 'board_title',
          render: (data, type, row) => {
            const { commentCntToTag, isNewToTag } = $('#notice-table')
              .dataTable()
              .api()
              .init()
            let categoryList = ''
            if (row.categories.length > 1) {
              categoryList = `[${row.categories[0]}][${row.categories[1]}] `
            }
            if (row.categories.length === 1) {
              categoryList = `[${row.categories[0]}] `
            }
            return `<a href="/community/private/board/detail/${communityId}/${row.index}/${row.id}">${categoryList}${data}</a>${commentCntToTag(
              row.commentCnt
            )}${isNewToTag(row.isNew)}`
          }
        },
        { data: 'writer', sortable: false },
        { data: 'inDt', sortable: true },
        { data: 'views', sortable: false }
      ],
      language: {
        paginate: {
          previous: '',
          next: ''
        }
      },
      drawCallback: function (settings) {
        const tableNode = this.api()
          .table()
          .container()
        const paginate = $(tableNode).find('.dataTables_paginate')
        paginate.addClass('board_min_paging')
      }
    })
  }
  /* 연결용..(HY) */
  // 커뮤니티 상단 정보 불러오는거
  $.ajax({
    url: '/api/communities/info',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      const data = Object.values(result.data)
      const communityName = $('.home_main').find('button')
      const communityInfo = $('.home_info').find('span')
      const memberCnt = $('.board_name').find('p')
      $(memberCnt[0]).text(`(${data[data.length - 1]})`)
      $(communityName[0]).text(data[0])
      communityInfo.each(function (index, item) {
        $(item).text(data[index + 1])
      })
    }
  })
  // 위키 불러오는거
  $.ajax({
    url: '/api/privates/wiki',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      const privateWiki = result.data.privateWiki
      $('#wiki-tab').text(privateWiki)
    }
  })
  // 연결 트리
  $.ajax({
    url: '/api/children',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      $("#connect-tree").fancytree({
        checkbox: false,
        source: result.data,
        icon: (e, data) => {
          if (data.node.data.childType === 3) {
            return 'fancytree-icon-project'
          } else {
            return 'fancytree-icon-community'
          }
        }
      })
    }
  })
})
// const privateBoard = $('#notice-table').DataTable()
// 팝업 사리지면 다시 조회
$('#popup').on('hide', function () {
  // privateBoard.ajax.reload()
  $('#notice-table').DataTable().ajax.reload()
})
// 프라이빗 게시판 카테고리 add 버튼
$('.category_area .add_btn').on('click', function () {
  const filterList = $('.category_area').find('li').toArray()
  const dataList = filterList.map(data => ({ id: $(data).attr('class'), name: $(data).text() }))

  dataList.map(data => addCategory(data.id, data.name))
  popupVisible()
})
// 프라이빗 게시판 카테고리 x 버튼
$('.category_area').on('click', 'li', function (e) {
  const categoryId = $(e.currentTarget).attr('class')
  $(`.category_area .${categoryId}`).remove()
  removeCategory(categoryId)
  $('#notice-table').DataTable().ajax.reload()
})
