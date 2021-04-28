
$(document).ready(function () {

    // Display 1 input variable field when page loads
    displayInputVariables(1)

    // Display Create New Template HTML on the main page when Create New Template button clicked
    $('#createNewTemplate').click(() => {
        // hide Full Configuration DIV
        $('#fullConfigWrapper').hide();
        // AJAX call to receive HTML and display the form without refreshing the page
        $.ajax({
            url: '/create',
            type: 'GET',
            success: (data) => {
                $('.template-display').html(data)
                $('#createNewTemplate').unbind('click')
            }
        })
    })
    // remove create template display from container when cross button clicked
    $(".remove").off().on('click', function () {
        $('#createTemplateWrapper').remove();
    });

    // When number of input variables while creating template are increased or decreased
    $('#variableCount').change(() => {
        // Get variable count
        var varCount = $('#variableCount').val()
        displayInputVariables(varCount)
    });


    // Display Input Variable divs equal to number of inputs
    function displayInputVariables(varCount) {
        $('.input-variables').empty();
        var variableInputForm = `<p class="input-variable"> 
        <input class="input-variable-name" type="text" placeholder="Variable Name">
        <input class="input-variable-display" type="text" placeholder="Variable Display Name">
        <select name="" class="input-variable-type" placeholder="Data Type">
        <option value="TEXT" autofocus>String</option>
        <option value="INTEGER">Integer</option>
        <option value="REAL">Decimal</option>
        </select>
        </p>`
        // For loop to display multiple input fields
        for (var i = 1; i <= varCount; i++) {
            $('.input-variables').append(variableInputForm)
        }
    }

    // When Save button clicked after user has entered input variables
    function getVariablesObject() {
        var variableData = [{}]
        var variableCount = $('#variableCount').val()
        // get data of all variable names for the template
        var variableNames = document.getElementsByClassName("input-variable-name")
        var variableDisplays = document.getElementsByClassName("input-variable-display")
        var variableDataTypes = document.getElementsByClassName("input-variable-type")
        var i;
        for (i = 0; i < variableCount; i++) {
            variableData[i] = { variable_name: variableNames[i].value, variable_display: variableDisplays[i].value, variable_datatype: variableDataTypes[i].value }
        }
        return variableData
        // sendVariableToBackend(inputVariables)
    }


    // When Save Template button clicked after entering input variables and Markup template
    $('#saveTemplate').click((event) => {
        //prevent default page refresh when button clicked
        event.preventDefault();
        // save template name and description
        var templateName = $('#createTemplate-name').val()
        var templateDesc = $('#createTemplate-desc').val()
        // save value of template markup provided by the user
        var markup = $('#template-markup').val()
        var variables = getVariablesObject()

        // save all data to sent to the backend as an object
        templateData = {
            template_name: templateName,
            template_desc: templateDesc,
            markup: markup,
            variables: variables
        }

        console.log("Save Template")
        console.log(templateData)
        // send variables and markup to the backend to inject in html file of that template
        $.ajax({
            url: '/api/save-template',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            // Send data to backend
            data: JSON.stringify(templateData),
            success: (data) => {
                console.log("saved template")
                console.log(variables)
                // $('#config-ta').html(data)
                $('#saveTemplate').unbind('click')
                // Refresh sidebar when template saved to display new template name in sidebar
                getTemplateNames()
                alert("Successfully created Template: " + templateName)
            },
            error: (error) => {
                console.log('There was an error sending the data to the backend: ')
                console.log(error)
                alert("Failed to created Template: " + templateName)
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