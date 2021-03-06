var storeData;

/*搜尋商品*/
function listModifyProduct(){

	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/listModifyRequest",
		data : {},
		success : function(data, response, xhr) {
			$( ".Msg" ).empty();
			$("#productTable").find("tr:gt(0)").remove();

			if(data.Status === "Error"){
				$(".Msg").append(data);
				bootsrapAlert(data.Detail);
				return;
			}

			var tableData = data.Data.modifyRequestList
			storeData = tableData;
			$("#buId").find(":selected").val();

			for(var i=0; i<tableData.length;i++){
				// console.log(tableData)
				var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td style='vertical-align: middle; width: 150px;'><button style='margin-right: 5px;' onClick=passVerify(this) class='wn btn btn-primary'>通過</button><button onClick=falseVerify(this) class='btn btn-danger'>駁回</button></td></tr>";
				$('#productTable').append(str);
				var $specifyTd = $('#productTable tr:last').find('td');

				// console.log(tableData[i])
				$specifyTd.eq(0).text(tableData[i].code);
				$specifyTd.eq(1).text(tableData[i].name);
				$specifyTd.eq(2).text(tableData[i].kypGroup);
				$specifyTd.eq(3).append(checkEnabled(tableData[i].isProject));
				$specifyTd.eq(4).append(checkEnabled(tableData[i].isActive));
				$specifyTd.eq(5).text(tableData[i].updateTime);
				$('#productTable tr').find('button')[i*2+1].name = i;
				$('#productTable tr').find('button')[i*2].name = i;
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

function passVerify(e){
	var pass ={
		"verify" : "Approve",
		"flowId" : storeData[e.name].flowId
	}

	// 發 API 通過
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/verifyRequest",
		data: JSON.stringify(pass),
		beforeSend : function() {
			$(e).prop("disabled", true);
		},
		success : function(data, response, xhr) {
			// console.log(data)
			if(data.Status === "Error"){
				bootsrapAlert(data.Detail);
				return;
			}
			bootsrapAlert("通過成功");
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '+ xhr.statusText);
		},
		complete : function () {
			listModifyProduct(); // 重新整理
		}
	});
}

function falseVerify(e){

	var falseIt ={
		"verify" : "Reject",
		"flowId" : storeData[e.name].flowId
	}
	
    // 發 API 通過 
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/verifyRequest",
		data: JSON.stringify(falseIt),
		beforeSend : function() {
			$(e).prop("disabled", true);
		},
		success : function(data, response, xhr) {
			// console.log(data)
			if(data.Status === "Error"){
				bootsrapAlert(data.Detail);
				return;
			}
			bootsrapAlert("駁回成功");
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '+ xhr.statusText);
		},
		complete : function () {
			listModifyProduct(); // 重新整理
		}
	});
}

