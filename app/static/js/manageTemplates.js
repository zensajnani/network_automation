$(document).ready(function () {
    // Initialise DataTable Object
    $('#displayTemplates').DataTable({
        searching: true,
        ajax: { url: '/api/display-all-templates', dataSrc: "" },
        'createdRow': function (row, data, dataIndex) {
            $(row).attr('data-template-id', data[0]);
        },
        "columnDefs": [{
            "targets": -1,
            "data": null,
            "defaultContent": "<nobr><button class='edit'>Edit</button><button class='delete'>X</button></nobr>"
        }]
    });

    // var table = $('#displayTemplates').DataTable({
    //     searching: true,
    //     ajax: '/api/display-all-templates'
    // });

    // Get Template Data from Backend
    // $.ajax({
    //     url: '/api/display-all-templates',
    //     type: 'GET',
    //     // If post request is successful, then GET data from backend to display on frontend
    //     success: (data) => {
    //         // Loop to print the result in a HTML table
    //         for (var i = 0; i < 10; i++) {
    //             // console.log(data['result']['Tweets'][i] + " " + data['result']['Sentiment'][i])

    //             // Append the row to table and add template_id as class to table row
    //             table.row.add([data[i][1], data[i][0], data[i][2], "Variable", data[i][3], "Edit | Delete"]).draw().nodes().to$().addClass(data[i][0])
    //             // $("#displayResult tbody").append(row)
    //         }
    //         table.columns.adjust().draw();
    //     },
    //     error: () => {
    //         console.log("There was an error")
    //     }
    // })


    // Get Template data when selected from table row
    // $(".display-templates").on('click', 'tr', function () {
    //     var templateId = $(this).attr('data-template-id');
    //     console.log("Template Selected: " + templateId)
    // });


    // When edit button clicked
    $(".display-templates").on('click', 'button.edit', function () {
        var templateId = $(this).closest('tr').attr('data-template-id');
        console.log("Edit: " + templateId)
        editTemplate(templateId)
    })

    // // When Table row clicked
    // $(".display-templates").on('click', 'tr', function () {
    //     var templateId = $(this).attr('data-template-id');
    //     console.log("Edit: " + templateId)
    //     editTemplate(templateId)
    // })


    // When delete button clicked
    $(".display-templates").on('click', 'button.delete', function () {
        var templateId = $(this).closest('tr').attr('data-template-id');
        deleteTemplate(templateId)
    })

    // Edit template Function
    function editTemplate(templateId) {
        // $.ajax({
        //     url: '/edit-template',
        //     type: 'POST',
        //     // data: {
        //     //     template_id: templateId    // send template ID to the backend
        //     // },
        //     success: (data) => {
        //         // $('.template-container').empty()
        //         window.location.href = '/edit-template/' + templateId;
        //     },
        //     error: () => {
        //         console.log("There was an error editing template")
        //     }
        // })

        window.location.href = '/edit-template/' + templateId;

    }

    // Delete Template Function
    function deleteTemplate(templateId) {
        // Confitrm deletetion
        var isDelete = confirm("Are you sure you want to delete template: " + templateId + " ?")
        if (isDelete) {
            // AJAX call to delete from database
            $.ajax({
                url: 'delete-template',
                type: 'POST',
                data: {
                    template_id: templateId
                },
                success: (data) => {
                    console.log("Deleted Template: " + templateId)
                    console.log(data)
                },
                error: (data) => {
                    console.log("There was an error deleting " + templateId)
                }
            })
            // Reload DataTable 
            $('#displayTemplates').DataTable().ajax.reload();
        }
        else {
            console.log("Cancel Delete")
        }
    }




})