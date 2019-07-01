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
				var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td style='vertical-align: middle; width: 150px;'><button style='margin-right: 5px;' onClick=passVerify(this) class='wn btn btn-primary'>通過</button><button onClick=falseVerify(this) class='btn btn-danger'>駁回</button></td></tr>";
				$('#productTable').append(str);
				var $specifyTd = $('#productTable tr:last').find('td');
				var href = $("<a>", {
					href : tableData[i].link,
					text : tableData[i].link,
					target: "_blank"
				});
				$specifyTd.eq(0).text(tableData[i].newCode);

				//region 如果有修改到現有商品代碼，顯示紅色警示訊息
				if (tableData[i].modifyType == "Update" && tableData[i].newCode != tableData[i].oldCode) {
					$specifyTd.eq(0).append('<div class="alert-danger">舊 : ' + tableData[i].oldCode + ', 新 : ' + tableData[i].newCode + '</div>');
				}
				//endregion

				$specifyTd.eq(1).text(tableData[i].name);
				$specifyTd.eq(2).text(tableData[i].riskReturn);
				$specifyTd.eq(3).text(tableData[i].description);
				$specifyTd.eq(4).append(href);
				$specifyTd.eq(5).append(checkEnabled(tableData[i].active));
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
    var modifyType = storeData[e.name].modifyType;
    var oldCode = storeData[e.name].oldCode;
    var newCode = storeData[e.name].newCode;
    if (modifyType == 'Update' && oldCode != newCode) { // 有修改到現有商品代碼，要跳確認視窗讓覆核人員再次確認
        var message = "商品代碼將從 " + oldCode + " 改成 " + newCode + "，您確定覆核通過嗎?";
        BootstrapDialog.confirm({
            type: "type-danger",
            title: "警告",
            message: message,
            cssClass: 'delete-row-dialog',
            closable: false,
            callback: function(result) {
                if (result) {
                    sendApproveVerifyRequest(e);
                }
            }
        });
    }
    else {
        sendApproveVerifyRequest(e);
    }
}

function sendApproveVerifyRequest(e) {
    var pass ={
        "approveFlowIdList" : [storeData[e.name].flowId]
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
		"rejectFlowIdList" : [storeData[e.name].flowId]
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

