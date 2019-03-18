$(function() {
	/*搜尋商品*/
	$("#submitBtn").click(function() {
			if($("#productName").val()=="All"){
				$("#productName").val("");
				searchProductForSubmit($("#buId").find(":selected").val());
				$("#productName").val("");
			}else{
				searchProductForSubmit($("#buId").find(":selected").val());
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
  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/*搜尋商品*/
function searchProduct(buId){
	// $("#productTable").empty();

	var listProduct = {"buId": buId};
	
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/list",
		data : JSON.stringify(listProduct),
		success : function(data, response, xhr) {
			console.log(data)
				var tableData = data.Data.insuranceList;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();

				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
					$specifyTd.eq(0).text(tableData[i].code);
					$specifyTd.eq(1).text(tableData[i].name);
					$specifyTd.eq(2).text(tableData[i].kypGroup);
					$specifyTd.eq(3).append(checkEnabled(tableData[i].isProject));
					$specifyTd.eq(4).append(checkEnabled(tableData[i].isActive));
					$specifyTd.eq(5).text(tableData[i].updateTime);
				}
				
			
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

/*搜尋商品 For Submit*/
function searchProductForSubmit(buId){
	// $("#productTable").empty();

	var searchProduct = {"keyword":$("#productName").val().trim(), "buId": buId};
	
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/search",
		data : JSON.stringify(searchProduct),
		success : function(data, response, xhr) {
			console.log(data)
				var tableData = data.Data.insuranceList;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();
				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
					$specifyTd.eq(0).text(tableData[i].code);
					$specifyTd.eq(1).text(tableData[i].name);
					$specifyTd.eq(2).text(tableData[i].kypGroup);
					$specifyTd.eq(3).append(checkEnabled(tableData[i].isProject));
					$specifyTd.eq(4).append(checkEnabled(tableData[i].isActive));
					$specifyTd.eq(5).text(tableData[i].updateTime);
				}
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
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


