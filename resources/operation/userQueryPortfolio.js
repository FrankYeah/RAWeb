$(function() {
	// deal with date range
	$(".datepicker").datepicker({
    format: 'yyyy-mm-dd',
	});
	// 查詢 UserQueryPortfolio
	$("#submitBtn").click(function() {
		getStatData();
	});	
});

/*如果切換ID 下面 role表格也要改變*/
$( "select" ).change(function () {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).val();
    });
    //searchProduct(str);
    getStatData();
  }).change();
  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function getStatData(){
	if(dateRangeEqualsValidate()){
		var $buid = $("#buId option:selected");
		//alert($buid.val())
		$.ajax({
			type : "GET",
			contentType : 'application/json',
			url : fubon.contextPath+"operateManagement/portfolioNum",
			data : {"buid":$buid.val(),
				     "datepickerFrom":$("#datepickerFrom").val(),
					"datepickerTo":$("#datepickerTo").val(),
					"interval":$('input[name="interval"]:checked').val()},
			success : function(data, response, xhr) {
				
				if(!IsJsonString(data)){
					   clearChar();
					   bootsrapAlert(data);
				}else{
					var portfolioData = JSON.parse(data);
					console.log(portfolioData);

					$("#result").removeAttr("style");
					if (portfolioData.DateIndexes.length==0){
						bootsrapAlert("目前無資料!");
					}
					var trans1 = portfolioData.DateIndexes;
					var trans2 = portfolioData.Values;
					//temp
					var trans3 = portfolioData.TransationNum;
					var keys = ["DateIndexes","Values","TransationNum"];
				
					var output=[];
					output = arraysTransformToObject4(trans1,trans2,trans3,keys);
					console.log(output);
					drawHistogram(output,$('input[name="interval"]:checked').val());
				}
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' '
						+ xhr.statusText);
			}	
		});
	}
}
function clearChar(){
	
	
	$("#picbody").empty();
}

