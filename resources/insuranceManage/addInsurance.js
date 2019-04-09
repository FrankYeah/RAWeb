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
				url : fubon.contextPath+"insuranceManage/modify",
				data : JSON.stringify(product),
				success : function(data, response, xhr) {
					console.log(data)

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
					                 window.location.href = fubon.contextPath+'InsuranceManage/SearchInsurance';
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


function fileValidate() {
    var extension = $('#file').val().split('.').pop().toLowerCase();
    if($.inArray(extension, ['xlsx']) == -1) {
        bootsrapAlert('請上傳正確的檔案格式');
        return false;
    }else{
        return true;
    }
};