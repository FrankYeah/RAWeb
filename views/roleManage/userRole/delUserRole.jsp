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
		<div class="col-sm-7">
			<select class="form-control" id="roleID" name="roleID"> 
				<option value="All">All</option>
			</select>
				
		</div>
	<div class="col-sm-1">
			<button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
		</div>
		<div class="col-sm-10 form-group"> 
</div>

	<div class="content-2"><!-- style="display:none;"  -->
	     <input type="text" id="myInput" onkeyup="filterUserID('myInput','userTable')" placeholder="Search for UserID.." title="Type in a name">
		<table id ="userTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<th>刪除</th><th>BUID</th><th>權限代碼</th><th>權限名稱</th><th>UserID</th><th>UserName</th><th>UserEmail</th>
			</tr>
		</thead>
		<tbody>
		</tbody>
		</table>
		<div class="col-sm-2">
			<button id="submitBtnDel" type="button" class="btn btn-primary" style="display:none;">刪除</button>
		</div>
	</div>

</div>
<script type="text/javascript">
$(function() {
var UserID = "${userID}";
    
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"userID":UserID},
		url : fubon.contextPath+"roleManage/Role/Admin/Item",
		success : function(data, response, xhr) {
			var temp = JSON.parse(data).Data;
			
			/*取得該User是哪個 BU*/
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
			
			/*把該 BU 下面的 roles放入 option 內*/
			getBURoles(BUIDtemp);
			/*把該 BU 下面的所有 roles 的使用者放入表格*/
			getBURolesUsers(BUIDtemp,"All");
			

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
		var buId = $("#buId").find(":selected").val();
		if(typeof(buId)=="string"){
			/*Roles*/
			getBURoles(buId);
			/*Users*/
			getBURolesUsers(buId,"All");
		}
	  })
	  .change();
	
	$("#submitBtn").click(function() {//查詢
	       
		    $('#myInput').val("");
		    filterUserID('myInput','userTable');
			/*查詢該權限代碼下 有誰在裡面*/
			var BUID =$("#buId").find(":selected").val();
			var RoleID =$("#roleID").find(":selected").val();
			
			if(typeof(RoleID)=="undefined"){
				bootsrapAlert("請選擇權限代碼，若無權限代碼，請先新增。")
			}else{
				
				getBURolesUsers(BUID,RoleID);
			}
			
	});	
	
	/*刪除 Users*/
	$("#submitBtnDel").on('click', function () {
		/*整理要被刪除的資訊*/
		if(userRoleDelValidate()){
		    var userIDsInfo = $("input[type='checkbox']:checked").map(function () {return this.value;}).get();
		    var BUIDs = $("input[type='checkbox']:checked").map(function () {return this.name;}).get();
			var delUser={}; //roleIDs actually
			delUser["BUID"] = String(BUIDs);
			delUser["UserID"]=	String(userIDsInfo);
            //alert(String(userIDsInfo));
            
		    $.ajax({
				type : "POST", 
				contentType : 'application/json',
				data:JSON.stringify(delUser),
				url : fubon.contextPath+"roleManage/Role/delAdmin",
				success : function(data, response, xhr) {
					
					var r = JSON.parse(data).Data;
					console.log(r);
					bootsrapAlert(r);
					
					//bootsrapAlert("使用者刪除成功");
					$('#myInput').val("");
					var BUID =$("#buId").find(":selected").val();
					var RoleID =$("#roleID").find(":selected").text();
					/*取得最新的 roles table*/
					getBURolesUsers(BUID,RoleID);
				},
				error : function(xhr) {
					bootsrapAlert("err: " + xhr.status + ' '
							+ xhr.statusText);
				}	
			});
		}
	});

});

function userRoleDelValidate() {
	var $checkboxes = $("input[type='checkbox']");
	var check = true;
	for (i = 0; i < $checkboxes.length; i++) {
		if ($checkboxes[i].checked == true) {
			check = false;
		}
	}

	if(check){
		bootsrapAlert("請選取欲刪除的使用者");
	  		return false;
	  }
	  
	return true;
	
}

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
			/*清除原有的 option*/
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
			if (tableData.length==0){
				var str = "<tr><td colspan='7'>目前此單位無管理者</td></tr>";
				$('#userTable').append(str);
			}
			for(var i=0; i<tableData.length;i++){
				var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
				$('#userTable').append(str);
				var checkbox = $('<input />', { type: 'checkbox', id:tableData[i].BUID+i, name:tableData[i].BUID , value:tableData[i].UserID+'&'+tableData[i].BUID +"&"+tableData[i].BUName +'&'+tableData[i].RoleID+'&'+tableData[i].UserName});
				var $specifyTd = $('#userTable tr:last').find('td');
				$specifyTd.eq(0).append(checkbox);
				$specifyTd.eq(1).text(tableData[i].BUName+" "+tableData[i].BUID);
				$specifyTd.eq(2).text(tableData[i].RoleID);
				$specifyTd.eq(3).text(tableData[i].RoleName);
				$specifyTd.eq(4).text(tableData[i].UserID);
				$specifyTd.eq(5).text(tableData[i].UserName);
                $specifyTd.eq(6).text(tableData[i].UserEmail);
			}
			$("#submitBtnDel").removeAttr("style");
		
		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}
function filterUserID(myinput,tableid) {
  var input, filter, table, tr, td, i;
  input = document.getElementById(myinput);
  filter = input.value.toUpperCase();
  table = document.getElementById(tableid);
  tr = table.getElementsByTagName("tr");
  
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[4];
    
    if (td) {
     //alert(td.innerHTML);
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