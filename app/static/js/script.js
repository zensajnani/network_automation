$(document).ready(function () {
    
    // Hide config div until Show Configuration button pressed
    $('#config-ta').hide()
    $('#actions').hide()
    
    
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
    
    $(".template-names").on('click','li',function (){
    // $(".template-names").click(() => {
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
                $('.template-container').empty()
                $('.template-container').html(data)
                $(".template-names").unbind('click')
            },
            error: () => {
                console.log("There was an error sending the template name to the backend")
            }
        })
    });
    
    // When number of hosts for syslog template are increased or decreased
    $('#hostCount').change(() => {
        // Get hosts count
        var hostCount = $('#hostCount').val()
        displaySysHostInput(hostCount)
    });
    
    
    // Display Input boxes equal to number of hosts
    function displaySysHostInput(hostCount) {
        $('#sysHost').empty();
        // For loop to display multiple input fields
        for (var i = 1; i <= hostCount; i++) {
            $('#sysHost').append("<p id='sysHost'>Enter a syslog host: <input id='getHost' class='get-host' type='text' placeholder='146.36.114.214'></p>")
        }
    }
    
    // Display multiple lgging hosts equal to number of hosts
    function displaySysHostLog() {
        var hostCount = $('#hostCount').val()
        $('#loggingHosts').empty();
        var hosts = document.getElementsByClassName("get-host")
        var i;
        // For loop to get values from the multiple input fields and display in log
        // for (i = 0; i < hostCount; i++) {
        //     $('#loggingHosts').append("<p>logging host <span id='displayHostInConfig'>" + hosts[i].value + "</span></p>")
        // }
        
        // For textarea
        var configText = "logging trap informational\nlogging history size 10\nlogging history size 10"
        for (i = 0; i < hostCount; i++) {
            console.log(i)
            configText += "\nlogging host " + hosts[i].value
        }
        configText += "\nlogging buffered 128000"
        console.log(configText)
        // $('#config-ta').text(configText)
        setHeight($('#config-ta'));
        
    }
    
    // When Show Configuration button pressed
    $('#showConfig').click((event) => {
        // Prevent default page refresh when form submit button pressed
        event.preventDefault()
        // Show config log
        $('#config-ta').show()
        $('#actions').show()
        // Display multiple lgging hosts equal to number of hosts
        displaySysHostLog(hostCount)
        
    })
    
    
    // Set textarea height
    function setHeight(jq_in){
        jq_in.each(function(index, elem){
            // This line will work with pure Javascript (taken from NicB's answer):
            elem.style.height = elem.scrollHeight + 10 +'px'; 
        });
    }
    
    // Copy config
    $('#copy').click(() => {
        $('#config-ta').select()
        document.execCommand("copy");
        console.log('Copied: ' + $('#config-ta').val())
        console.log("Copied Configuration");
    });
    // Export config
    $('#export').click(() => {
        var configText = $('#config-ta').val()
        download("config", configText)
        console.log('Config Text: ' + configText)
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