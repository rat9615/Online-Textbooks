// load jQuery UI Autcomplete plugin
$(function () {
  // function popover
  function popoverHtml() {
    $('[data-toggle="popover"]').popover({
      animation: true,
      html: true,
      trigger: 'hover',
    });
  }

  popoverHtml();
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
