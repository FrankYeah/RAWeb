$(function() {
//載入畫面傳入現在的BU列表
getBUList();
	$("#submitBtn").click(function() {
		if(buInputValidate()){
			var addBU={"BUID":$("#buId").val(),
					"BUName":$("#buName").val(),
					"DBName":$("#dbName").val()}
			/*新增BU*/
			$.ajax({
				type : "POST",
				contentType : 'application/json',
				url : fubon.contextPath+"roleManage/BU/addBU",
				data : JSON.stringify(addBU),
				success : function(data, response, xhr) {
					var data = JSON.parse(data);
					if(!data.Status){
						bootsrapAlert(data.ExceptionMessage);
					}else{
						bootsrapAlert("新增成功");
						$("#buId").val("");
						$("#buName").val("");
						$("#dbName").val("");
						getBUList();
					}
					
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}	
			});
		}
	});	
});

function getBUList(){
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		url :fubon.contextPath+"roleManage/BU/listBU",
		success : function(data, response, xhr) {			
			var temp = JSON.parse(data);
			var buData = JSON.parse(temp.Data);
			var tableData = buData.BUs;
			console.log(tableData);
			$("#buTable").find("tr:gt(0)").remove();
			for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td></tr>";
				$('#buTable').append(str);
				var $specifyTd = $('#buTable tr:last').find('td');

				$specifyTd.eq(0).text(tableData[i].BUID);
				$specifyTd.eq(1).text(tableData[i].BUName);
				$specifyTd.eq(2).text(tableData[i].DBName);
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
	
}

function buInputValidate() {

	var buId = $("#buId").val();
	var buName = $("#buName").val();
	var dbName = $("#dbName").val();

    if(!REbuid.test(buId)){
    	bootsrapAlert("欲加入的單位代碼最大長度為10，可含英文或數字");
    	return false;
    }
    if(!REbuName.test(buName)){
    	bootsrapAlert("欲加入的單位名稱最大長度為100，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
    }
    if(!REdbName.test(dbName)){
    	bootsrapAlert("欲加入的API代碼最大長度為20，可含英文和數字");
    	return false;
    }
	if (buName == null || buName == "" || dbName == ""|| buId == null || buId == "") {
		bootsrapAlert("請輸入欲加入的單位ID/名稱/API代碼");
		return false;
	} 
	
	return true;
}