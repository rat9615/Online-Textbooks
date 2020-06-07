(function ($) {
  'use strict'; // Start of use strict

  // Toggle the side navigation
  $('#sidebarToggle, #sidebarToggleTop').on('click', function (_e) {
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

  // modal data for request book
  $('#requestModal').on('show.bs.modal', function (e) {
    const bookId = $(e.relatedTarget).data('book-id');
    $(e.currentTarget)
      .find('a[name = "removeRequests"]')
      .attr('href', `/remove-books/${bookId}`);
  });
  // function popover
  function popoverHtml() {
    $('[data-toggle="popover"]').popover({
      animation: true,
      html: true,
      trigger: 'hover click',
    });
  }

  popoverHtml();

  $('#exampleRegisterPassword')
    .popover({
      html: true,
      animation: true,
      title: '<b>Password Requirements</b>',
      content:
        '<ul><li>Must contain minimum 8 characters.</li><li>Must contain a capital letter.</li><li>Must contain a number.</li><li>Must contain a special character.</li></ul>',
      placement: 'top',
    })
    .blur(function () {
      $(this).popover('hide');
    });

  // ajax call for browse based on branch
  $(document).on('change', '#selectCourse', function () {
    const selectval = $('#selectCourse').val();
    $.ajax({
      url: `/branch/${selectval}`,
      success(data) {
        $('#browseBranch').html(data);
        popoverHtml();
        $('.selectpicker').selectpicker('refresh');
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

  // ajax call for request book
  $(document).on('submit', '#requestBook', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/users/request',
      method: 'POST',
      data: $('#requestBook').serialize(),
      success(data) {
        if (data.success === true) {
          $('#SuccessModal').modal('show');
          $('#requestBook').trigger('reset');
          $('.selectpicker').selectpicker('refresh');
        } else if (data.success === false) {
          $('#failureModal').modal('show');
          $('#requestBook').trigger('reset');
          $('.selectpicker').selectpicker('refresh');
        }
      },
    });
  });

  // ajax call for contact
  $(document).on('submit', '#contactForm', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/users/contact',
      method: 'POST',
      data: $('#contactForm').serialize(),
      beforeSend() {
        $('#loadingsvg').show();
      },
      success(data) {
        if (data.success === true) {
          $('#contactSuccessModal').modal('show');
          $('#contactForm').trigger('reset');
        } else if (data.success === false) {
          $('#contactfailureModal').modal('show');
          $('#contactForm').trigger('reset');
        }
      },
      complete() {
        $('#loadingsvg').hide();
      },
    });
  });
  $('[data-toggle="tooltip"]').tooltip({
    html: true,
    trigger: 'hover click',
  });

  // ajax call for upload books
  $(document).on('submit', '#uploadBooks', function (e) {
    e.preventDefault();
    $.ajax({
      url: '/upload-books',
      method: 'POST',
      data: $('#uploadBooks').serialize(),
      beforeSend() {
        $('#loadingsvg').show();
      },
      success(data) {
        if (data.success === true) {
          $('#uploadSuccessModal').modal('show');
          $('#uploadBooks').trigger('reset');
          $('.selectpicker').selectpicker('refresh');
          $('.my-pond').filepond('removeFile');
        } else if (data.success === false) {
          $('#uploadFailureModal').modal('show');
          $('#uploadBooks').trigger('reset');
          $('.selectpicker').selectpicker('refresh');
          $('.my-pond').filepond('removeFile');
        }
      },
      complete() {
        $('#loadingsvg').hide();
      },
    });
  });
})(jQuery);
