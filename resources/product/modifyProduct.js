$(function() {

	$("#submitBtn").click(function () {

        var productID = $("#productID").val();
        if (productID==""){
        	bootsrapAlert("請選擇欲修改的商品代碼");
        }
    	
    });
	
	/*搜尋商品*/
	$("#submitBtnSearch").click(function() {
		 $("#buId_text").val("");
			$("#productID").val("");
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

/*如果切換ID 下面 role表格也要改變*/
$("#buId").change(function () {
    var str = "";
    $( "#buId option:selected" ).each(function() {
      str += $( this ).val();
    });
    
    $("#buId_text").val("");
	$("#productID").val("");
	$("#productName").val("");
	$("#productDescribe").val("");
	$("#url").val("");

    searchProduct(str);
  })
  .change();
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
	var code = product.Code;
	  
	  
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data: {"productCode":code,"buid":$("#buId").find(":selected").val()},
		url : fubon.contextPath+"product/findProduct",
		success : function(data, response, xhr) {
			
			if(!IsJsonString(data)){
				bootsrapAlert(data);
			}else{
				var productData = JSON.parse(JSON.parse(data).Data);
				$("#buId_text").val($("#buId").find(":selected").val());
                $('#type').val(productData.Type);
                $('#label').val(productData.Label);
				$('#productID').val(productData.Code);
				$('#productName').val(productData.Name);
				$('#productDescribe').val(productData.Description);
				$('#url').val(productData.Link);
				$("#startCheckBox").prop("checked", productData.Active);
			}

		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});

    var $button = $("#submitBtn");
    $button.off();
    $button.click(function() {
        if(productNameValidate()){
            var $bu = $("#buId option:selected");
            /*修改商品*/
            var updatedProduct = {"BUID": $bu.val(), "BUName": $bu.attr("buname"),
                "Code":$("#productID").val(),
                "Name":$("#productName").val(),
                "Description":$("#productDescribe").val(),
                "Link":$("#url").val(),
                "Active":$("#startCheckBox").prop("checked"),
                "Type" :$("#type :selected").text(),
                "Label":$("#label").val()
			};
            var ajaxData = {updated: updatedProduct, origin: product};
            $.ajax({
                type : "POST",
                contentType : 'application/json',
                url : fubon.contextPath+"product/modifyProduct",
                data : JSON.stringify(ajaxData),
                success : function(data, response, xhr) {
                    var data = JSON.parse(data);
                    bootsrapAlert("商品修改成功");
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
                }
            });
        }
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
	var buid = $("#buId").find(":selected").val();
	var productID = $("#productID").val();
	var productName = $("#productName").val();
	var productDescribe = $("#productDescribe").val();
	var url = $("#url").val();
	var label = $("#label").val();
	
	if(buid.trim()=="" ){
		bootsrapAlert("請點選欲修改商品的單位代碼");
    	return false;
	}
	if( !REproductID.test(productID)){
		bootsrapAlert("請點選欲修改的商品代碼");
    	return false;
	}
    if(!REproductID.test(label)){
        bootsrapAlert("欲新增的註記最大長度為20，可含英文或數字");
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
function searchProduct(BUID){
	var searchproduct = {"SearchName":$("#productNameSearch").val(),"BUID":BUID};
	
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/searchProduct",
		data : JSON.stringify(searchproduct),
		success : function(data, response, xhr) {
			if(!IsJsonString(data)){
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				$(".Msg").append(data);
				if (BUID!=""){bootsrapAlert(data);}
			}else{
				var temp = JSON.parse(data);
				var productData = JSON.parse(temp.Data);
				var tableData =productData.Products;
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				for(var i=0; i<tableData.length;i++){
					var product = tableData[i];
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
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

					var $codeh = $("<a/>").attr("href", "#").html(product.Code);
                    $codeh.click( clickHandler(product) );

                    $specifyTd.eq(0).text(product.Type);
                    $specifyTd.eq(1).text(product.Label);
					$specifyTd.eq(2).append($codeh);
					$specifyTd.eq(3).text(product.Name);
					$specifyTd.eq(4).text(product.Description);
					$specifyTd.eq(5).append(href);
					$specifyTd.eq(6).text(product.CreateTime);
					$specifyTd.eq(7).append(checkEnabled(product.Active));
					$specifyTd.eq(8).text(product.UpdateTime);
					
				}
				
			}
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

