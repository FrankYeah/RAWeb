$(function() {
	/*搜尋商品*/
	$("#submitBtn").click(function() {
			if($("#productName").val()=="All"){
				$("#productName").val("");
				searchProductForSubmit($("#buId").find(":selected").val());
				$("#productName").val("");
			}else{
				searchProductForSubmit($("#buId").find(":selected").val());
				$("#productName").val("");
			}
	});	
});

/*如果切換ID 下面 role表格也要改變*/
$( "select" ).change(function () {
    var str = "";
    $( "select option:selected" ).each(function() {
      str += $( this ).val();
    });
    searchProduct(str);
  }).change();
  
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}


/*搜尋商品*/
function searchProduct(BUID){

	var searchproduct = {"SearchName":$("#productName").val(),"BUID":BUID}
	
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
				console.log(productData);
				var tableData =productData.Products;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();
				
				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td> </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
                    $specifyTd.eq(0).text(tableData[i].Type);
                    $specifyTd.eq(1).text(tableData[i].Label);
					$specifyTd.eq(2).text(tableData[i].Code);
					$specifyTd.eq(3).text(tableData[i].Name);
					$specifyTd.eq(4).text(tableData[i].Description);
					$specifyTd.eq(5).append(href);
					$specifyTd.eq(6).text(tableData[i].CreateTime);
					$specifyTd.eq(7).append(checkEnabled(tableData[i].Active));
					$specifyTd.eq(8).text(tableData[i].UpdateTime);
					
				}
				
			}
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

/*搜尋商品 For Submit*/
function searchProductForSubmit(BUID){

	var searchproduct = {"SearchName":$("#productName").val().trim(),"BUID":BUID}
	
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"product/searchProductForSubmit",
		data : JSON.stringify(searchproduct),
		success : function(data, response, xhr) {
			if(!IsJsonString(data)){
				$("#productTable").find("tr:gt(0)").remove();
				$( ".Msg" ).empty();
				$(".Msg").append(data);
				bootsrapAlert(data);
			}else{
				var temp = JSON.parse(data);
				var productData = JSON.parse(temp.Data);
				console.log(productData);
				var tableData =productData.Products;
				$( ".Msg" ).empty();
				$("#productTable").find("tr:gt(0)").remove();
				$("#buId").find(":selected").val();
				for(var i=0; i<tableData.length;i++){
					var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
                    $specifyTd.eq(0).text(tableData[i].Type);
                    $specifyTd.eq(1).text(tableData[i].Label);
					$specifyTd.eq(2).text(tableData[i].Code);
					$specifyTd.eq(3).text(tableData[i].Name);
					$specifyTd.eq(4).text(tableData[i].Description);
					$specifyTd.eq(5).append(href);
					$specifyTd.eq(6).text(tableData[i].CreateTime);
					$specifyTd.eq(7).append(checkEnabled(tableData[i].Active));
					$specifyTd.eq(8).text(tableData[i].UpdateTime);
					
				}
				
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

/*
function productNameValidate() {
	var productName = $("#productName").val();
	
	if (productName.trim() == null || productName.trim() == "") {
		bootsrapAlert("請輸入商品代碼/名稱");
		return false;
	} 
	
	return true;
}*/


