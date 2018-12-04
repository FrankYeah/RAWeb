$(function() {

    var $form = $("#form1");
    var $startDate = $form.find("input[name='Date']");
    var $page = $form.find("input[name='Page']");

    $startDate.datepicker({
        format : 'yyyy-mm-dd',
        autoclose : true
    });

    var reimport = function(date) {
    	
        var ajaxData = {date: date};
    	
        $.ajax({
            type: 'GET',
            url: 'ReImoportBatch',
            contentType : 'application/json',
            data: ajaxData,
            dataType: 'json'
        }).done(function (data, textStatus, jqXHR) {
            BootstrapDialog.show({
                message: "匯入成功 !"
            });
        }).fail(function (jqXHR, textStatus, errorThrown) {
            var returnData = JSON.parse(jqXHR.responseText);
            var message = (returnData.exception) ? returnData.message : jqXHR.responseText;
            BootstrapDialog.show({
                type: BootstrapDialog.TYPE_WARNING,
                message: message
            });
        });

    };

    $form.find("input[name='submitBtn']").click(function(){
        $page.val("1");
    });

    $("#reimport").click(function(){
        var date = $("#form1").find("input[name='Date']").val();
       // alert(date);
        reimport(date);
    });

});
