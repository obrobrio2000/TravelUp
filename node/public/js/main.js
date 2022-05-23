$(function () {

  $('.fa-bars').on('click', function () {
    $(this).toggleClass('fa-times');
    $('.nav').toggleClass('nav-toggle');
  });

  $(window).on('load scroll', function () {

    $('.fa-bars').removeClass('fa-times');
    $('.nav').removeClass('nav-toggle');

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

<<<<<<< HEAD
});
||||||| merged common ancestors
});

AOS.init({
  duration: 1000,
  delay: 10
});
=======
});

AOS.init({ duration: 1000, delay: 10 });
>>>>>>> 59d7ff3d5d97ec0753b099ea716323208025fced
