$(function() {
	/*搜尋商品*/
	$("#submitBtn").click(function() {
			if($("#productName").val()=="All"){
				$("#productName").val("");
				searchProduct($("#buId").find(":selected").val());
				$("#productName").val("");
			}else{
				searchProduct($("#buId").find(":selected").val());
				$("#productName").val("");
			}
	});	
});

/*如果切換ID 下面 role表格也要改變*/
$( "select" ).change(function () {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).val();
    });
    searchProduct(str);
  }).change();

/*搜尋商品*/
function searchProduct(buId){
	var searchproduct = {"Keyword":$("#productName").val(), "buId":buId};
	
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/searchProduct",
		data : JSON.stringify(searchproduct),
		success : function(data, response, xhr) {
			if(data.Status === "Error"){
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				$(".Msg").append(data);
				bootsrapAlert(data.Detail);
			}
			else{
				var productData = data.Data;
				console.log(productData);
				var tableData =productData.Products;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();
				
				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td> </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');

					$specifyTd.eq(0).text(tableData[i].Code);
					$specifyTd.eq(1).text(tableData[i].Name);
					$specifyTd.eq(2).text(tableData[i].RiskReturn);
					$specifyTd.eq(3).text(tableData[i].Description);

					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
					$specifyTd.eq(4).append(href);
					$specifyTd.eq(5).text(tableData[i].CreateTime);
					$specifyTd.eq(6).append(checkEnabled(tableData[i].Active));
					$specifyTd.eq(7).text(tableData[i].UpdateTime);
				}
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
		}
	});
}

function checkEnabled(tf){
	if(tf){
		var result = "<span class=\"glyphicon glyphicon-ok\"></span>";
		return result
	}else{
		var result = "<span class=\"glyphicon glyphicon-remove\"></span>";
		return result
	}
}

