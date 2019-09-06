$(function() {

	$("#submitBtn").click(function() {
		
		if(productNameValidate()){
			var isProject;
			if($("#isPrdruct :selected").val()== 'false'){
				isProject = false;
			}else{
				isProject = true;
			}

			var kypGroup = $("#RiskReturn :selected").val();
			if (kypGroup == "null") {
				kypGroup = null;
			}

			var product={
				"modifyType" : "Add", // 請求類型。'Add' = 新增商品, 'Update' = 修改商品。(Required)
				"code": $("#productID").val(), // 商品代碼 (Required)
				"name": $("#productName").val(), // 商品名稱 (Required)
				"kypGroup": kypGroup, // KYP組別，有這儿種值 '1', '2', '3', '4', '5', '6', null
				"isProject": isProject, // 是否為專案商品 (Required)
				"isActive": $("#startCheckBox").prop("checked") // 商品是否啟用 (Required)
			};

			$.ajax({
				type : "POST",
				contentType : 'application/json',
				url : fubon.contextPath+"insuranceManage/modifyRequest",
				data : JSON.stringify(product),
				success : function(data, response, xhr) {
					listModifyRequest()

					if(data.Status == 'Error'){
						bootsrapAlert('險種新增失敗.' + data.Detail);
					}else{
						 BootstrapDialog.show({
							 type :BootstrapDialog.TYPE_PRIMARY,
							 closable: false,
							 title: '訊息',
					         message: "險種新增成功",
					         buttons: [{
					             label: 'Close',
					             action: function(dialogRef){
					                 dialogRef.close();
					                //  window.location.href = fubon.contextPath+'InsuranceManage/SearchInsurance';
					             }
					         }]
					     });
					}
				},
				error : function(xhr) {
					console.log(xhr)
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}
			});
		}
	});




	listModifyRequest()
/**
 * 列出所有 "險種新增請求"
 */
function listModifyRequest(){
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/listModifyRequest",
		data : {},
		success : function(data, response, xhr) {
			$( ".Msg" ).empty();
			$("#insuranceTable").find("tr:gt(0)").remove();

			if(data.Status === "Error"){
				$(".Msg").append(data);
				bootsrapAlert(data.Detail);
				return;
			}

			var modifyRequestList = data.Data.modifyRequestList.filter(function (modifyRequest) {
				return modifyRequest.modifyType === "Add";
			});// 只需要 "險種新增請求" 的資料
			var tableData = modifyRequestList;

			for(var i=0; i < tableData.length;i++){
				var modifyRequest = tableData[i];
				var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td> </td></tr>";
				$('#insuranceTable').append(str);
				var $specifyTd = $('#insuranceTable tr:last').find('td');

				var $codeLink = $("<a/>").attr("href", "#").html(modifyRequest.code);
				var clickHandler = function(modifyRequest) {
					return function() {
						selectModifyRequest(modifyRequest);
					}
				};
				$codeLink.click(clickHandler(modifyRequest));
				$specifyTd.eq(0).append($codeLink);

				$specifyTd.eq(1).text(modifyRequest.name);
				$specifyTd.eq(2).text(modifyRequest.kypGroup);
				$specifyTd.eq(3).text(modifyRequest.isProject);
				// var href = $("<a>", {
				// 	href : modifyRequest.link,
				// 	text : modifyRequest.link,
				// 	target: "_blank"
				// });
				$specifyTd.eq(4).text(modifyRequest.isActive);
				$specifyTd.eq(5).text(modifyRequest.updateTime);
				// $specifyTd.eq(5).append(checkEnabled(modifyRequest.active));
				$specifyTd.eq(6).text("審核中");
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
		}
	});
}



});


/*用 Regular Expression 檢查使用者輸入內容*/
function productNameValidate() {
	var productName = $("#productName").val();
	var productID = $("#productID").val();
	var productDescribe = $("#productDescribe").val();
	var url = $("#url").val();
	var label = $("#label").val();

	if(productID.trim()==""){
    	bootsrapAlert("請填寫險種代碼");
    	return false;
    }
	if(productName.trim()==""){
    	bootsrapAlert("請填寫險種名稱");
    	return false;
    }
	//check格式
	if(!REproductID.test(productID)){
    	bootsrapAlert("欲新增的險種代碼最大長度為20，可含英文或數字");
    	return false;
    }
    if(!REproductID.test(label)){
        bootsrapAlert("欲新增的註記最大長度為20，可含英文或數字");
        return false;
    }

	if(!REproductName.test(productName)){
    	bootsrapAlert("欲新增的險種名稱最大長度為50，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
    }
	//if(!REproductDesc.test(productDescribe)){

	
	return true;
}

function selectModifyRequest(modifyRequest){
	$('#productID').val(modifyRequest.code);
	$('#productName').val(modifyRequest.name);
	$('#RiskReturn').val(modifyRequest.kypGroup);
	$('#isPrdruct').val(modifyRequest.isProject + '');
	// $('#productDescribe').val(modifyRequest.isProject);
	$("#startCheckBox").prop("checked", modifyRequest.isActive);
}