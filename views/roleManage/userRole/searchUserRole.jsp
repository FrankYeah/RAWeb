<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/roleManage/userRole/common.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/roleManage/userRole/searchUserRole.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>權限管理-使用者權限管理</title>
</head>
<body>
<jsp:include page="../../nav.jsp"></jsp:include>
<div class="container page-header">

<jsp:include page="title.jsp"></jsp:include>

<div class="content-1">
<!--之後者裏要改成從資料庫撈有哪些單位-->
	<label class="control-label col-sm-2"> 單位ID:</label>
		<div class="col-sm-10 form-group"> 
			<select class="form-control" id="buId" name="buId"> </select>
	   	</div>
	  <label class="control-label col-sm-2" > 權限代碼:</label>
		<div class="col-sm-7">
			<select class="form-control" id="roleID" name="roleID"> 
				<option value="All">All</option>
			</select>
				
		</div>
		
		<div class="col-sm-1">
			<button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
		</div>
		<div class="col-sm-2">
			<button id="loadOut" type="button" class="btn btn-primary">匯出 Excel</button>
		</div>
	    <div class="col-sm-10 form-group"> </div>
</div>

	<div class="content-2"><!-- style="display:none;"  -->
		<table id ="userTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<th>BUID</th><th>權限代碼</th><th>權限名稱</th><th>UserID</th><th>UserName</th><th>E-mail</th><th>最後登入時間</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
		</table>

	</div>

</div>
<script type="text/javascript">
$(function() {
var UserID = "${userID}";
	/*取得該User是哪個 BU*/
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"userID":UserID},
		url : fubon.contextPath+"roleManage/Role/Admin/Item",
		success : function(data, response, xhr) {
			var temp = JSON.parse(data).Data;
			var userIDdata = JSON.parse(temp); 
			var BUID = userIDdata.BUID;
			var BUIDtemp;
			/*判斷單位是否是 0000*/
			if(typeof(BUID)=="undefined"){
				var userIDs = userIDdata.BUs;
				for(var i=0; i< userIDs.length;i++){
					BUIDtemp=userIDs[0].BUID;
					$("#buId").append($("<option></option>").attr("value",userIDs[i].BUID).text(userIDs[i].BUName+userIDs[i].BUID));
				}
			}else{
				BUIDtemp = userIDdata.BUID;
				$("#buId").append($("<option></option>").attr("value",userIDdata.BUID).text(userIDdata.BUName+userIDdata.BUID));
			}
	
			getBURoles(BUIDtemp);
			
			var BUID =$("#buId").find(":selected").val();
			var RoleID =$("#roleID").find(":selected").val();
			getBURolesUsers(BUID,RoleID);
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
	
	/*如果切換ID 下面 role表格也要改變*/
	$("#buId").change(function () {
		var buId = $("#buId").find(":selected").val();
		if(typeof(buId)=="string"){
			getBURoles(buId);
			//var BUID =$("#buId").find(":selected").val();
			//var RoleID =$("#roleID").find(":selected").val();
			//alert(RoleID)
			//getBURolesUsers(buId,'All');
			//getBURolesUsersForSearch(BUID,''');
			var BUID =$("#buId").find(":selected").val();
			var RoleID =$("#roleID").find(":selected").val();
			getBURolesUsersForSearch(BUID,RoleID);
		}
	  })
	  .change();
	
	$("#submitBtn").click(function() {
			/*查詢該權限代碼下 有誰在裡面*/
			var BUID =$("#buId").find(":selected").val();
			var RoleID =$("#roleID").find(":selected").val();
			getBURolesUsersForSearch(BUID,RoleID);
	});	
	
	$("#loadOut").click(function() {
		var BUID = $("#buId").find(":selected").val();
		var RoleID = $("#roleID").find(":selected").val();
		
		$.ajax({
			type : "GET",
			contentType : 'application/json',
			data :{"buID":BUID,"roleID":RoleID},
			url : fubon.contextPath+"roleManage/Role/adminList",
			success : function(data, response, xhr) {
				var tableData = JSON.parse(JSON.parse(data).Data).Users;
				console.log(tableData);
				if (tableData.length==0){
					bootsrapAlert("無資料，無法匯出!");
				}else{
					location.href = fubon.contextPath+"SearchUserRole/download/"+BUID+"/"+RoleID ;
				}
			
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' '
						+ xhr.statusText);
			}	
		});

	});	
	
	

});

/*該 BUID下的 Role*/
function getBURoles(BUID){
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"buId":BUID},
		url : fubon.contextPath+"roleManage/Role/roleList",
		success : function(data, response, xhr) {
			var temp = JSON.parse(data);
			var tableData = JSON.parse(temp.Data).Roles;
			
			$("#roleID option").each(function() {
			    $(this).remove();
			});
			$("#roleID").append($("<option></option>").attr("value","All").text("All"));
			for(var i=0; i<tableData.length;i++){
				$("#roleID").append($("<option></option>").attr("value",tableData[i].RoleID).text(tableData[i].RoleID));
			}

		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

/*取得該BUID下 全部 Role 的所有管理員*/
function getBURolesUsers(BUID,RoleID){
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"buID":BUID,"roleID":RoleID},
		url : fubon.contextPath+"roleManage/Role/adminList",
		success : function(data, response, xhr) {
			var tableData = JSON.parse(JSON.parse(data).Data).Users;
			console.log(tableData);
			$("#userTable").find("tr:gt(0)").remove();
			for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
				$('#userTable').append(str);
				var $specifyTd = $('#userTable tr:last').find('td');
				$specifyTd.eq(0).text(tableData[i].BUName+" "+tableData[i].BUID);
				$specifyTd.eq(1).text(tableData[i].RoleID);
				$specifyTd.eq(2).text(tableData[i].RoleName);
				$specifyTd.eq(3).text(tableData[i].UserID);
				$specifyTd.eq(4).text(tableData[i].UserName);
                $specifyTd.eq(5).text(tableData[i].UserEmail);
				$specifyTd.eq(6).text(tableData[i].LastLogin);

			}
		
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}
	});
}

/*取得該BUID下 全部 Role 的所有管理員 For Search*/
function getBURolesUsersForSearch(BUID,RoleID){
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"buID":BUID,"roleID":RoleID},
		url : fubon.contextPath+"roleManage/Role/searchAdminList",
		success : function(data, response, xhr) {			
			var tableData = JSON.parse(JSON.parse(data).Data).Users;
			console.log(tableData);
			$("#userTable").find("tr:gt(0)").remove();
			if (tableData.length==0){
				bootsrapAlert("目前此單位無管理者!");
				var str = "<tr><td colspan='7'>目前此單位無管理者</td></tr>";
				$('#userTable').append(str);
			}else{
			  for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
				$('#userTable').append(str);
				var $specifyTd = $('#userTable tr:last').find('td');
				$specifyTd.eq(0).text(tableData[i].BUName+" "+tableData[i].BUID);
				$specifyTd.eq(1).text(tableData[i].RoleID);
				$specifyTd.eq(2).text(tableData[i].RoleName);
				$specifyTd.eq(3).text(tableData[i].UserID);
				$specifyTd.eq(4).text(tableData[i].UserName);
				$specifyTd.eq(5).text(tableData[i].UserEmail);
				$specifyTd.eq(6).text(tableData[i].LastLogin);

			 }
			}
		
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}
	});
}


</script>
<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
	console.log(${roleScope});
	console.log(projectName);
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>
</body>
</html>