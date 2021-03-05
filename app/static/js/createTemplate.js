$(document).ready(function () {

    // Display Create New Template HTML on the main page when Create New Template button clicked
    $('#createNewTemplate').click(() => {
        console.log('Create new Template')
        // AJAX call to receive HTML and display the form without refreshing the page
        $.ajax({
            url: '/create',
            type: 'GET',
            success: (data) => {
                console.log(data)
                $('.template-container').html(data)
            }
        })
    })


    // When Save button clicked after user has entered input variables
    $('#saveVariables').click((event) => {
        alert("Saved")
        event.preventDefault()
        var inputVariables = {
            testVariable: $('#testVariable').val(),
        }
        sendVariableToBackend(inputVariables)
    })

    // When Save Template button clicked after entering input variables and Markup template
    $('#saveTemplate').click((event) => {
        //prevent default page refresh when button clicked
        event.preventDefault();
        // save value of template markup provided by the user
        var markup = $('#template-markup').val()
        console.log("Save Template")
        console.log(markup)
        // send variables and markup to the backend to inject in html file of that template
        $.ajax({
            url: '/api/save-template',
            type: 'POST',
        // Send data to backend
        data: {
            markup: markup,
        },
        success: (data) => {
            console.log("Successfull sent data to the backend")
            console.log(data)
            $('#config-ta').html(data)
        },
        error: (error) => {
            console.log('There was an error sending the data to the backend: ' )
            console.log(error)
        }
        })
    })
})

// Send variables (input values) to the flask backend
function sendVariableToBackend(inputVariables) {
    $.ajax({
        url: '/api/set-inputs',
        type: 'POST',
        // Send data to backend in JSON format
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        // inputVariables is a dictionary object
        data: JSON.stringify(inputVariables),
        success: (data) => {
            console.log('Successfully sent data to backend:')
            console.log(data)
        },
        error: () => {
            console.log("Error while sending data to the backend")
        }
    })
}