$(function() {
	$("#submitBtn").click(function () {
		productNameValidate();
    });
	
	/*搜尋商品*/
	$("#submitBtnSearch").click(function() {
		$("#buId_text").val("");
		$("#oldProductId").val("");
		$("#newProductId").val("");
		$("#productName").val("");
		$("#productDescribe").val("");
		$("#url").val("");

		if($("#productNameSearch").val()=="All"){
			$("#productNameSearch").val("");
			searchProduct($("#buId").find(":selected").val());
		}else{
			searchProduct($("#buId").find(":selected").val());
			$("#productNameSearch").val("");
		}
	});	

});


// var hahaha = {
// 	"modifyType" : "Add",       // 請求類型。'Add' = 新增商品, 'Update' = 修改商品。(Required)
// 	"code": "009323",            // 金融商品代碼 (Required)
// 	"name": "不喜歡科技",  // 金融商品名稱 (Required)
// 	"riskReturn": "RR4",        // 商品風險等級，有五種值 'RR1', 'RR2', 'RR3', 'RR4', 'RR5' (Required)
// 	"description": "國內第一檔真正「直接」投資於中國A股的ETF",    // 金融商品描述
// 	"link": "https://www.FubonETF/Funds/Profile.aspx?stock=0052", // 金融商品介紹外部連結URL
// 	"active": true             // 是否被啟用？(True: 啟用)(Required)
// }

// // modify request  ------------------------------------
// $.ajax({
// 	type : "POST",
// 	contentType : 'application/json',
// 	url : fubon.contextPath+"product/modifyRequest",
// 	data: JSON.stringify(hahaha)
// 	,
// 	success : function(data, response, xhr) {
// 		bootsrapAlert("修改成功");
// 		console.log(data)							
// 	},
// 	error : function(xhr) {
// 		console.log(xhr)	
// 		bootsrapAlert("err: " + xhr.status + ' '
// 			+ xhr.statusText);
// 	}
// });
// // -----------------------------------------------



/*如果切換ID 下面 role表格也要改變*/
$("#buId").change(function () {
    var str = "";
    $( "#buId option:selected" ).each(function() {
      str += $( this ).val();
    });
    
    $("#buId_text").val("");
	$("#oldProductId").val("");
	$("#newProductId").val("");
	$("#productName").val("");
	$("#productDescribe").val("");
	$("#url").val("");

    searchProduct(str);
  })
  .change();

function selectProduct(product){
	var modifyRequest = product.modifyRequest; // 已經修改正在等待覆核的 "商品修改請求"

	$("#buId_text").val($("#buId").find(":selected").val());

	if (modifyRequest != null){
		$('#oldProductId').val(modifyRequest.oldCode);
		$('#newProductId').val(modifyRequest.newCode);
		$('#RiskReturn').val(modifyRequest.riskReturn);
		$('#productName').val(modifyRequest.name);
		$('#productDescribe').val(modifyRequest.description);
		$('#url').val(modifyRequest.link);
		$("#startCheckBox").prop("checked", modifyRequest.active);
	}
	else {
		$('#oldProductId').val(product.Code);
		$('#newProductId').val(product.Code);
		$('#RiskReturn').val(product.RiskReturn);
		$('#productName').val(product.Name);
		$('#productDescribe').val(product.Description);
		$('#url').val(product.Link);
		$("#startCheckBox").prop("checked", product.Active);
	}

    var $button = $("#submitBtn");
    $button.off();
    $button.click(function() {
    	var oldCode = $("#oldProductId").val();
		var newCode = $("#newProductId").val();
		if (oldCode != newCode) {
			var message = "您確定要將商品代碼從 " + oldCode + " 改成 " + newCode + " 嗎?";
			BootstrapDialog.confirm({
				type: "type-danger",
				title: "警告",
				message: message,
				cssClass: 'delete-row-dialog',
				closable: false,
				callback: function(result) {
					if (result) {
						sendModifyRequest();
					}
				}
			});
		}
		else {
			sendModifyRequest();
		}
    });
}

function sendModifyRequest() {
	if(productNameValidate()){
		var $bu = $("#buId option:selected");
		/*修改商品*/
		var updatedProduct = {
			"modifyType" : "Update",
			"oldCode":$("#oldProductId").val(),
			"newCode":$("#newProductId").val(),
			"name":$("#productName").val(),
			"riskReturn" :$("#RiskReturn :selected").text(),
			"description":$("#productDescribe").val(),
			"link":$("#url").val(),
			"active":$("#startCheckBox").prop("checked")
		};

		$.ajax({
			type : "POST",
			contentType : 'application/json',
			url : fubon.contextPath+"product/modifyRequest",
			data : JSON.stringify(updatedProduct),
			beforeSend : function() {
				$("#submitBtn").prop("disabled", true);
			},
			success : function(data, response, xhr) {
				console.log(data);

				if(data.Status === "Error"){
					if (data.Detail.includes("is existed")){
						bootsrapAlert("已有其它商品使用這個商品代碼，不能進行修改商品變更");
					}
					else {
						bootsrapAlert(data.Detail);
					}
					return;
				}

				bootsrapAlert("修改商品已送出");
				/*把表單清空*/
				var all_Inputs = $("input[type=text]");
				all_Inputs.val("");
				$("#productDescribe").val("");
				$("input[type='checkbox']").attr("checked", false);
				/*更新商品清單*/
				searchProduct($("#buId").find(":selected").val());
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
			},
			complete : function () {
				$("#submitBtn").removeAttr("disabled");
			}
		});
	}
}

/* 商品表格清單的 true or false picture*/
function checkEnabled(tf){
	if(tf){
		var result = "<span class=\"glyphicon glyphicon-ok\"></span>";
		return result
	}else{
		var result = "<span class=\"glyphicon glyphicon-remove\"></span>";
		return result
	}
}
/*用 Regular Expression 檢查使用者輸入內容*/
function productNameValidate() {
	var buid = $("#buId").find(":selected").val();
	var newProductId = $("#newProductId").val();
	var productName = $("#productName").val();
	var productDescribe = $("#productDescribe").val();
	var url = $("#url").val();
	// var label = $("#label").val();
	
	if(buid.trim()=="" ){
		bootsrapAlert("請點選欲修改商品的單位代碼");
    	return false;
	}
	if(newProductId.trim() == "" || !REproductID.test(newProductId)){
		bootsrapAlert("請填寫正確格式的商品代碼");
    	return false;
	}
    // if(!REproductID.test(label)){
    //     bootsrapAlert("欲新增的註記最大長度為20，可含英文或數字");
    //     return false;
    // }
	if(productName.trim()==""){
    	bootsrapAlert("請填寫商品名稱");
    	return false;
    }
	
	if(productDescribe.trim()==""){
    	bootsrapAlert("請填寫商品說明");
    	return false;
    }
	
	if(!REproductName.test(productName)){
    	bootsrapAlert("欲修改的商品名稱最大長度為50，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
    }
	//if(!REproductDesc.test(productDescribe)){
	if (productDescribe.trim().length>500){
    	bootsrapAlert("欲修改的商品說明最大長度為500");
    	return false;
    }
	
	if(!REusl.test(url)){
    	bootsrapAlert("請輸入正確連結網址(EX:https://www.fubon.com/financialholdings/home/index.html)");
    	return false;
    }

	return true;
}

/*搜尋商品*/
function searchProduct(buId){
	var searchproduct = {"Keyword":$("#productNameSearch").val(),"buId":buId};
	
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
			}else{
				var productData = data.Data;
				var tableData =productData.Products;
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				for(var i=0; i<tableData.length;i++){
					var product = tableData[i];
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');

                    var clickHandler = function(p) {
                      return function() {
                          selectProduct(p);
                      }
                    };

					var modifyRequest = product.modifyRequest; // 已經修改正在等待覆核的 "商品修改請求"
					var code = (modifyRequest != null ? modifyRequest.newCode : product.Code);
					var $codeLink = $("<a/>").attr("href", "#").html(code);
                    $codeLink.click( clickHandler(product) );

					$specifyTd.eq(0).append($codeLink);

					if (modifyRequest != null){
						//region 如果有修改到現有商品代碼，顯示紅色警示訊息
						if (modifyRequest.modifyType == "Update" && modifyRequest.newCode != modifyRequest.oldCode) {
							$specifyTd.eq(0).append('<div class="alert-danger">舊 : ' + modifyRequest.oldCode + ', 新 : ' + modifyRequest.newCode + '</div>');
						}
						//endregion

						$specifyTd.eq(1).text(modifyRequest.name);
						$specifyTd.eq(2).text(modifyRequest.riskReturn);
						$specifyTd.eq(3).text(modifyRequest.description);

						var href = $("<a/>", {
							href : modifyRequest.link,
							text : modifyRequest.link,
							target: "_blank"
						});
						$specifyTd.eq(4).append(href);
						$specifyTd.eq(5).append(checkEnabled(modifyRequest.active));
						$specifyTd.eq(6).text("審核中");
					}
					else {
						$specifyTd.eq(1).text(product.Name);
						$specifyTd.eq(2).text(product.RiskReturn);
						$specifyTd.eq(3).text(product.Description);

						var href = $("<a/>", {
							href : product.Link,
							text : product.Link,
							target: "_blank"
						});
						$specifyTd.eq(4).append(href);
						$specifyTd.eq(5).append(checkEnabled(product.Active));
						$specifyTd.eq(6).text("無");
					}
				}
				
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
		}	
	});
}

