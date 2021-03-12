$(document).ready(function () {

    // Hide config div until Show Configuration button pressed
    // $('#config-ta').hide()
    // $('#actions').hide()


    // display template names in the sidebar
    getTemplateNames()

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

    // Display template form and data when template name clicked from sidebar (eg: variable names, Show Configuration, Copy and Export button)
    $(".template-names").on('click', 'li', function () {
        $('#createTemplateWrapper').hide() // if Create Template form present, hide it

        // Get template name
        var templateName = $(this).text()
        console.log(templateName)
        // Send template name to backend
        $.ajax({
            url: '/display-template',
            type: 'POST',
            // Send data to backend in JSON format
            // contentType: "application/json; charset=utf-8",
            // dataType: "json",
            data: {
                template_name: templateName     // send template name to the backend
            },
            success: (data) => {
                // $('.template-container').empty()
                $('.template-display').append(data)
                $(".template-names").unbind('click')
            },
            error: () => {
                console.log("There was an error sending the template name to the backend")
            }
        })
        $(".template-names").unbind('click')
    });


    // remove template display from container when cross button clicked
    $(".remove").off().on('click', function () {
        $(this).closest('.template-body').remove();
    });


    // // When number of hosts for syslog template are increased or decreased
    // $('#hostCount').change(() => {
    //     // Get hosts count
    //     var hostCount = $('#hostCount').val()
    //     displaySysHostInput(hostCount)
    // });


    // // Display Input boxes equal to number of hosts
    // function displaySysHostInput(hostCount) {
    //     $('#sysHost').empty();
    //     // For loop to display multiple input fields
    //     for (var i = 1; i <= hostCount; i++) {
    //         $('#sysHost').append("<p id='sysHost'>Enter a syslog host: <input id='getHost' class='get-host' type='text' placeholder='146.36.114.214'></p>")
    //     }
    // }

    // // Display multiple lgging hosts equal to number of hosts
    // function displaySysHostLog() {
    //     var hostCount = $('#hostCount').val()
    //     $('#loggingHosts').empty();
    //     var hosts = document.getElementsByClassName("get-host")
    //     var i;
    //     // For loop to get values from the multiple input fields and display in log
    //     // for (i = 0; i < hostCount; i++) {
    //     //     $('#loggingHosts').append("<p>logging host <span id='displayHostInConfig'>" + hosts[i].value + "</span></p>")
    //     // }

    //     // For textarea
    //     var configText = "logging trap informational\nlogging history size 10\nlogging history size 10"
    //     for (i = 0; i < hostCount; i++) {
    //         console.log(i)
    //         configText += "\nlogging host " + hosts[i].value
    //     }
    //     configText += "\nlogging buffered 128000"
    //     console.log(configText)
    //     // $('#config-ta').text(configText)
    //     setHeight($('#config-ta'));

    // }

    // When Show Configuration button pressed
    $(".show-config").off().on('click', function (event) {
        var templateId = $(this).data("template-id")
        console.log("Template ID: " + templateId)
        // Prevent default page refresh when form submit button pressed
        event.preventDefault()

        // console.log($("div").find(`[data-template-id='${templateId}']`).text())
        // console.log($(`.config-ta[data-template-id="${templateId}"]`).text());

        // Save variable values as dictionary. Key will be variable name and Value will be value of the input field
        var variables_dict = {}
        // var variable_inputs = document.getElementsByClassName("variable-inputs")

        // find closest form incase there are duplicate templates loaded
        var closestParent = $(this).closest(".template-body")
        var variable_inputs = closestParent.find(".variable-inputs")
        //Select closest configuration text area with same template ID
        var configTa = closestParent.find(`.config-ta[data-template-id="${templateId}"]`)
        // assign key value pairs
        for (var i = 0; i < variable_inputs.length; i++) {
            variables_dict[variable_inputs[i].id] = variable_inputs[i].value
        }
        console.log(variables_dict)
        // Send variables to backend
        sendVariablesToBacked(variables_dict, templateId, configTa)
        // Show config log
        // $('#config-ta').show()
        // $(this).closest('#config-ta').show()
        // $(`.config-ta[data-template-id="${templateId}"]`).show()
        $('#actions').show()
        // Display multiple lgging hosts equal to number of hosts
        setHeight(configTa);
        // displaySysHostLog(hostCount)
    })

    // When Show Full Configuration button clicked
    $('#showFullConfig').click((event) => {
        var allConfigTexts = "";
        var configTextSelector = document.getElementsByClassName("config-ta")
        for (var i = 0; i < configTextSelector.length - 1; i++) {
            allConfigTexts += configTextSelector[i].value + "\n"
        }
        $("#fullConfig").html(allConfigTexts)
        console.log("showFullConfig")
        console.log(allConfigTexts)
        // $("#showFullConfig").unbind('click')
        event.stopImmediatePropagation();
    })


    // Set textarea height
    function setHeight(jq_in) {
        jq_in.each(function (index, elem) {
            elem.style.height = elem.scrollHeight + 'px';
            console.log("Set height: " + elem.style.height)
        });
    }

    // Copy config
    // $('#copy').click(() => {
    $(".copy").off().on('click', function (event) {
        var templateId = $(this).data("template-id")
        var selector = `.config-ta[data-template-id="${templateId}"]`
        console.log(templateId)
        console.log(selector)
        $(selector).select()
        document.execCommand("copy");
        console.log("Copied Configuration");
    });
    // Export config
    $(".export").off().on('click', function (event) {
        var templateId = $(this).data("template-id")
        var selector = `.config-ta[data-template-id="${templateId}"]`
        var configText = $(selector).val()
        filename = "config-" + templateId
        download(filename, configText)
    });

    // Download
    function download(filename, text) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
        element.setAttribute('download', filename);
        element.style.display = 'none';
        document.body.appendChild(element);
        element.click();
        document.body.removeChild(element);
    }
});

// send variables dictionary to backend
function sendVariablesToBacked(variables, template_id, configTaSelector) {
    data = {
        template_id: template_id,
        variables: variables
    }
    $.ajax({
        url: '/api/show-config',
        type: 'POST',
        data: JSON.stringify(data),
        contentType: "application/json; charset=utf-8",
        success: (data) => {
            console.log("successfully rendered configuration")
            console.log(data)
            configTaSelector.html(data)
        },
        error: (data) => {
            console.log("There was an error loading the configuration")
            configTaSelector.html("There was an error loading the configuration")
            console.log(data)
        }
    })
}