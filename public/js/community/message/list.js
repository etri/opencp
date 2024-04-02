/* eslint-disable no-undef */
/* eslint-disable no-multiple-empty-lines */

$(() => {
  $('.board_category').accordion({
    header: () => {
      return $('.board_category .tit')
    },
    collapsible: true
  })



  const table = $('#message-table').DataTable({
    ajax: {
      url: '/api/communities/message',
      cache: true,
      dataSrc: 'data',
      type: 'GET',
      data: (data) => {
        data.communityId = communityId
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
          location.href = `/community/message/upsert/${communityId}`
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
  /* 연결용..(HY) */
  $.ajax({
    url: '/api/communities/message',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      console.log(result)
    }
  })
  // 커뮤니티 상단 정보 불러오는거
  $.ajax({
    url: '/api/communities/info',
    type: 'GET',
    data: { communityId: 4 },
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
})
