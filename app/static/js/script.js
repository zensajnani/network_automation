$(document).ready(function () {

    $('#config').hide()


    $('#showConfig').click((event) => {
        event.preventDefault()

        var host = $('#getHost').val()
        $('#config').show()
        $('#displayHostInConfig').text(host)
    })
});