
// show, hide event 등록
(function ($) {
  $.each(['show', 'hide'], function (i, ev) {
    const el = $.fn[ev]
    $.fn[ev] = function () {
      this.trigger(ev)
      return el.apply(this, arguments)
    }
  })
})(jQuery)
const $ = window.jQuery

$(() => {
  // 팝업창에 카테고리 불러오기
  $.ajax({
    url: '/api/categories',
    type: 'GET',
    data: { communityId },
    success: (result) => {
      const data = result.data
      const lists = data.map(val => `<button class='${val.id}' onclick="addCategory(${val.id}, '${val.name}')">${val.name}</button>`).join('')
      $('.popup_content .category_con').html('<button>전체</button>')
      $('.popup_content .category_con').append(lists)
    }
  })
})
// 팝업 X 버튼
$('.popup_title .close_btn').on('click', function () {
  popupVisible()
})
// 팝업창 취소 버튼
$('.popup_content .btn_area .cancel_btn').on('click', function () {
  popupVisible()
})
// 팝업창 추가 버튼
$('.popup_content .btn_area .add_btn').on('click', function () {
  $('.category_area > li').remove()
  const classList = $('.category_select').find('button').toArray()
  const dataList = classList.map(data => ({ id: $(data).attr('class'), name: $(data).text() }))
  const categoryList = dataList.map(data => `<li class="${data.id}"><p>${data.name}</p><img src="/assets/delete_icon.png" alt="삭제버튼" /></li>`).join('')
  $('.category_area').prepend(categoryList)
  $('.category_area').height('auto') // css 에서 !important 하면 animate 안먹음..
  popupVisible()
})
// 팝업창 보이고 말고
function popupVisible () {
  const isVisible = $('#popup').is(':visible')
  if (isVisible) {
    $('#popup').hide()
    $('.category_con > button').removeClass('active')
    $('.category_select').html('')
  } else {
    $('#popup').show()
  }
}
function addCategory (categoryId, category) {
  if ($(`.category_con .${categoryId}`).hasClass('active')) {
    $(`.category_con .${categoryId}`).removeClass('active')
    $(`.category_select .${categoryId}`).remove()
  } else {
    $(`.category_con .${categoryId}`).addClass('active')
    $('.category_select').append(`<button class='${categoryId}' onclick='removeCategory(${categoryId})'>${category}<img src="/assets/delete_icon.png" alt="삭제" /></button>`)
  }
}
function removeCategory (categoryId) {
  $(`.category_select .${categoryId}`).remove()
  $(`.category_con .${categoryId}`).removeClass('active')
}

// ($w => {
//   function popupModule() {
//     return {
//       onPopupClose: (cb) => {
//         if (!cb) return
//         cb()
//       }
//     }
//   }
//   $w.mdt.popupModule = popupModule
// })(window)

// $w.mdt.popupModule.onPopupClose(() => {
//   updateDataTable()
// })
