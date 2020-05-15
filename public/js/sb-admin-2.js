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

  // function popover
  function popoverHtml() {
    $('[data-toggle="popover"]').popover({
      html: true,
      trigger: 'hover',
    });
  }

  popoverHtml();
  // ajax call for browse based on branch
  $(document).on('change', '#selectCourse', function () {
    const selectval = $('#selectCourse').val();
    $.ajax({
      url: `/branch/${selectval}`,
      success(data) {
        $('#browseBranch').html(data);
        popoverHtml();
      },
    });
  });

  // ajax call for browse based on semester
  $(document).on('change', '#selectCourse,#selectSemester', function () {
    const selectcourse = $('#selectCourse').val();
    const selectsem = $('#selectSemester').val();
    $.ajax({
      url: `/semester/${selectcourse}/${selectsem}`,
      success(data) {
        $('#browseSemester').html(data);
        popoverHtml();
      },
    });
  });

  // ajax call for browse based on author
  $(document).on('change', '#selectAuthor', function () {
    const selectauth = $('#selectAuthor').val();
    $.ajax({
      url: `/author/${selectauth}`,
      success(data) {
        $('#browseAuthor').html(data);
        popoverHtml();
      },
    });
  });

  $(function () {
    $.fn.filepond.registerPlugin(
      // FilePondPluginFileEncode,
      FilePondPluginFileValidateType,
      FilePondPluginFileValidateSize
    );

    $.fn.filepond.setOptions({
      server: {
        process: '/uploads',
        revert: '/remove',
      },
    });

    // Turn input element into a pond
    $('.my-pond').filepond();

    // Turn input element into a pond with configuration options
    $('.my-pond').filepond({
      allowMultiple: true,
      type: 'limbo',
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

    // // Manually add a file using the addfile method
    // $('.my-pond').then(function (file) {
    //   console.log('file added', file);
    // });
  });
})(jQuery);
