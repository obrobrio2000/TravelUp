$(document).ready(function () {

  $('.fa-bars').click(function () {
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

});