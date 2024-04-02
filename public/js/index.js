/* eslint-disable spaced-comment */
/* eslint-disable no-undef */
/* eslint-disable array-callback-return */
$(() => {
  const $recommendTabList = $('#recommend-tab-list')

  // 트리거메뉴
  $('.menu-trigger').on('click', function () {
    $(this).toggleClass('active')
    $('.trigger_menu').toggleClass('active2')
    $('.trigger_menu_back').toggleClass('active3')
    return false
  })

  //트리거메뉴 슬라이드 토글 효과
  $('.trigger_gnb > li > a').click(function () {
    $(this)
      .next()
      .slideToggle(300)

    $('.trigger_gnb > li > a')
      .not(this)
      .next()
      .slideUp(300)
    return false
  })

  $('.trigger_gnb > li > a')
    .eq(0)
    .trigger('click')

  // 슬릭슬라이드
  $('.slide_group').slick({
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    pauseOnHover: false,
    dots: true,
    cssEase: 'linear',
    autoplaySpeed: 5000,
    infinite: true,
    dotsClass: 'slick-dots'
  })
  //  슬릭도트 효과
  $('.slick-dots')
    .find('button')
    .toArray()
    .map(button => {
      $(button).text('')
    })

  $('#recommend-table').dataTable({
    dom: 'tp',
    // serverSide: true,
    // processing: true,
    ajax: {
      url: '/api/recommend/list',
      cache: true,
      data: d => {
        d.communityType = $recommendTabList.find('.active').attr('data-type')
      },
      dataSrc: json => {
        return json.data
      }
    },
    sortable: false,
    autoWidth: false,
    pageLength: 12,
    itemTag:
      '<a href="#"><div class="txt"><h4></h4><p></p></div><div class="info"><div class="manager"><p></p></div><div class="member"><p></p></div></div></a>',
    columns: [
      { data: 'name' },
      { data: 'memberCnt' },
      { data: 'communityType' },
      { data: 'nick' },
      { data: 'wiki' }
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
    createdRow: function (row, data, dataIndex) {
      const itemNode = $(this.api().init().itemTag)

      console.log(data.communityType)

      if (data.communityType === 3) {
        itemNode.addClass('project_con')
      } else if (data.communityType === 1) {
        itemNode.addClass('community_con')
      }

      const itemTextNode = $(itemNode).find('.txt')
      itemTextNode.find('h4').text(data.name)
      itemTextNode.find('p').text(data.wiki)

      $(itemNode)
        .find('.manager p')
        .text(data.nick)
      $(itemNode)
        .find('.member p')
        .text(data.memberCnt)

      $(row).html(itemNode)
    },
    drawCallback: function (settings) {
      const tableNode = this.api()
        .table()
        .container()
      const paginate = $(tableNode).find('.dataTables_paginate')
      paginate.attr('id', 'paging_area')
    }
  })
})
