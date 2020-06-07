// load filepond plugin
$(function () {
  $.fn.filepond.registerPlugin(
    // eslint-disable-next-line no-undef
    FilePondPluginFileValidateType,
    // eslint-disable-next-line no-undef
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
