// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable({
    processing: true,
    ajax: {
      url: '/users/data',
    },
    columns: [
      { data: 'firstname' },
      { data: 'lastname' },
      { data: 'username' },
      { data: 'usn' },
      { data: 'course' },
    ],
  });
  $('#bookTable').DataTable({
    ajax: {
      url: '/book-data/info',
    },
    columns: [
      { data: 'bookname' },
      { data: 'bookedition' },
      { data: 'year' },
      { data: 'course' },
      { data: 'author' },
      { data: 'semester' },
    ],
  });
});
