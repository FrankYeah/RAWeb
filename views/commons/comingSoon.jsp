<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<!DOCTYPE html>
<html>
<head>
<title>理財機器人</title>
<meta charset="utf-8" />
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/system/common.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/system/server.css" />" rel="stylesheet" />
<script>
	var fubon = {
		contextPath: "${pageContext.request.contextPath}" + "/"
	}
</script>

<script>
$(function() {
	ready();
})
</script>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>

<img src = "<c:url value="/resources/picture/coming-soon.jpg" />" width="40%" height="40%">

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
	console.log(${roleScope});
	console.log(projectName);
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>	
</body>
</html>