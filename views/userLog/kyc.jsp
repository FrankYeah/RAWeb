<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

    <%@include file="/resources/commons/decelerations.jsp" %>

    <link href="<c:url value="/resources/css/datepicker.min.css" />" rel="stylesheet"/> <!-- 1.3.0 -->
    <script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script> <!-- 1.3.0 -->
	<link href="<c:url value="/resources/css/userLog/kyc.css" />" rel="stylesheet" />

    <title>查詢客戶填寫的 KYC 內容</title>

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
    <div class="form-group input-daterange row">
        <label class="control-label col-sm-2"> UserID:</label>
        <div class="col-sm-2">
            <input type="text" id="userID" name="userID" class="form-control" placeholder="UserID"/>
        </div>

        <label class="control-label col-sm-2"> 查詢日期:</label>
        <div class="col-sm-2">
            <input type="text" id="endDate" name="datepickerTo" class="form-control datepicker"
                   placeholder="End Date"/>
        </div>

        <label class="control-label col-sm-1"> 範圍:</label>

        <div class="col-sm-2 form-group">
            <select class="form-control" id="beforeMonth" name="datepickerFrom">
                <option value="before1">過去一個月</option>
                <option value="before3">近三個月</option>
                <option value="before6">近半年</option>
                <option value="before12">近一年</option>
            </select>
        </div>

        <div class="col-sm-1">
            <button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
        </div>
    </div>


    <div id="resultTable" style="display: none">

        <div class="result-1">
            <span class="glyphicon glyphicon-search"></span>
            <span>查詢時間:</span>
            <span id="searchTime"></span>
            <span class="glyphicon glyphicon-check"></span>
            <span>填寫次數:</span>
            <span id="frequency"></span>
        </div>

    </div>

    <table id="kyctable-template" class="kyctable table table-bordered table-striped table-hover" style="display: none">
        <colgroup span="2"></colgroup>
        <col>
        <thead>
        <tr bgcolor="#6495ED" style="color: white">
            <th colspan="2" class="diagonal">
                <div class="diagonal">
                    <span id="tableTime">KYC</span>
                    <span id="tableCondition">Time</span>
                </div>
            </th>
            <th></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td rowspan="10" class="rowname" scope="rowgroup" bgcolor="#FFDAB9" width="100">填寫內容</td>
            <td>1.年齡</td>
        </tr>
        <tr>
            <td>2.存款</td>
        </tr>
        <tr>
            <td>3.家中成員</td>
        </tr>
        <tr>
            <td>4.撫養人數</td>
        </tr>
        <tr>
            <td>5.年收入</td>
        </tr>
        <tr>
            <td>6.每個月投資金額</td>
        </tr>
        <tr>
            <td>7.有無投資經驗</td>
        </tr>
        <tr>
            <td>8.交易頻率</td>
        </tr>
        <tr>
            <td>9.虧損承受程度</td>
        </tr>
        <tr>
            <td>10.投資目標</td>
        </tr>
        <!--<tr><td rowspan="5" class ="rowname" scope="rowgroup" bgcolor="#A6FFCC"> 建議內容</td>
            <tr><td>每月定額</td></tr>
            <tr><td>風險等級</td></tr>
            <tr><td>初期入金</td></tr>
            <tr><td>目標金額</td></tr>-->

        </tbody>
    </table>

</div>

<spring:url value="/resources/userLog/kyc.js" var="kycJs" />

<script src="${kycJs}"></script>

<script type="text/javascript">
    var projectName = "<%= request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>


</body>
</html>