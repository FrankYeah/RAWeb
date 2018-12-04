<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
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
<spring:url value="/resources/systemMonitor/server.js" var="serverJs" />
<script src="${serverJs}"></script>
<script>
// Reference: https://api.jquery.com/jQuery.ready/
$.when(
    "${pageName}",
	$.ready
).done(
    pageHandler
);

</script>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
	<div class="container page-header">
		<jsp:include page="title.jsp"></jsp:include>
		
		<div style="clear: both;"></div>
		
		<div class="main_container">
			<div class="date_wrapper">
				更新時間: <span>2017/06/15 09:01:03</span>
			</div>
		
			<table style="width: 100%;">
				<tr valign="top" align="center">
					<td width="25%">
						<div class="server_txt">理財機器人<br />前端網站</div>
						<div class="web_wrapper"></div>
					</td>
					<td width="25%">
						<div class="server_txt">理財機器人<br />演算法API</div>
						<div class="api_wrapper"></div>
					</td>
					<td width="25%">
						<div class="server_txt">理財機器人<br />資料庫</div>
						<div class="database_wrapper"></div>
					</td>
					<td width="25%">
						<div class="status_wrapper">  
							<div>
								<img src="<c:url value="/resources/picture/systemMonitor/green1.png"/>" class="status_icon" alt="*"/>正常
							</div>
							<div>
								<img src="<c:url value="/resources/picture/systemMonitor/red1.png"/>" class="status_icon" alt="*" />異常
							</div>
						</div>
						<img src="<c:url value="/resources/picture/systemMonitor/thGVLXA9UH.jpg"/>" class="refresh_btn" alt="*" />
						<div>更新狀況</div>
					</td>
				</tr>
			</table>
		</div>
	
	</div>
<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
	console.log(${roleScope});
	console.log(projectName);
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>	
</body>
</html>