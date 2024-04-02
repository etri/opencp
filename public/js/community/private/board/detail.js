/* eslint-disable no-dupe-keys */
/* eslint-disable space-infix-ops */
/* eslint-disable quotes */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */

$(() => {
  console.log(privateId)
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
      $(communityName[0]).text(data[0])
      communityInfo.each(function (index, item) {
        $(item).text(data[index + 1])
      })
    }
  })
  $.ajax({
    url: '/api/privates/details',
    type: 'GET',
    data: { communityId, privateId },
    success: (result) => {
      const data = result.data
      console.log(data)
      let categoryList = ''
      if (data.categories.length > 1) {
        categoryList = `[${data.categories[0]}][${data.categories[1]}] `
      }
      if (data.categories.length === 1) {
        categoryList = `[${data.categories[0]}] `
      }
      $('.txt h3').text(`${categoryList}${data.title}`)
      $('.view_text').html(data.content)
      $('.view_hastag ul').html('')
      if (data.hashtags) {
        data.hashtags.map((data) => ($('.view_hastag ul').append(`<li><button>#${data}</button></li>`)))
      }
      $('.view_info .writer span').text(data.nick)
      $('.date span').text(data.inDt)
      $('.views span span').text(data.views)
      $('.comment span span').text(data.commentCount)
      $('.like span span').text(data.likes)

      if (data.titles.next) {
        $('.next').css('display', '')
        $('.next .post_number').text(Number(index)+1)
        $('.next .post_title').html(`<a href="/community/private/board/detail/${communityId}/${Number(index)+1}/${data.titles.next.id}">${data.titles.next.title}</a>`)
        $('.next .post_date').text(data.titles.next.inDt)
      } else {
        $('.next').css('display', 'none')
      }
      if (data.titles.prev) {
        $('.prev').css('display', '')
        $('.prev .post_number').text(Number(index)-1)
        $('.prev .post_title').html(`<a href="/community/private/board/detail/${communityId}/${Number(index)-1}/${data.titles.prev.id}">${data.titles.prev.title}</a>`)
        $('.prev .post_date').text(data.titles.prev.inDt)
      } else {
        $('.prev').css('display', 'none')
      }
    }
  })
  $('.list_btn').on('click', function () {
    document.location.href = `/community/private/board/list/${communityId}`
  })
})
