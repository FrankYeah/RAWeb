<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/roleManage/bu/delBU.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>權限管理-單位管理</title>
</head>
<body>
<jsp:include page="../../nav.jsp"></jsp:include>
<div class="container page-header">
<jsp:include page="title.jsp"></jsp:include>

<div class="content-2"><!-- style="display:none;"  -->
	<table id ="buTable" class="table table-bordered table-striped table-hover">
	<thead>
		<tr class="info">
			<th class="col-1">刪除</th><th class="col-2">單位ID</th><th class="col-3">單位名稱</th><th class="col-3">API代碼</th>
		</tr>
	</thead>
	<tbody>
	</tbody>
	
	</table>
	
	<div class="col-sm-2">
			<button id="submitBtn" type="button" class="btn btn-primary" style="display:none;">刪除</button>
	</div>
</div>

</div>

<spring:url value="/resources/roleManage/bu/delBU.js" var="delBUJs" />
<script src="${delBUJs}"></script>

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>


</body>
</html>