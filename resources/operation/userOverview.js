$(function() {
	// deal with date range
	$(".datepicker").datepicker({
    format: 'yyyy-mm-dd',
	});
	// 查詢使用人數統計
	$("#submitBtn").click(function() {
		if(dateRangeEqualsValidate()){
			var $buid = $("#buId option:selected");
			//alert($buid.val())
			$.ajax({
					type : "GET",
					contentType : 'application/json',
					url : fubon.contextPath+"operateManagement/peopleNum",
					data : {"buid":$buid.val(),
						    "datepickerFrom":$("#datepickerFrom").val(),
							"datepickerTo":$("#datepickerTo").val()},
					success : function(data, response, xhr) 
					{
						
						if(!IsJsonString(data)){
							 //clearChar();
							   bootsrapAlert(data);
							   //var drawdata=[0,0];
							   //drawPieChart(drawdata,1);
						}else{
							var jsonData = JSON.parse(data);
						
							console.log(jsonData);
							var userNumberData = jsonData.Data;
							$("#result").removeAttr("style");
							$("#usernum").text(userNumberData.Total);
							$("#transNum").text(userNumberData.Trans);
							var transPct=0;
							var drawdata=[0,0];
							if (userNumberData.Total==0){
								transPct=0;
								drawdata=[100,0];
								bootsrapAlert("目前無使用人數!");
								drawPieChart(drawdata,1);
							}else{
								transPct = Math.round((userNumberData.TransPct)*10000)/100;
								drawdata = [transPct,Math.round((100-transPct)*100)/100];
								drawPieChart(drawdata,0);
							}
						}
                         
						  
						//{"name":"bb","value":(userNumberData.transPercentage)*100},{"name":"aa","value":(1-userNumberData.transPercentage)*100}
						
						
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
    //alert(str)
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
		//alert($("#datepickerFrom").val());
		//alert($("#datepickerTo").val());
		$.ajax({
				type : "GET",
				contentType : 'application/json',
				url : fubon.contextPath+"operateManagement/peopleNum",
				data : {"buid":$buid.val(),
					    "datepickerFrom":$("#datepickerFrom").val(),
						"datepickerTo":$("#datepickerTo").val()},
				success : function(data, response, xhr) 
				{
					
					if(!IsJsonString(data)){
						   clearChar();
						   bootsrapAlert(data);
					}else{
						var jsonData = JSON.parse(data);
					
						console.log(jsonData);
						var userNumberData = jsonData.Data;
						$("#result").removeAttr("style");
						$("#usernumstr").text("使用人數:");
						$("#transNumstr").text("交易人數:");
						$("#usernum").text(userNumberData.Total);
						$("#transNum").text(userNumberData.Trans);
						var transPct=0;
						var drawdata=[0,0];
						if (userNumberData.Total==0){
							transPct=0;
							drawdata=[100,0];
							bootsrapAlert("目前無使用人數!");
							drawPieChart(drawdata,1);
						}else{
							transPct = Math.round((userNumberData.TransPct)*10000)/100;
							drawdata = [transPct,Math.round((100-transPct)*100)/100];
							drawPieChart(drawdata,0);
						}
					}
                     
					  
					//{"name":"bb","value":(userNumberData.transPercentage)*100},{"name":"aa","value":(1-userNumberData.transPercentage)*100}
					
					
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}	
		});
	}
}

function clearChar(){
	
	$("#usernum").empty();
	$("#transNum").empty();
	$("#usernumstr").empty();
	$("#transNumstr").empty();
	$("#picbody").empty();
}

