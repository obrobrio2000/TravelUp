$(document).ready(function () {

  $('.fa-bars').click(function () {
    $(this).toggleClass('fa-times');
    $('.nav').toggleClass('nav-toggle');
  });

  $(window).on('load scroll', function () {

    $('.fa-bars').removeClass('fa-times');
    $('.nav').removeClass('nav-toggle');

    $('header').addClass('header-active');

  });

});

AOS.init({
  duration: 1000,
  delay: 10
});