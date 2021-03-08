
$(document).ready(function () {

    // Display Create New Template HTML on the main page when Create New Template button clicked
    $('#createNewTemplate').click(() => {
        // AJAX call to receive HTML and display the form without refreshing the page
        $.ajax({
            url: '/create',
            type: 'GET',
            success: (data) => {
                $('.template-container').html(data)
                $('#createNewTemplate').unbind('click')
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
        // save template name and description
        var templateName = $('#createTemplate-name').val()
        var templateDesc = $('#createTemplate-desc').val()
        // save value of template markup provided by the user
        var markup = $('#template-markup').val()
        console.log("Save Template")
        // send variables and markup to the backend to inject in html file of that template
        $.ajax({
            url: '/api/save-template',
            type: 'POST',
        // Send data to backend
        data: {
            template_name: templateName,
            template_desc: templateDesc,
            markup: markup,
        },
        success: (data) => {
            $('#config-ta').html(data)
            $('#saveTemplate').unbind('click')
            // Refresh sidebar when template saved to display new template name in sidebar
            getTemplateNames()
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

// function to make AJAX GET call to get template names
function getTemplateNames() {        
    $.ajax({
        url: '/api/get-template-names',
        type: 'GET',
        success: (data) => {
            $("#sidebar .template-names").empty()
            // for loop to print all template names in sidebar list
            var i;
            for (i = 0; i < data.length; i++) {
                $("#sidebar .template-names").append('<li>' + data[i] + '</li>')
            }
        },
        error: (data) => {
            console.log(data)
        }
    })
}