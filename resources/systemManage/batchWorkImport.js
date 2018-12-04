
$(function() {

	if ( $('#form1 [name="Date"]').val() == "" ) {
		$('#form1 [name="Date"]').val(formatDate(new Date()));
	}
	$('#form1 [name="Date"]').datepicker({
		format : 'yyyy-mm-dd',
		autoclose : true
	});

    var reimport = function(date,buid) {
    	
        var ajaxData = {"date": date, "BUID": buid};
    	
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

    $("#form1").find("input[name='submitBtn']").click(function(){
        $page.val("1");
    });

    $("#reimport").click(function(){
        var date = $("#form1").find("input[name='Date']").val();
        var BUID = $("#BUID").val();
        //alert(BUID);
        reimport(date,BUID);
    });

});

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
}
function chgPage(page) {
	$('#bnSubmit').click(function() {
		$('#form1 [name="Page"]').val(1);
		$('#form1 [name="PageSize"]').val(50);
	});
	
	var formPage = $('#form1 [name="Page"]').val();

	if ( formPage == page ) {
		return;
	}
	
	if (page < 1) {
		return;
	}
	
	if (page > $('[name="totalPage"]').val()) {
		return;
	}
	
	$('#form1 [name="Page"]').val(page);
	
	
	
	$('#form1').submit();
}

function setInitialPageData(){
	
	$('#form1 [name="Page"]').val(1);
	$('#form1 [name="PageSize"]').val(50);
	$('#form1').submit();
}

