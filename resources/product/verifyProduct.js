listModifyProduct();
var storeData;
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/*搜尋商品*/
function listModifyProduct(){

	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/listModifyRequest",
		data : {},
		success : function(data, response, xhr) {

			var tableData = data.Data.modifyRequestList
			storeData = tableData;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();
				
				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td style='vertical-align: middle; width: 150px;'><button style='margin-right: 5px;' onClick=passVerify(this) class='wn btn btn-primary'>通過</button><button onClick=falseVerify(this) class='btn btn-danger'>駁回</button>   </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
					$specifyTd.eq(0).text(tableData[i].code);
					$specifyTd.eq(1).text(tableData[i].name);
					$specifyTd.eq(2).text(tableData[i].riskReturn);
					$specifyTd.eq(3).text(tableData[i].description);
					$specifyTd.eq(4).append(tableData[i].link);
					$specifyTd.eq(5).append(checkEnabled(tableData[i].active));
					$('#productTable tr').find('button')[i*2+1].name = i;
					$('#productTable tr').find('button')[i*2].name = i;




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


function passVerify(e){

	var pass ={
		"approveFlowIdList" : [storeData[e.name].flowId]
	}
	
    // 發 API 通過 
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/verifyRequest",
		data: JSON.stringify(pass)
		,
		success : function(data, response, xhr) {
			bootsrapAlert("通過成功");
		
			listModifyProduct();				
		},
		error : function(xhr) {
	
			bootsrapAlert("err: " + xhr.status + ' '+ xhr.statusText);
			listModifyProduct();
		}
	});


}

function falseVerify(e){

	var falseIt ={
		"rejectFlowIdList" : [storeData[e.name].flowId]
	}
	
    // 發 API 通過 
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/verifyRequest",
		data: JSON.stringify(falseIt)
		,
		success : function(data, response, xhr) {
			bootsrapAlert("駁回成功");
		
			listModifyProduct();				
		},
		error : function(xhr) {

			bootsrapAlert("err: " + xhr.status + ' '+ xhr.statusText);	
			listModifyProduct();
		}
	});

	// 重新整理
	listModifyProduct();

}

