$(function() {
	$("#submitBtn").click(function () {

        var productID = $("#productID").val();
        if (productID==""){
        	bootsrapAlert("請選擇欲修改的商品代碼");
        }
    	
    });
});

searchProduct($("#buId").val());

/*確認是否為 json object*/  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/*將要修改的資訊用ajax去後端跟api要資料*/	
function selectProduct(product){
	$('#productID').val(product.code);
	$('#productName').val(product.name);
	$("#startCheckBox").prop("checked", product.isActive);
	$('#RiskReturn').val(product.kypGroup);
	$('#isProduct').val(product.isProject + '');

    var $button = $("#submitBtn");
    $button.off();
    $button.click(function() {

					/*新增險種*/
					var boalean;
					if($("#isProduct :selected").val() == 'false'){
						boalean = false;
					}else{
						boalean = true;
					}
					var product={
						"modifyType" : "Update", // 請求類型。'Add' = 新增商品, 'Update' = 修改商品。(Required)
						"code": $("#productID").val(), // 商品代碼 (Required)
						"name": $("#productName").val(), // 商品名稱 (Required)
						"kypGroup": $("#RiskReturn :selected")[0].value, // KYP組別，有這儿種值 '1', '2', '3', '4', '5', '6', null 
						"isProject": boalean, // 是否為專案商品 (Required)
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
								bootsrapAlert('險種修改失敗');
							}else{
								 BootstrapDialog.show({
									 type :BootstrapDialog.TYPE_PRIMARY,
									 closable: false,
									 title: '訊息',
									 message: "險種修改成功",
									 buttons: [{
										 label: 'Close',
										 action: function(dialogRef){
											 dialogRef.close();
											 window.location.href = fubon.contextPath+'InsuranceManage/ModifyInsurance';
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



    });

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
	var productID = $("#productID").val();
	var productName = $("#productName").val();
	var productDescribe = $("#productDescribe").val();
	var url = $("#url").val();
	// var label = $("#label").val();

	if( !REproductID.test(productID)){
		bootsrapAlert("請點選欲修改的商品代碼");
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
	// $("#productTable").empty();

	var listProduct = {"buId": buId};

	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"insuranceManage/list",
		data : JSON.stringify(listProduct),
		success : function(data, response, xhr) {
				console.log(data)

				var tableData = data.Data.insuranceList
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				for(var i=0; i<tableData.length;i++){
					var product = tableData[i];
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a/>", {
						href : product.Link,
						text : product.Link,
						target: "_blank"
					});
					// var $codeh = $("<a/>", {
					// 	href : "#",
					// 	text : product.Code,
					// 	onclick:"sendAjax('"+ product.Code+"')"
					// });

                    var clickHandler = function(p) {
                      return function() {
						  selectProduct(p);

                      }
                    };

					var $codeh = $("<a/>").attr("href", "#").html(product.code);
                    $codeh.click( clickHandler(product) );

					$specifyTd.eq(0).append($codeh);
					$specifyTd.eq(1).text(product.name);
					$specifyTd.eq(2).text(product.kypGroup);
					$specifyTd.eq(3).append(checkEnabled(product.isProject));
					$specifyTd.eq(4).append(checkEnabled(product.isActive));
					$specifyTd.eq(5).text(product.updateTime);
				}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

