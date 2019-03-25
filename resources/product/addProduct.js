$(function() {
	$("#submitBtn").click(function() {

		if(productNameValidate()){
			/*新增商品*/
			var $bu = $("#buId option:selected");
			
			var product={
				"modifyType" : "Add",
                "code":$("#productID").val(),
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
				data : JSON.stringify(product),
				success : function(data, response, xhr) {
					if(data.Status === "Error"){
						if (data.Detail.includes("is existed")){
							bootsrapAlert("該項商品已存在，不能進行新增商品變更");
						}
						else {
							bootsrapAlert(data.Detail);
						}
						return;
					}

					bootsrapAlert("資料成功送出Ok");
					$("#productID").val("");
					$("#url").val("");
					$("#productDescribe").val("");
					$("#productName").val("");
                    $("input[type='checkbox']").attr("checked", false);

					// 發送 email  ------------------------------------
					$.ajax({
						type : "POST",
						contentType : 'application/json',
						url : fubon.contextPath+"product/sendVerifyNotify",
						data: {},
						success : function(data, response, xhr) {
							console.log(data)						
						},
						error : function(xhr) {
							bootsrapAlert("err: " + xhr.status + ' '
								+ xhr.statusText);
						}
					});
					// -----------------------------------------------

					listModifyRequest();
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
				}
			});
		}
	});

    $("#submitBtnUpload").click(function() {
        var file = $('#file')[0].files[0];
        console.log(file);
        if(file != null && file.size > 0 ){
            if(fileValidate()){
                var formData = new FormData();
                formData.append('file', file);
                $.ajax({
                    url : fubon.contextPath+"product/uploadForProduct",
                    type: 'POST',
                    cache: false,
                    data: formData,
                    processData: false,
                    contentType: false,
                    success : function(data, response, xhr) {
                        if(data.status){
                            $("#file").val(null);
                            bootsrapAlert("處理成功");
                        }else{
                            bootsrapAlert(data.exceptionMessage);
                        }
                    },
                    error : function(xhr) {
                        bootsrapAlert("err: " + xhr.status + ' '
                            + xhr.statusText);
                    }
                });
            }
        }else{
            bootsrapAlert("請上傳檔案");
		}
    });
});


/*用 Regular Expression 檢查使用者輸入內容*/
function productNameValidate() {
	
	var buid = $("#buId").find(":selected").val();
	
	if(typeof(buid)=="undefined"){
		bootsrapAlert("非此系統所屬單位,無法新增商品");
		return;
	}
	var productName = $("#productName").val();
	var productID = $("#productID").val();
	var productDescribe = $("#productDescribe").val();
	var url = $("#url").val();
	var label = $("#label").val();

	if(productID.trim()==""){
    	bootsrapAlert("請填寫商品代碼");
    	return false;
    }
	if(productName.trim()==""){
    	bootsrapAlert("請填寫商品名稱");
    	return false;
    }
	if(productDescribe.trim()==""){
    	bootsrapAlert("請填寫商品說明");
    	return false;
    }
	//check格式
	if(!REproductID.test(productID)){
    	bootsrapAlert("欲新增的商品代碼最大長度為20，可含英文或數字");
    	return false;
    }
    if(!REproductID.test(label)){
        bootsrapAlert("欲新增的註記最大長度為20，可含英文或數字");
        return false;
    }

	if(!REproductName.test(productName)){
    	bootsrapAlert("欲新增的商品名稱最大長度為50，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
    }
	//if(!REproductDesc.test(productDescribe)){
	if (productDescribe.trim().length>500){
    	bootsrapAlert("新增的商品說明最大長度為500");
    	return false;
    }
	if(!REusl.test(url)){
    	bootsrapAlert("請輸入正確連結網址，例如:https://www.fubon.com/financialholdings/home/index.html");
    	return false;
    }
	
	return true;
}


function fileValidate() {
    var extension = $('#file').val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['xlsx']) == -1) {
        bootsrapAlert('請上傳正確的檔案格式');
        return false;
    }else{
        return true;
    }
}

/**
 * 列出所有 "商品新增請求"
 */
function listModifyRequest(){
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/listModifyRequest",
		data : {},
		success : function(data, response, xhr) {
			$( ".Msg" ).empty();
			$("#productTable").find("tr:gt(0)").remove();

			if(data.Status === "Error"){
				$(".Msg").append(data);
				bootsrapAlert(data.Detail);
				return;
			}

			var modifyRequestList = data.Data.modifyRequestList.filter(function (modifyRequest) {
				return modifyRequest.modifyType === "Add";
			});// 只需要 "商品新增請求" 的資料
			var tableData = modifyRequestList;

			for(var i=0; i < tableData.length;i++){
				var modifyRequest = tableData[i];
				var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td> </td></tr>";
				$('#productTable').append(str);
				var $specifyTd = $('#productTable tr:last').find('td');

				var $codeLink = $("<a/>").attr("href", "#").html(modifyRequest.code);
				var clickHandler = function(modifyRequest) {
					return function() {
						selectModifyRequest(modifyRequest);
					}
				};
				$codeLink.click(clickHandler(modifyRequest));
				$specifyTd.eq(0).append($codeLink);

				$specifyTd.eq(1).text(modifyRequest.name);
				$specifyTd.eq(2).text(modifyRequest.riskReturn);
				$specifyTd.eq(3).text(modifyRequest.description);
				var href = $("<a>", {
					href : modifyRequest.link,
					text : modifyRequest.link,
					target: "_blank"
				});
				$specifyTd.eq(4).append(href);
				$specifyTd.eq(5).append(checkEnabled(modifyRequest.active));
				$specifyTd.eq(6).text("審核中");
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
		}
	});
}

function checkEnabled(isProductActive){
	if(isProductActive){
		var result = "<span class=\"glyphicon glyphicon-ok\"></span>";
		return result
	}else{
		var result = "<span class=\"glyphicon glyphicon-remove\"></span>";
		return result
	}
}

/**
 * 挑選之前改過的 "商品新增請求"
 *
 * @param modifyRequest
 */
function selectModifyRequest(modifyRequest){
	$('#productID').val(modifyRequest.code);
	$('#productName').val(modifyRequest.name);
	$('#RiskReturn').val(modifyRequest.riskReturn);
	$('#productDescribe').val(modifyRequest.description);
	$('#url').val(modifyRequest.link);
	$("#startCheckBox").prop("checked", modifyRequest.active);
}