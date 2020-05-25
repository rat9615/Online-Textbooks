// Call the dataTables jQuery plugin
$(document).ready(function () {
  $('#dataTable').DataTable();
  $('#dataTable').DataTable().clear().rows.add(getDataFromServer()).draw();
});
