(function ($) {
  'use strict'; // Start of use strict

  // Toggle the side navigation
  $('#sidebarToggle, #sidebarToggleTop').on('click', function (e) {
    $('body').toggleClass('sidebar-toggled');
    $('.sidebar').toggleClass('toggled');
    if ($('.sidebar').hasClass('toggled')) {
      $('.sidebar .collapse').collapse('hide');
    }
  });

  // Close any open menu accordions when window is resized below 768px
  $(window).resize(function () {
    if ($(window).width() < 768) {
      $('.sidebar .collapse').collapse('hide');
    }

    // Toggle the side navigation when window is resized below 480px
    if ($(window).width() < 480 && !$('.sidebar').hasClass('toggled')) {
      $('body').addClass('sidebar-toggled');
      $('.sidebar').addClass('toggled');
      $('.sidebar .collapse').collapse('hide');
    }
  });

  // Prevent the content wrapper from scrolling when the fixed side navigation hovered over
  $('body.fixed-nav .sidebar').on('mousewheel DOMMouseScroll wheel', function (
    e
  ) {
    if ($(window).width() > 768) {
      var e0 = e.originalEvent,
        delta = e0.wheelDelta || -e0.detail;
      this.scrollTop += (delta < 0 ? 1 : -1) * 30;
      e.preventDefault();
    }
  });

  // Scroll to top button appear
  $(document).on('scroll', function () {
    var scrollDistance = $(this).scrollTop();
    if (scrollDistance > 100) {
      $('.scroll-to-top').fadeIn();
    } else {
      $('.scroll-to-top').fadeOut();
    }
  });

  // Smooth scrolling using jQuery easing
  $(document).on('click', 'a.scroll-to-top', function (e) {
    var $anchor = $(this);
    $('html, body')
      .stop()
      .animate(
        {
          scrollTop: $($anchor.attr('href')).offset().top,
        },
        1000,
        'easeInOutExpo'
      );
    e.preventDefault();
  });
  $('.carousel').carousel({
    interval: 2000,
  });

  $(function () {
    $.fn.filepond.registerPlugin(
      // FilePondPluginFileEncode,
      FilePondPluginFileValidateType,
      FilePondPluginFileValidateSize
    );
    $.fn.filepond.setOptions({
      server: {
        url: '/uploads',
      },
    });
    // Turn input element into a pond
    $('.my-pond').filepond();

    // Turn input element into a pond with configuration options
    $('.my-pond').filepond({
      allowMultiple: true,
    });

    $('.my-pond').filepond({
      acceptedFileTypes: 'application/pdf',
      maxFileSize: '50MB',
    });
    // Set allowMultiple property to true
    $('.my-pond').filepond('allowMultiple', false);

    // Listen for addfile event
    $('.my-pond').on('FilePond:addfile', function (e) {
      console.log('file added event', e);
    });

    // Manually add a file using the addfile method
    $('.my-pond').then(function (file) {
      console.log('file added', file);
    });
  });
})(jQuery);
