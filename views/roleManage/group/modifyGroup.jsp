<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/roleManage/group/modifyGroup.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>權限管理-權限群組維護</title>
</head>
<body>
<jsp:include page="../../nav.jsp"></jsp:include>
<div class="container page-header">

<jsp:include page="title.jsp"></jsp:include>

<div class="content-1">
<!--之後者裏要改成從資料庫撈有哪些單位 // /Role/Function/List-->
<from id = "roleForm">
	<label class="control-label col-sm-2"> 單位ID:</label>
		<div class="col-sm-10 form-group"> 
			<select class="form-control" id="buId" name="buId"> </select>
	   	</div>
	</br> </br>
	<label class="control-label col-sm-2" > 權限代碼:</label>
		<div class="col-sm-4">
			<input type="text"  maxlength="10" id="roleID" name="roleID" class="form-control" placeholder="roleID" readonly="readonly"/>
		</div>
	<label class="control-label col-sm-2" > 權限名稱:</label>
		<div class="col-sm-4">
			<input type="text"  maxlength="100" id="roleName" name="roleName" class="form-control" placeholder="roleName" />
		</div>
	<br>
	<br>
	<label class="control-label col-sm-2" > 權限描述:</label>
		<div class="col-sm-6">
			<input type="text" id="roleDesc" name="roleDesc" class="form-control" placeholder="roleDesc" />
		</div>

		<div class="col-sm-2">
			<button id="submitBtn" type="button"  onclick="" class="btn btn-primary">修改</button>
			
		</div>
		<div class="col-sm-2">
		</div>
	</from>
	<br>
	<br>
	<label class="control-label col-sm-2" > 功能範圍:</label>
	<br>
	<br>
	<div id="checkboxGroup">
		<from id = "checkboxForm">
			
		</from>
	</div>
</div>

	<div class="content-2"><!-- style="display:none;"  -->
		<table id ="roleTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<th>BUID</th><th>權限代碼</th><th>權限名稱</th><th>權限描述</th><th>權限功能範圍</th>
			</tr>
		</thead>
		<tbody></tbody>
		</table>
	</div>

</div>

<spring:url value="/resources/roleManage/group/modifyGroup.js" var="modifyGroupJs" />
<script src="${modifyGroupJs}"></script>

<script type="text/javascript">

var projectName = "<%= request.getContextPath()%>";
var UserID = "${userID}";
	console.log(${roleScope});
	console.log(projectName);
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);

</script>



</body>
</html>