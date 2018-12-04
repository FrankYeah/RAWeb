<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>

<%@include file="/resources/commons/decelerations.jsp"%>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<script src="https://d3js.org/d3.v3.min.js"></script>
<link href="<c:url value="/resources/css/datepicker.min.css" />" rel="stylesheet" /> <!-- 1.3.0 -->
<script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script> <!-- 1.3.0 -->
<script src="<c:url value="/resources/jquery/scripts/drawPicture.js" />"></script>
<link href="<c:url value="/resources/css/operation/userOverview.css" />" rel="stylesheet" />

<title>使用人數統計</title>
</head>
<body >
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
		<jsp:include page="title.jsp"></jsp:include>
		<div class="form-group row "></div>
	    <label class="control-label col-sm-2"> 單位ID:</label>
		<div class="col-sm-10 form-group"> 
			<select class="form-control" id="buId" name="buId">
				<c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                  <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                </c:forEach>
            
		   </select>
	   </div>
	<div class="form-group row "></div>
	<label class="control-label col-sm-2"> 查詢日期範圍:</label>
	<div class="form-group row input-daterange">
		<div class="col-sm-3">
			<input type="text" id="datepickerFrom" name="datepickerFrom" value="${iStartDate}" class="form-control datepicker" placeholder="Date From" />
		</div>
		<div class="col-sm-1">
			<span>~</span>
		</div>
		<div class="col-sm-3">
			<input type="text" id="datepickerTo" 
			name="datepickerTo" class="form-control datepicker" value="${iEndDate}" placeholder="Date To" />
		</div>
		<div class="col-sm-2">
			<button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
		</div>
	</div>
	
	<div id ="result" class="col-sm-10" style="display:none;">
		<label class="control-label col-sm-2"> 查詢結果:</label>
		<div name="rView" class=out1 class="col-sm-8">
			<span id="usernumstr">使用人數:</span>
			<span id="usernum"></span>
			&nbsp;&nbsp;&nbsp;
			<span id="transNumstr" >交易人數:</span>
			<span id="transNum"></span>
			<div id="picbody" style="text-align: center;">
			</div>
		</div>
	</div>
		
		
</div>

<spring:url value="/resources/operation/userOverview.js" var="userOverviewJs" />
<script src="${userOverviewJs}"></script>
<script type="text/javascript">

var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);

var isLogout = "${isLogout}";
if (isLogout=="1"){
	$("#logoutBtm").attr("disabled", true);
	$(window).unload(function () { });
	//history.go(1);
	//history.go(-(history.length-1));
}


</script>
</body>
</html>

