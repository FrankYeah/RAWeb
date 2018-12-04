<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/product/common.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/roleManage/bu/common.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>權限管理-單位管理</title>

</head>

<body>
<jsp:include page="../../nav.jsp"></jsp:include>
<div class="container page-header">

<jsp:include page="title.jsp"></jsp:include>

<div class="content-1">
<!--之後者裏要改成從資料庫撈有哪些單位-->
   <form id="testform">
     
	    <label class="control-label col-sm-2" >單位ID:</label>
		<div class="col-sm-3"> 
			<input type="text" maxlength="10" id="buId" name="buId" class="form-control" placeholder="BUID" />
	    </div>
	  
	    
	    <label class="control-label col-sm-2" > 單位名稱:</label>
		<div class="col-sm-3">
		   
			<input type="text"  maxlength="100" id="buName" name="buName" class="form-control" placeholder="BUName" />
		</div>
		<div class="col-sm-2">
			<button id="submitBtn" type="button" class="btn btn-primary">新增</button>
			
		</div>
	   <div class="col-sm-5"></div>
		<label class="control-label col-sm-2" >API代碼:</label>
		<div class="col-sm-3">
			<input type="text"  maxlength="100" id="dbName" name="dbName" class="form-control" placeholder="DBName" />
		</div>
			
		
	</form>   
</div>

<div class="content-2"><!-- style="display:none;"  -->
	<table id ="buTable" class="table table-bordered table-striped table-hover">
	<thead>
		<tr class="info">
			<th>單位ID</th><th>單位名稱</th><th>API代碼</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
	</table>
	
</div>

</div>

<spring:url value="/resources/roleManage/bu/addBU.js" var="addBUJs" />
<script src="${addBUJs}"></script>

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>


</body>
</html>