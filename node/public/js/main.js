$(function () {

  $(window).on('load scroll', function () {

    if ($(window).scrollTop() > 10) {
      $('header').addClass('header-active');
    } else {
      $('header').removeClass('header-active');
    }

    if ($(this).scrollTop() > 800) {
      $('.loginLink').show(1000);
    }
    else {
      $('.loginLink').hide(1000);
    }

  });

});

AOS.init({ duration: 1000, delay: 10 });
