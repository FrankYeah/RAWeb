searchProduct('0001');

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
	console.log(BUID)
	var searchproduct = {"SearchName":'',"BUID":'0001'}
	console.log(searchproduct)
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
					var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td > </td><td> </td><td style='vertical-align: middle; width: 150px;'><button style='margin-right: 5px;' onClick=passVerify(this) class='wn btn btn-primary'>通過</button><button onClick=falseVerify(this) class='btn btn-danger'>駁回</button>   </td></tr>";
					$('#productTable').append(str);
					var $specifyTd = $('#productTable tr:last').find('td');
					var href = $("<a>", {
						href : tableData[i].Link,
						text : tableData[i].Link,
						target: "_blank"
					});
					$specifyTd.eq(0).text(tableData[i].Code);
					$specifyTd.eq(1).text(tableData[i].Name);
					$specifyTd.eq(2).text(tableData[i].RiskReturn);
					$specifyTd.eq(3).text(tableData[i].Description);
					$specifyTd.eq(4).append(href);
					$specifyTd.eq(5).append(checkEnabled(tableData[i].Active));
					$('#productTable tr').find('button')[i*2+1].name = i;
					$('#productTable tr').find('button')[i*2].name = i;
					
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





function passVerify(e){
	console.log(e.name)
    // 發 API 通過 



	// 重新整理

}

function falseVerify(e){
	console.log(e.name)
    // 發 API 駁回 


	// 重新整理

}

// $.ajax({
// 	type : "POST",
// 	contentType : 'application/json',
// 	url : fubon.contextPath+"product/searchProduct",
// 	data : JSON.stringify(searchproduct),
// 	success : function(data, response, xhr) {

// 		// 模擬假資料


// 		if(!IsJsonString(data)){
// 			// 告知發送 API 失敗
			
// 		}else{
// 			// 重整 list data
			
			
// 		}
		
// 	},
// 	error : function(xhr) {
// 		bootsrapAlert("err: " + xhr.status + ' '
// 				+ xhr.statusText);
// 	}	
// });