$(() => {
  // top _ scroll
  $(".top_quick_btn").click(function () {
    $("html, body").animate(
      {
        scrollTop: 0,
      },
      400
    );
    return false;
  });

  // scroll
  $(window.document.body).scroll(function (e) {
    const scrollTop = $(window.document.body).scrollTop();

    if (scrollTop > 50) {
      $(".top_quick_btn").fadeIn();
      $("#hder").addClass("shrink");
      $("#sub_hder").addClass("shrink");

    } else {
      $(".top_quick_btn").fadeOut();
      $("#hder").removeClass("shrink");
      $("#sub_hder").removeClass("shrink");

    }
  });
})  