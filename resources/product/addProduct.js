$(function() {

	$("#submitBtn").click(function() {
		
		if(productNameValidate()){
			/*新增商品*/
			var $bu = $("#buId option:selected");
			
			var product={"BUID": $bu.val(), "BUName": $bu.attr("buname"),
                         "Code":$("#productID").val(),
		   				 "Name":$("#productName").val(),
						 "Description":$("#productDescribe").val(),
						 "Link":$("#url").val(),
						 "Active":$("#startCheckBox").prop("checked"),
						 "Type" :$("#type :selected").text(),
						 "Label":$("#label").val()
			};
			console.log(product)
			$.ajax({
				type : "POST",
				contentType : 'application/json',
				url : fubon.contextPath+"product/addProduct",
				data : JSON.stringify(product),
				success : function(data, response, xhr) {
					var data = JSON.parse(data);
					if(!data.Status){
						bootsrapAlert(data.ExceptionMessage);
					}else{
						 BootstrapDialog.show({
							 type :BootstrapDialog.TYPE_PRIMARY,
							 closable: false,
							 title: '訊息',
					         message: "商品新增成功",
					         buttons: [{
					             label: 'Close',
					             action: function(dialogRef){
					                 dialogRef.close();
					                 window.location.href = fubon.contextPath+'Product/SearchProduct';
					             }
					         }]
					     });
					}
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
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
};