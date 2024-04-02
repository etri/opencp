/* eslint-disable no-undef */
$(() => {
  $inputId = $('#input-id')
  $inputPw = $('#input-pw')
  $inputList = $('.login_input').find('input')
  $loginBtn = $('#login-btn')

  const autoId = new URLSearchParams(window.location.search).get('id')
  const userService = new UserService()

  if (autoId) {
    $inputId.val(autoId || '')
    $inputPw.focus()
  } else {
    $inputId.focus()
  }

  $loginBtn.on('click', async function (e) {
    $loginBtn.attr('disabled', true)
    // $inputList.val($inputList.val().trim()) // <--id만 서버에 보내져서 아래방식으로 바꿈 나중에 함 봐주세여..(HY)
    $inputList.each(function () {
      $(this).val($(this).val().trim())
    })

    if (!$inputId.val()) {
      Swal.fire({
        text: 'ID를 입력해주시길바랍니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        didClose: () => $inputId.focus()
      })
      return
    }

    if (!$inputPw.val()) {
      Swal.fire({
        text: '패스워드를 입력해주시길바랍니다.',
        icon: 'warning',
        confirmButtonText: '확인',
        didClose: () => $inputPw.focus()
      })
      return
    }

    try {
      const resData = await userService.signIn({ id: $inputId.val(), pw: $inputPw.val() })
      if (resData.success) {
        document.location.href = './'
      }
    } catch (e) {}
  })
})
