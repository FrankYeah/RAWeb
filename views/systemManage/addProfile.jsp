<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/system/common.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>appprofile - showAppprofile</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">

<jsp:include page="title.jsp"></jsp:include>
<br>
<br>
<br>
<br>
<form id="productForm">

	<label for="appName" class="control-label col-sm-6"> 應用程式設定檔名稱:</label>
	<label for="apiKey" class="control-label col-sm-6"> APIKEY:</label>
	<div class="col-sm-6 form-group">
		<input type="text" id="appName" name="appName" class="form-control" />
	</div>
	<div class="col-sm-6 form-group">
		<input type="text" id="apiKey" name="apiKey" class="form-control" />
	</div>

	<label for="jdbcUrl" class="control-label col-sm-12"> JDBC網址:</label>
	<div class="col-sm-12 form-group">
		<input type="text" id="jdbcUrl" name="jdbcUrl" class="form-control"/>
	</div>
	<label for="dbAccount" class="control-label col-sm-6"> DB帳號:</label>
	<label for="dbPassword" class="control-label col-sm-6"> DB密碼:</label>
	<div class="col-sm-6 form-group">
		<input type="text" id="dbAccount" name="dbAccount" class="form-control"/>
	</div>
	<div class="col-sm-6 form-group">
		<input type="text" id="dbPassword" name="dbPassword" class="form-control"/>
	</div>
	<div class="col-sm-6" style="align:left">
		<button id="submitBtn" type="button" class="btn btn-primary">新增</button>
	</div>
</form>
<script type="text/javascript">
$(function() {
	/*新增商品*/
	$("#submitBtn").click(function() {
	    if(validateInput()){
            addAppProfile();
        }
	});
});

function addAppProfile() {
	/*新增app profile*/
	var product={
		"appName": $('#appName').val(),
		"apiKey": $('#apiKey').val(),
		"jdbcUrl":$("#jdbcUrl").val(),
		"dbAccount":$("#dbAccount").val(),
		"dbPassword":$("#dbPassword").val(),
		};
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		url : fubon.contextPath+"SystemManage/addForProfile",
		data : JSON.stringify(product),
		success : function(data, response, xhr) {
			if(!data.status){
				bootsrapAlert(data.exceptionMessage);
			}else{
				BootstrapDialog.show({
					type :BootstrapDialog.TYPE_PRIMARY,
					closable: false,
					title: '訊息',
					message: "應用程式設定處理成功",
					buttons: [{
						label: 'Close',
						action: function(dialogRef){
							dialogRef.close();
							window.location.href = fubon.contextPath+'SystemManage/SearchProfile';
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

/* 檢核輸入資料合理性 */
function validateInput(){
    var appName = $('#appName').val();
	var apiKey = $('#apiKey').val();
	var jdbcUrl = $('#jdbcUrl').val();
	var dbAccount = $('#dbAccount').val();
	var dbPassword = $('#dbPassword').val();

    //檢核格式
    if(!REName.test(appName)){
        bootsrapAlert("應用程式設定檔名稱最大長度為24,僅限英文,數字,點(.),底線(_),連結線(-)");
        return false;
    }
    if(!REString.test(apiKey)){
        bootsrapAlert("API Key僅限英文,數字,點(.),底線(_),連結線(-)");
        return false;
    }
    if(!REJdbcUrl.test(jdbcUrl)){
        bootsrapAlert("jdbcUrl格式有誤");
        return false;
    }
    if(!REString.test(dbAccount)){
        bootsrapAlert("DB帳號僅限英文,數字,點(.),底線(_),連結線(-)");
        return false;
    }
    if(!REString.test(dbPassword)){
        bootsrapAlert("DB密碼僅限英文,數字,點(.),底線(_),連結線(-)");
        return false;
    }

    return true;
}
</script>
<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>
</body>
</html>