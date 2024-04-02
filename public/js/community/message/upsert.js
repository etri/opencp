/* eslint-disable no-dupe-keys */
/* eslint-disable space-infix-ops */
/* eslint-disable quotes */
/* eslint-disable operator-linebreak */
/* eslint-disable no-undef */
let messageId = 0
$(() => {
  const $submitBtn = $('.board_con .add_btn')

  const editor = new Editor('#summernote').init()
  const hashtag = new Hashtag('#hashtag').init()
  const levelRating = new LevelRating('#level-rating').init()
  const boardConfig = new BoardConfig('#board-setting').init()

  function Editor (tagId) {
    const that = this

    that.tagId = tagId
    that.uploadFileList = []
    that.$uploadInput = $('#upload-file-input')
    that.$editor = null
    that.$titleInput = $('#input-title')

    that.init = () => {
      $(that.tagId).summernote({
        lang: 'ko-KR',
        minHeight: '400px',
        disableResizeEditor: true,
        toolbar: [
          ['style', ['style']],
          ['font', ['bold', 'underline', 'clear']],
          ['fontname', ['fontname']],
          ['color', ['color']],
          ['para', ['ul', 'ol', 'paragraph']],
          ['table', ['table']],
          ['insert', ['link', 'picture', 'video', 'file']],
          ['view', ['help']]
        ],
        callbacks: {
          onInit: function () {
            that.$editor = $('.note-editor')
          },
          onImageUpload: function (files) {
            const formData = new FormData()

            formData.append('imagefile', ...files)
            formData.append('communityId', communityId)
            formData.append('messageId', messageId)
            $.ajax({
              type: 'POST',
              url: '/api/communities/message/images',
              data: formData,
              processData: false,
              contentType: false,
              success: res => {
                console.log(res)
                const { path, filename } = res.data
                $(tagId).summernote('insertImage', path, $image => {
                  $image.attr('data-id', filename)
                })
              },
              err: e => {
                alert('이미지 가져오기를 실패하였습니다.')
              }
            })
          }
        },
        buttons: {
          file: that.myUploadBtn
        }
      })

      that.$uploadInput.on('change', function (e) {
        that.uploadFileList.push(...e.target.files)
        for (const file of e.target.files) {
          const $file = $(that.getFileTag(file))
          $file.find('.file_delete').on('click', function (e) {
            const targetIndex = that.uploadFileList.indexOf(file)
            if (targetIndex !== -1) {
              that.uploadFileList.splice(targetIndex, 1)
            }
            $($file).remove()
          })
          that.$editor.after($file)
        }
      })
      return that
    }
    that.getFileTag = file => {
      const tag =
        `<div class="writing_file">` +
        `<a href="${URL.createObjectURL(file)}" download="${file.name}">` +
        `<img src="/assets/file_icon_01.png" alt="첨부파일">` +
        `${file.name} ( ${sizeToBytes(file.size || 0)} )` +
        `</a>` +
        `<button class="file_delete" title="파일삭제">` +
        `<img src="/assets/file_delete_icon.png" alt="첨부파일삭제">` +
        `</button>` +
        `</div>`
      return tag
    }
    that.myUploadBtn = context => {
      const ui = $.summernote.ui

      const uploadButton = ui.button({
        contents:
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="14px" height="16px"><path d="M288 109.3V352c0 17.7-14.3 32-32 32s-32-14.3-32-32V109.3l-73.4 73.4c-12.5 12.5-32.8 12.5-45.3 0s-12.5-32.8 0-45.3l128-128c12.5-12.5 32.8-12.5 45.3 0l128 128c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L288 109.3zM64 352H192c0 35.3 28.7 64 64 64s64-28.7 64-64H448c35.3 0 64 28.7 64 64v32c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V416c0-35.3 28.7-64 64-64zM432 456c13.3 0 24-10.7 24-24s-10.7-24-24-24s-24 10.7-24 24s10.7 24 24 24z"/></svg>',
        tooltip: '파일 업로드',
        container: $('.note-editor.note-frame'),
        click: function () {
          that.$uploadInput.trigger('click')
        }
      })

      return uploadButton.render()
    }

    that.getTitle = () => {
      return $.trim(that.$titleInput.val())
    }

    that.getContent = () => {
      return $(that.tagId).summernote('code')
    }
  }

  function Hashtag (tagId) {
    const that = this

    that.MAX_HASHTAG_COUNT = 10
    that.$hashInput = $(tagId).find('#input-hashtag')
    that.$hideHashtag = $(tagId).find('#hide-hashtag')
    that.$recommendHashtag = $(tagId).find('#recommend-hashtag')
    that.$hashtagList = $(tagId).find('#hashtag-list')

    that.init = () => {
      that.$hashInput
        .one('focus', function (e) {
          $(this)
            .parent('.hashtag_input_box')
            .addClass('active')
          that.$hideHashtag.text(`${$(this).val()}`)
          $(this).width(that.$hideHashtag.width())
        })
        .on('focus', function (e) {
          $(this)
            .parent('.hashtag_input_box')
            .addClass('focus')
        })
        .on('focusout', function (e) {
          $(this)
            .parent('.hashtag_input_box')
            .removeClass('focus')
          $(this).val('')
          that.$hideHashtag.text(`${$(this).val()}`)
          $(this).width(that.$hideHashtag.width())
        })
        .on('keypress', function (e) {
          switch (e.code) {
            case 'Enter':
              if ($(this).val().length === 0) return
              that.add($(this).val())
              break
            case 'Space':
              e.preventDefault()
              break
          }
        })
        .on('keydown', function (e) {
          if (e.code === 'Backspace' && $(this).val().length === 0) {
            const hashtag = $('#hashtag-list .selected-hashtag')
              .last()
              .data('hashtag')
            that.remove(hashtag)
          }
        })
        .on('keyup', function (e) {
          that.$hideHashtag.text($(this).val())
          $(this).width(that.$hideHashtag.width())
        })

      that.$recommendHashtag.accordion({
        header: accordionElement => {
          return accordionElement.find('.tit')
        },
        collapsible: true
      })

      that.$hashtagList.on('click', '.selected-hashtag', function (e) {
        const targetHashtag = $(this).data('hashtag')
        that.remove(targetHashtag)
      })

      that.$recommendHashtag
        .find('.hastag_con button')
        .on('click', function (e) {
          that.$hashInput.trigger('focus')
          const targetHashtag = $(this).data('hashtag')
          if ($(this).hasClass('active')) {
            that.remove(targetHashtag)
          } else {
            that.add(targetHashtag)
          }
        })

      return that
    }

    that.add = hashtag => {
      const hashtagCount = that.$hashtagList.find('.selected-hashtag').length
      if (hashtagCount >= that.MAX_HASHTAG_COUNT) {
        return
      }
      that.$hashInput
        .parent('.hashtag_input_box')
        .before(
          `<div class="selected-hashtag" data-hashtag="${hashtag}"></div>`
        )
      that.$recommendHashtag
        .find(`button[data-hashtag="${hashtag}"]`)
        .addClass('active')

      that.$hashInput.val('')
      that.$hideHashtag.text(`${that.$hashInput.val()}`)
      that.$hashInput.width(that.$hideHashtag.width())
    }

    that.remove = hashtag => {
      $('#hashtag-list')
        .find(`.selected-hashtag[data-hashtag="${hashtag}"]`)
        .remove()
      that.$recommendHashtag
        .find(`button[data-hashtag="${hashtag}"]`)
        .removeClass('active')
    }

    that.getRecommendList = () => {}

    that.getList = () => {
      return $.map(that.$hashtagList.find('.selected-hashtag'), tag =>
        $(tag).data('hashtag')
      )
    }
  }

  function LevelRating (tagId) {
    const that = this

    that.tagId = tagId
    that.$levelList = $(tagId).find('li.rating')
    that.$currentLevel = $('#current-level')

    that.init = () => {
      that.$levelList.on('click', function () {
        that.$levelList.removeClass('selected')
        $(this).addClass('selected')
        that.$currentLevel.attr('data-level', $(this).data('level'))
      })

      return that
    }

    that.getLevel = () => {
      return that.$levelList.siblings('.selected').data('level')
    }
  }

  function BoardConfig (tagId) {
    const that = this

    that.tagId = tagId
    that.$topFixConfig = $(tagId).find('#top-fix-config')
    that.$commentInvisibleConfig = $(tagId).find('#comment-invisible-config')
    that.$commentDisableConfig = $(tagId).find('#comment-disable-config')
    that.$buttonList = $(tagId).find('.board_setting .setting_botton button')

    that.init = () => {
      that.$buttonList.on('click', function (e) {
        $(this)
          .addClass('active')
          .siblings('button')
          .removeClass('active')
      })

      return that
    }

    that.getIsTopFix = () => {
      return that.$topFixConfig.find('button.active').data('boolean')
    }

    that.getIsCommentInvisible = () => {
      return that.$commentInvisibleConfig.find('button.active').data('boolean')
    }

    that.getIsCommentDisable = () => {
      return that.$commentDisableConfig.find('button.active').data('boolean')
    }
  }

  $submitBtn.on('click', function (e) {
    console.log('here')
    const filterList = $('.category_area').find('li').toArray()
    const categoryList = filterList.map(data => $(data).attr('class'))
    const result = {
      title: editor.getTitle(),
      content: editor.getContent(),
      hashtag: hashtag.getList(),
      level: levelRating.getLevel(),
      topFix: boardConfig.getIsTopFix(),
      commentDisable: boardConfig.getIsCommentDisable(),
      commentInvisible: boardConfig.getIsCommentInvisible(),
      communityId,
      messageId,
      status: 1,
      category: categoryList
    }
    console.log(result)
    // 등록
    $.ajax({
      url: '/api/communities/message',
      type: 'POST',
      data: result,
      success: (result) => {
        Swal.fire({
          text: '등록되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          didClose: () => {
            location.href = `/community/message/list/${communityId}`
          }
        })
      }
    })
  })
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
  // 게시글 id 생성
  $.ajax({
    url: '/api/communities/message/new',
    type: 'POST',
    data: { communityId },
    success: (result) => {
      messageId = result.data
    }
  })
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
})
