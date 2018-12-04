$(function() {
	//載入畫面傳入現在的BU列表
	getBUList();
	$("#submitBtn").click(function() {
		if(buInputValidate()){
			var addBU={"BUID":$("#buId").val(),"BUName":$("#buName").val()+","+$("#originbuName").val(),"DBName":$("#dbName").val()+","+$("#origindbName").val()}
			//var addBU={"BUID":$("#buId").val(),"BUName":$("#buName").val()+","+$("#originbuName").val()}
			/*修改BU*/
				$.ajax({
					type : "POST",
					contentType : 'application/json',
					url : fubon.contextPath+"roleManage/BU/modifyBU",
					data : JSON.stringify(addBU),
					success : function(data, response, xhr) {
						var temp = JSON.parse(data);
						if(!temp.Status){
							bootsrapAlert(temp.ExceptionMessage);
						}else{
						
							$("#buId").val("");
							$("#buName").val("");
							$("#dbName").val("");
							bootsrapAlert("修改成功");
						}
						getBUList();
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
		url : fubon.contextPath+"roleManage/BU/listBU",
		success : function(data, response, xhr) {			
			var temp = JSON.parse(data);
			var buData = JSON.parse(temp.Data);
			var tableData = buData.BUs;
			console.log(tableData);
			$("#buTable").find("tr:gt(0)").remove();
			for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td></tr>";
				$('#buTable').append(str);
				
				var h = $("<a>", {
					href : "#",
					text : tableData[i].BUID,
					onclick:"sendHref('"+ tableData[i].BUID+"','"+tableData[i].BUName+"','"+tableData[i].DBName+"')"
				});
			
				var $specifyTd = $('#buTable tr:last').find('td');
				$specifyTd.eq(0).append(h);
				$specifyTd.eq(1).text(tableData[i].BUName);
				$specifyTd.eq(2).text(tableData[i].DBName);
				//$("#buId").append("<option>"+tableData[i].BUID+"</option>");
			}
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
	
}

function sendHref(buId,buName,dbName){
	$("#buId").val(buId);
	$("#buName").val(buName);
	$("#originbuName").val(buName);
	if (dbName =="undefined"){
		$("#dbName").val("");
		$("#origindbName").val("");
	}else{
		$("#dbName").val(dbName);
		$("#origindbName").val(dbName);
	}
	
}

function buInputValidate() {
	
	var buId = $("#buId").val();
	var buName = $("#buName").val();
	var dbName = $("#dbName").val();

    if(!REbuid.test(buId)){
    	bootsrapAlert("請選擇欲修改的單位 ID");
    	return false;
    }
    if(!REbuName.test(buName)){
    	bootsrapAlert("欲修改的單位名稱最大長度為100，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
    }
    if(!REdbName.test(dbName)){
    	bootsrapAlert("欲修改的API代碼最大長度為20，可含英文和數字");
    	return false;
    }
	if (buName == null || buName == "" || dbName == "" || buId == null || buId == "") {
		bootsrapAlert("請輸入欲修改的單位ID/名稱/資料庫名稱");
		return false;
	} 
	
	return true;
}
