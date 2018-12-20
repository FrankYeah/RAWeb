<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/roleManage/userRole/common.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/roleManage/userRole/delModifyUserRole.css" />" rel="stylesheet" />
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
		<div class="col-sm-3">
			<select class="form-control" id="roleID" name="roleID"> </select>
		</div>
		<div class="col-sm-7 form-group"> </div>
		<div class="col-sm-10 form-group"> </div>
		<div class="col-sm-12 ">
			<label class="control-label col-sm-2"> 使用者代碼:</label>
			<div class="col-sm-3 form-group">
				<input type="text" maxlength="50" id="userID" name="userID" class="form-control" placeholder="userID" readonly="readonly"/>
			</div>
			<label class="control-label col-sm-2"> 使用者姓名:</label>
			<div class="col-sm-3 form-group">
				<input type="text" maxlength="50" id="userName" name="userName" class="form-control" placeholder="userName" />
			</div>
		</div>
		<div class="col-sm-12 ">
			<label class="control-label col-sm-2"> 使用者電子郵件:</label>
			<div class="col-sm-3 form-group" >
				<input type="text" maxlength="100" id="userEmail" name="userEmail" class="form-control" placeholder="userEmail" />
			</div>

			<div class="col-sm-5">
				<button id="submitBtn" type="button" class="btn btn-primary">修改</button>
			</div>
		</div>
	</div>

	<div class="content-2"><!-- style="display:none;"  -->
		<input type="text" id="myInput" onkeyup="filterUserID('myInput','userTable')" placeholder="Search for UserID." title="filter word">
		<table id ="userTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<th>BUID</th><th>權限代碼</th><th>權限名稱</th><th>UserID</th><th>UserName</th><th>E-mail</th>
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
					$("#buId").append($("<option></option>").attr("value",userIDs[i].BUID+','+userIDs[i].BUName).text(userIDs[i].BUName+userIDs[i].BUID));
				}
			}else{	
				BUIDtemp = userIDdata.BUID;
				$("#buId").append($("<option></option>").attr("value",userIDdata.BUID+','+userIDdata.BUName).text(userIDdata.BUName+userIDdata.BUID));
			}
			
			/*把該 BU 下面的 roles放入 option 內*/
			//alert(BUIDtemp);
			getBURoles(BUIDtemp);
			/*把 BUID 下所有 roles 的 User 放入表格*/
			getBURolesUsers(BUIDtemp);
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});

	/*如果切換ID 下面 role表格也要改變*/
	$("#buId").change(function () {
	   $('#myInput').val("");
	   filterUserID('myInput','userTable');
        $("#userID").val("");
        $("#userName").val("");
        $("#userEmail").val("");

		//var buId = $("#buId").find(":selected").val();
		var buidstr = $("#buId").find(":selected").val();
		//alert(buidstr);
		if(typeof(buidstr)=="string"){
			//alert(buidstr);
			var buInfo= buidstr.split(',');
			var buId = buInfo[0];
			//alert(buId);
			/*Roles*/
			getBURoles(buId);
			/*Users*/
			getBURolesUsers(buId);
		}
	  })
	  .change();
	
	
	$("#submitBtn").click(function() {
		if(userNameValidate()){
			var buidstr = $("#buId").find(":selected").val();
			var buInfo = buidstr.split(',');
			
			var addUser={"BUID":buInfo[0],
					"BUName":buInfo[1],
					"UserID":$("#userID").val(),
					"RoleID":$("#roleID").find(":selected").text(),
					"UserName":$("#userName").val(),
					"UserEmail":$("#userEmail").val()};
			/*修改使用者*/
			$.ajax({
				type : "POST",
				contentType : 'application/json',
				url : fubon.contextPath+"roleManage/Role/modiAdmin",
				data : JSON.stringify(addUser),
				success : function(data, response, xhr) {
					var temp = JSON.parse(data);
					bootsrapAlert("使用者修改成功");
					$('#myInput').val("");
					$("#userID").val("");
					$("#userName").val("");
                    $("#userEmail").val("");
					getBURolesUsers(buInfo[0]);
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}	
			});
		}
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
			 //alert(BUID);
			$("#roleID option").each(function() {
			    $(this).remove();
			});
			
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
function getBURolesUsers(BUID){
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"buID":BUID,"roleID":"All"},
		url : fubon.contextPath+"roleManage/Role/adminList",
		success : function(data, response, xhr) {
			var tableData = JSON.parse(JSON.parse(data).Data).Users;
			console.log(tableData);
			$("#userTable").find("tr:gt(0)").remove();
			if (tableData.length==0){
				var str = "<tr><td colspan='6'>目前此單位無管理者</td></tr>";
				$('#userTable').append(str);
			}
			for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
				$('#userTable').append(str);
				
				var h = $("<a>", {
					href : "#",
					text : tableData[i].UserID,
					onclick:"sendModify('"+tableData[i].UserID+"','"+tableData[i].UserName+"','"+tableData[i].UserEmail+"','"+tableData[i].RoleID+"')"
				});
			
				var $specifyTd = $('#userTable tr:last').find('td');
				$specifyTd.eq(0).text(tableData[i].BUName+" "+tableData[i].BUID);
				$specifyTd.eq(1).text(tableData[i].RoleID);
				$specifyTd.eq(2).text(tableData[i].RoleName);
				$specifyTd.eq(3).append(h);
				$specifyTd.eq(4).text(tableData[i].UserName);
                $specifyTd.eq(5).text(tableData[i].UserEmail);
			}
			
			
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

function sendModify(userid, userName, userEmail, roleID){
	$('#userID').val(userid);
	$('#userName').val(userName);
    $('#userEmail').val(userEmail);
	$('#roleID').val(roleID);
}

function userNameValidate() {

	
	var userName = $("#userName").val().trim();
	var userID = $("#userID").val().trim();
	//var buID = $("#buId").find(":selected").val();
	var buidstr = $("#buId").find(":selected").val();
	//alert(buidstr);
	var buInfo = buidstr.split(',');
	var buID = buInfo[0];
	var RoleID = $("#roleID").find(":selected").text();
	var userEmail = $("#userEmail").val().trim();
	
	if(!REBUId.test(buID)){
		bootsrapAlert("請選擇欲加入的單位 ID");
    	return false;
    }
	
	if(!RERoleId.test(RoleID)){
		bootsrapAlert("請選擇欲修改的權限代碼，若無權限代碼請先新增");
    	return false;
    }
	
	if(!REUserID.test(userID)){
		bootsrapAlert("請選擇欲修改的使用者代碼");
    	return false;
    }
	
	if(!REUserName.test(userName)){
		bootsrapAlert("欲修改的使用者姓名最大長度為50，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
    	return false;
	}
	
	if(!REEmail.test(userEmail)){
		bootsrapAlert("欲修改的使用者電子郵件，必須符合正式的電子郵件規範。");
    	return false;
    }
	
	return true;
	
	return true;
}
function filterUserID(myinput,tableid) {
  var input, filter, table, tr, td, i;
  input = document.getElementById(myinput);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableid);
  tr = table.getElementsByTagName("tr");
  
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("a")[0];
    
    if (td) {
    // alert(td.innerHTML);
      if (td.innerHTML.toUpperCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }       
  }
}
</script>
<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>
</body>
</html>