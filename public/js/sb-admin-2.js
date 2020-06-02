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
      trigger: 'hover',
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
        } else if (data.success === false) {
          $('#failureModal').modal('show');
          $('#requestBook').trigger('reset');
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

  $(function () {
    $('[data-toggle="tooltip"]').tooltip({
      html: true,
    });
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
  });

  $(function () {
    $('#autocomplete')
      .autocomplete({
        source(req, res) {
          $.ajax({
            url: `/search/books/${req.term}`,
            search: req.term,
            success(data) {
              res(data);
            },
          });
        },
        select(_event, ui) {
          $.ajax({
            url: `/books/${ui.item.value}`,
            success(data) {
              $('#downloadBooks').html(data);
              popoverHtml();
            },
          });
        },
        response(_event, ui) {
          if (!ui.content.length) {
            const noResult = { value: '', label: 'No matches found!' };
            ui.content.push(noResult);
          }
        },
      })
      .on('keydown', function (event, ui) {
        if (event.keyCode === 13) {
          // prevent form submission
          event.preventDefault();
          // close the autocomplete
          $('#autocomplete').autocomplete('close');
        }
      });
  });
})(jQuery);
