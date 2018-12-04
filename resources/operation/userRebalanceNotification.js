$(function() {
	// deal with date range
	$(".datepicker").datepicker({
    format: 'yyyy-mm-dd',
	});
	//查詢 UserRebalanceNotification
	$("#submitBtn").click(function() {
		if(dateRangeEqualsValidate()){
			var $buid = $("#buId option:selected");
			//alert($buid.val())
			$.ajax({
				type : "GET",
				contentType : 'application/json',
				url : fubon.contextPath+"operateManagement/rebalanceNum",
				data : {"buid":$buid.val(),
					    "datepickerFrom":$("#datepickerFrom").val(),
						"datepickerTo":$("#datepickerTo").val(),
						"interval":$('input[name="interval"]:checked').val()},
				success : function(data, response, xhr) {
					if(!IsJsonString(data)){
						   clearChar();
						   bootsrapAlert(data);
					}else{
						var rebalanceData = JSON.parse(data);
						console.log(rebalanceData);
						//rebalanceData.dateIndexes.length 3
						$("#result").removeAttr("style");
						if (rebalanceData.DateIndexes.length==0){
							bootsrapAlert("目前無資料!");
						}
						var trans1 = rebalanceData.DateIndexes;
						var trans2 = rebalanceData.Values;
						var keys = ["DateIndexes","Values"];
					
						var output=[];
						output = arraysTransformToObject3(trans1,trans2,keys);
						drawBarChart(output,$('input[name="interval"]:checked').val());
					}
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}	
			});
		}
	});	
});

/*如果切換ID 下面 role表格也要改變*/
$( "select" ).change(function () {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).val();
    });
    //searchProduct(str);
  }).change();
  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function clearChar(){
	
	
	$("#picbody").empty();
}
