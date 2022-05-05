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

  });

});

AOS.init({
  duration: 1000,
  delay: 10
});

FB.getLoginStatus(function (response) {
  statusChangeCallback(response);
});

function checkLoginState() {
  FB.getLoginStatus(function (response) {
    statusChangeCallback(response);
  });
}