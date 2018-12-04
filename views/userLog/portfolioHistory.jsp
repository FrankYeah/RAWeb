<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/datepicker.min.css" />" rel="stylesheet" /> <!-- 1.3.0 -->
<script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script> <!-- 1.3.0 -->
<link href="<c:url value="/resources/css/userLog/portfolioHistory.css" />" rel="stylesheet" />

<title>查詢 profolio 次數</title>
</head>
<body>
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
	<div class="form-group input-daterange row" >
			<label class="control-label col-sm-2"> UserID:</label>
			<div class="col-sm-2">
				<input type="text" id="userID" name="userID" class="form-control"
                       placeholder="UserID"/>
			</div>

			<label class="control-label col-sm-2"> 查詢時間範圍:</label>
			<div class="col-sm-2">
				<input type="text" id="startDate" name="datepickerFrom" class="form-control datepicker"
                       placeholder="Date From"/>
			</div>
			<div class="col-sm-1">
				<span>~</span>
			</div>
			<div class="col-sm-2">
				<input type="text" id="endDate" name="datepickerTo" class="form-control datepicker"
                       placeholder="Date To"/>
			</div>
			<div class="col-sm-1">
				<button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
			</div>
		</div>
	
	
	
	<div id ="resultTable">
        <div class="result-1">
            <span class="glyphicon glyphicon-search"></span>
            <span>查詢 portfolio 次數:</span>
            <span id="portfolioNum"></span>
            <span class="glyphicon glyphicon-check"></span>
            <span>導向交易頻率:</span>
            <span id="frequency"></span>
        </div>
	</div>

    <div style="display: none">
        <table id="portfolioTable-template" class="table table-bordered table-striped table-hover" style="display: none">
            <thead>
            <tr bgcolor="#6495ED">
                <th class="diagonal">
                    <div class="diagonal">
                        <span id="tableTime">Time</span>
                        <span id="tableCondition">條件</span>
                    </div>
                </th>
                <th>投資期間</th>
                <th>目標金額</th>
                <th>初期入金</th>
                <th>每月定額</th>
                <th>風險</th>
                <th>投資組合</th>
                <th>導向交易?</th>
                <th>交易備註</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <table id="inventorySet-template" class="table table-bordered table-striped table-hover">
            <thead>
            <tr>
                <th>商品代碼</th>
                <th>商品名稱</th>
                <th>占比</th>
                <th>價位</th>
                <th>數量</th>
                <th>淨值</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

    </div>
</div>

<spring:url value="/resources/userLog/portfolioHistory.js" var="protfolioHistoryJs" />

<script src="${protfolioHistoryJs}"></script>

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>


</body>
</html>