/* eslint-disable no-useless-escape */
/* eslint-disable n/handle-callback-err */
/* eslint-disable no-useless-return */

// import { Swal } from './lib/sweetalert2.min'

/* eslint-disable no-undef */
$(() => {
  const userService = UserService()

  const $joinForm = $('#join-form')
  const $submitBtn = $('#submit-btn')
  const $cancelBtn = $('.btn_area #cancel-btn')
  const $duplicateCheckBtn = $('#duplicate-check-btn')

  const $inputList = $('#join-form').find('input')

  const $inputId = $('#input-id')
  const $inputTel = $('#input-tel')

  $cancelBtn.on('click', function (e) {
    history.back()
  })

  $duplicateCheckBtn.on('click', async function () {
    const that = this

    $(that).attr('disabled', true)

    if (!$inputId.valid()) {
      $(that).attr('disabled', false)
      return
    }

    try {
      const { success } = await userService.duplicateCheck({
        id: $inputId.val()
      })

      if (success) {
        $(that).addClass('complete')
        $inputId.attr('disabled', true)

        Swal.fire({
          text: '중복확인 성공하였습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          timer: 3000,
          didClose: () => {
            for (input of $inputList) {
              if ($(input).val().length === 0) {
                $(input).focus()
                break
              }
            }
          }
        })
      } else {
        $(that).removeClass('complete')
        $(that).attr('disabled', false)
        $inputId.attr('disabled', false)

        Swal.fire({
          text: '중복된 아이디가 존재합니다.',
          icon: 'warning',
          confirmButtonText: '확인'
        })
      }
    } catch (e) {
      Swal.fire({
        content: '에러가 발생하였습니다. 관리자에게 문의해주시길 바랍니다.',
        icon: 'error',
        confirmButtonText: '확인'
      })
      $(that).attr('disabled', false)
    }
  })

  $joinForm.find('input').on('paste', function (e) {
    e.preventDefault()
  })

  $('#join-form').validate({
    onkeyup: (ele, evt) => {
      const targetInputName = $(ele).attr('name')

      switch (targetInputName) {
        case 'id':
          if (evt.code === 'Enter') $duplicateCheckBtn.trigger('click')
          else {
            $(ele).val(
              $(ele)
                .val()
                .replace(/^[^a-zA-Z0-9]*$/g, '')
            )
          }
          break
        case 'tel':
          $(ele).val(
            $(ele)
              .val()
              .replace(/[^0-9]/g, '')
              .replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, '$1-$2-$3')
              .replace(/(\-{1,2})$/g, '')
          )
          break
      }
      $(ele).valid()
    },
    onfocusout: (ele, e) => {
      $(ele).val(
        $(ele)
          .val()
          .trim()
      )
    },
    rules: {
      id: {
        required: true,
        rangelength: [5, 30],
        alphanumeric: true
      },
      pw: {
        required: true,
        regex: /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,16}$/
      },
      repeat_pw: {
        required: true,
        equalTo: '#input-pw'
      },
      name: {
        required: true,
        rangelength: [1, 20]
      },
      nick: {
        required: true,
        rangelength: [1, 20]
      },
      tel: {
        required: true,
        regex: /^01([0|1|6|7|8|9]?)-?([0-9]{3,4})-?([0-9]{4})$/
      },
      email1: {
        required: true,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
      },
      email2: {
        required: true,
        regex: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
        notEqualTo: '#input-email1'
      }
    },
    messages: {
      id: {
        required: '아이디 입력은 필수입니다.',
        rangelength: '아이디는 5자에서 30자 사이로 입력해주시길 바랍니다.',
        alphanumeric: '영문, 숫자 조합으로만 입력해주시길 바랍니다.'
      },
      pw: {
        required: '비밀번호 입력은 필수입니다.',
        regex:
          '영문 소문자 및 대문자, 숫자, 특수문자($@$!%*#?&) 조합으로 비밀번호를 생성해주세요.(8자 이상, 16자 이하)'
      },
      repeat_pw: {
        required: '비밀번호 재입력은 필수입니다.',
        equalTo: '입력하신 비밀번호가 일치하지 않습니다.'
      },
      name: {
        required: '이름 입력은 필수입니다.',
        rangelength: '이름은 1자에서 20자 사이로 입력해주시길 바랍니다.'
      },
      nick: {
        required: '닉네임 입력은 필수입니다.',
        rangelength: '닉네임은 1자에서 20자 사이로 입력해주시길 바랍니다.'
      },
      tel: {
        required: '전화번호 입력은 필수입니다.',
        regex: '전화번호 형식으로 입력해주시길 바랍니다.'
      },
      email1: {
        required: '주 이메일 입력은 필수입니다.',
        regex: '이메일 형식으로 입력해주시길 바랍니다.'
      },
      email2: {
        required: '보조 이메일 입력은 필수입니다.',
        regex: '이메일 형식으로 입력해주시길 바랍니다.',
        notEqualTo: '주 이메일과 보조 이메일은 달라야 합니다.'
      }
    },
    errorPlacement: (err, ele) => {
      ele.parent().addClass('check_con')
      ele.parent().after(err)
    },
    errorElement: 'p',
    success: (errEle, input) => {
      errEle.remove()
      $(input)
        .parent()
        .removeClass('check_con')
    }
  })

  $submitBtn.on('click', async function (e) {
    e.preventDefault()

    if (!$duplicateCheckBtn.hasClass('complete')) {
      Swal.fire({
        text: 'ID 중복확인을 해주시길 바랍니다.',
        icon: 'warning',
        confirmButtonText: '확인'
      })
      return
    }

    const formData = {}

    for (input of $inputList) {
      if (!$(input).valid()) return
      formData[$(input).attr('name')] = $(input).val()
    }

    formData.hashtag = ['오픈소스']

    try {
      const { success, data } = await userService.signUp(formData)
      if (success) {
        Swal.fire({
          text: '회원가입 되었습니다.',
          icon: 'success',
          confirmButtonText: '확인',
          didClose: () => {
            location.href = `/login?id=${formData.id}`
          }
        })
      } else {
        const target = data[0]
        switch (target) {
          case 'id':
            $inputId.attr('disabled', false)
            $duplicateCheckBtn.attr('disabled', false)
            $duplicateCheckBtn.removeClass('complete')
            Swal.fire({
              text: '중복된 ID가 존재합니다.',
              icon: 'warning',
              confirmButtonText: '확인',
              didClose: () => {
                $inputId.focus().select()
              }
            })
            break
          case 'tel':
            Swal.fire({
              text: '중복된 전화번호가 존재합니다.',
              icon: 'warning',
              confirmButtonText: '확인',
              didClose: () => {
                $inputTel.focus().select()
              }
            })
            break
        }
      }
    } catch (e) {
      Swal.fire({
        text: '오류가 발생하였습니다. 관리자에게 문의주시길 바랍니다.',
        icon: 'error',
        confirmButtonText: '확인'
      })
    }
  })
})
