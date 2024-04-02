/* eslint-disable no-undef */
/* eslint-disable no-multiple-empty-lines */


$(() => {
  $('.board_category').accordion({
    header: () => {
      return $('.board_category .tit')
    },
    collapsible: true
  })

  // const testData = [
  //   {
  //     index: 1,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 2,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 3,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 4,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 5,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 6,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 7,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 8,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 9,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 10,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 11,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 12,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 13,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 14,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 15,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 16,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 17,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 18,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 19,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 20,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 21,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   },
  //   {
  //     index: 22,
  //     title: '이것은 제목이여',
  //     writer: '작성자여',
  //     inDt: '2022-09-13',
  //     hit: 9999
  //   }
  // ]

  const table = $('#notice-table').DataTable({
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
    dom: 'rt<"btn_area"B>p',
    autoWidth: false,
    order: [0, 'desc'],
    commentCntToTag: commentCnt => {
      return `<div class="comment"><img src="/assets/comment_icon_01.png" alt="댓글"/><span>[${commentCnt}]</span></div>`
    },
    isNewToTag: isNew => {
      if (isNew) {
        return '<div class="new_message"><img src="/assets/new_message.png" alt="새글"/></div>'
      } else return ''
    },
    buttons: [
      {
        text: '글쓰기',

        action: function (e, dt, node, config) {
          location.href = `/community/private/board/upsert/${communityId}`
        },
        className: 'writing_btn'
      }
    ],
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
    pagingType: 'full_numbers',
    language: {
      paginate: {
        first: '',
        previous: '',
        next: '',
        last: ''
      }
    },
    drawCallback: function (settings) {
      const container = this.api()
        .table()
        .container()
      const paginate = $(container).find('.dataTables_paginate')
      const pageInfo = this.api().page.info()

      $('#page-info').text(pageInfo.pages)
      $('#total-info').text(pageInfo.recordsTotal)

      paginate.addClass('board_max_paging')
    }
  })

  $('#page_select').change(function (e) {
    table.page.len($(this).val()).draw()
  })
  $('.search_bar').on('click', function () {
    table.ajax.reload()
  })
  /* 연결용..(HY) */
  // $.ajax({
  //   url: '/api/privates',
  //   type: 'GET',
  //   data: { communityId, categories: [] },
  //   success: (result) => {
  //     console.log(result)
  //   }
  // })
  // 커뮤니티 상단 정보 불러오는거
  $.ajax({
    url: '/api/communities/info',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      const data = Object.values(result.data)
      const communityName = $('.home_main').find('button')
      const communityInfo = $('.home_info').find('span')
      $(communityName[0]).text(data[0])
      communityInfo.each(function (index, item) {
        $(item).text(data[index + 1])
      })
    }
  })
  // 팝업 사리지면 다시 조회
  $('#popup').on('hide', function () {
    table.ajax.reload()
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
    table.ajax.reload()
  })
})



