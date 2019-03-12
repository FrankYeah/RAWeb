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

	<label for="appName" class="control-label col-sm-6"> 應⽤程式設定檔名稱:</label>
	<label for="apiKey" class="control-label col-sm-6"> API Key:</label>
	<div class="col-sm-6 form-group">
		<input type="text" id="appName" name=" " class="form-control" disabled/>
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
</form>
	<div class="col-sm-3" style="align:left">
		<button id="submitBtnModify" type="button" class="btn btn-primary">修改</button>
	</div>
	<label for="appNameForSearch" class="control-label col-sm-3"> 應⽤程式設定檔名稱 :</label>
	<div class="col-sm-3 form-group">
		<input type="text" id="appNameForSearch" name="appNameForSearch" class="form-control"/>
	</div>
	<div class="col-sm-3" style="align:left">
		<button id="submitBtn" type="button" class="btn btn-primary">搜尋</button>
	</div>

<div class="content-1">
	<div class="content-2">
		<table id ="userTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<th class="text-center">設定檔名稱</th><th class="text-center">JDBC網址</th><th class="text-center">DB帳號</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
		</table>
	</div>

</div>
<script type="text/javascript">
var datalist = new Object;

$(function() {
    searchProfile("");
	/*搜尋商品*/
	$("#submitBtn").click(function() {
		var appName = $('#appNameForSearch').val();
		if(appName.length > 0 && validateappName(appName)){
			searchProfile(appName);
		}else{
            searchProfile("");
		}
	});

    $("#submitBtnModify").click(function() {
        if(validateInput()){
            updateAppProfile();
		}
    });
});


/*用ID取資料*/
function searchProfile(appName){
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		data : JSON.stringify({"appName": appName}),
		url : fubon.contextPath+"SystemManage/searchForProfile",
		success : function(data, response, xhr) {
			$("#userTable").find("tr:gt(0)").remove();
			if (data.length==0){
				bootsrapAlert("此ID無相關資料！");
				var str = "<tr><td colspan='6'>此ID無相關資料！</td></tr>";
				$('#userTable').append(str);
			}else{
				for(var i = 0; i < data.length; i++){
                    datalist[data[i].appName] = data[i];
					var str = "<tr><td> </td><td> </td><td> </td>";
					$('#userTable').append(str);
					var $specifyTd = $('#userTable tr:last').find('td');
                    var appName = $("<a/>").attr("href", "#").html(data[i].appName).attr('id',i);
                    var clickHandler = function(p) {
                        return function() {
                            fillinput(p);
                        }
                    };
                    appName.click(clickHandler(data[i]));

                    $specifyTd.eq(0).append(appName);
					$specifyTd.eq(1).text(data[i].jdbcUrl);
					$specifyTd.eq(2).text(data[i].dbAccount);
				}
			}

		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
				+ xhr.statusText);
		}
	});
}

/*將Data填入表格*/
function fillinput(data) {
    $('#appName').val(data.appName);
    $('#apiKey').val(data.apiKey);
    $('#jdbcUrl').val(data.jdbcUrl);
    $('#dbAccount').val(data.dbAccount);
    $('#dbPassword').val(data.dbPassword);
}

function validateappName(str) {
    if(!REString.test(str)){
        bootsrapAlert("使用者ID僅限中文,英文,數字,點(.),底線(_),連結線(-)");
        return false;
    }
    return true;
}
function updateAppProfile() {
    /*新增app profile*/
    var updated = {
        "appName": $('#appName').val(),
        "apiKey": $('#apiKey').val(),
        "jdbcUrl":$("#jdbcUrl").val(),
        "dbAccount":$("#dbAccount").val(),
        "dbPassword":$("#dbPassword").val(),
    }
    var originProfile = datalist[$('#appName').val()];

    $.ajax({
        type : "POST",
        contentType : 'application/json',
        url : fubon.contextPath+"SystemManage/modifyForProfile",
        data : JSON.stringify({"origin" : originProfile, "updated" : updated}),
        success : function(data, response, xhr) {
            if(!data.status){
                bootsrapAlert(data.exceptionMessage);
            }else{
                bootsrapAlert("應用程式設定修改成功");
                /*把表單清空*/
                $("input[type=text]").val("");
                /*更新商品清單*/
                searchProfile($('#appName').val());
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
	var jdbcUrl = $('#jdbcUrl').val();
	var dbAccount = $('#dbAccount').val();
	var dbPassword = $('#dbPassword').val();
    var apiKey = $('#apiKey').val();

	//檢核格式
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