// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable({
    ajax: {
      url: '/users/data',
    },
    columnDefs: [
      {
        targets: 0,
        data: 'firstname',
      },
      {
        targets: 1,
        data: 'lastname',
      },
      {
        targets: 2,
        data: 'username',
      },
      {
        targets: 3,
        data: 'usn',
      },
      {
        targets: 4,
        data: 'course',
      },
      {
        targets: 5,
        data: '_id',
        render: (
          data
        ) => `<a href="${data}" data-toggle="modal" data-target="#deleteuser" class="btn btn-danger btn-circle" title="Delete">
        <i class="fas fa-trash"></i>
      </a>`,
      },
    ],
  });
  $('#bookTable').DataTable({
    ajax: {
      url: '/book-data/info',
    },
    columnDefs: [
      {
        targets: 0,
        data: 'bookname',
      },
      {
        targets: 1,
        data: 'bookedition',
      },
      {
        targets: 2,
        data: 'year',
      },
      {
        targets: 3,
        data: 'course',
      },
      {
        targets: 4,
        data: 'author',
      },
      {
        targets: 5,
        data: 'semester',
      },
      {
        targets: 6,
        data: '_id',
        render: (
          data
        ) => `<a href="${data}" data-toggle="modal" data-target="#deleteBook" class="btn btn-danger btn-circle">
        <i class="fas fa-trash" title="Delete"></i>
      </a>`,
      },
    ],
  });

  $('#deleteBook').on('show.bs.modal', function (e) {
    const id = $(e.relatedTarget).attr('href');
    $(e.currentTarget)
      .find('a[name="delBooks"')
      .attr('href', `/book-data/info/${id}`);
  });

  $('#deleteuser').on('show.bs.modal', function (e) {
    const id = $(e.relatedTarget).attr('href');
    $(e.currentTarget)
      .find('a[name="delUser"]')
      .attr('href', `/users/data/${id}`);
  });
});
$(document).on('click', 'a[name="delUser"]', function (e) {
  e.preventDefault();
  $.ajax({
    url: `${$(this).attr('href')}`,
    beforeSend() {
      $('#loadingsvg').show();
    },
    success(data) {
      if (data.success === true) {
        $('#deleteuser').modal('hide');
        $('#dataTable').DataTable().ajax.reload();
      } else if (data.success === false) {
        $('#errorUserModal').modal('show');
      }
    },
    complete() {
      $('#loadingsvg').hide();
    },
  });
});

$(document).on('click', 'a[name="delBooks"]', function (e) {
  e.preventDefault();
  $.ajax({
    url: `${$(this).attr('href')}`,
    beforeSend() {
      $('#loadingsvg').show();
    },
    success(data) {
      if (data.success === true) {
        $('#deleteBook').modal('hide');
        $('#bookTable').DataTable().ajax.reload();
      } else if (data.success === false) {
        $('#errorBookModal').modal('show');
      }
    },
    complete() {
      $('#loadingsvg').hide();
    },
  });
});
