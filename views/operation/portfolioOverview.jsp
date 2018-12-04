<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/operation/portfolioOveriew.css" />" rel="stylesheet" />

<title>查詢 profolio 次數</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
		<jsp:include page="title.jsp"></jsp:include>
        <div class="form-group row "></div>
	    <div class="form-group input-daterange row" >
            <form name="submitForm" method="POST" action="${pageContext.request.contextPath}/downloadTxt" >
                <div>
                    <label class="control-label col-sm-2"> 單位ID:</label>
                    <div class="col-sm-10 form-group">
                        <select class="form-control" id="buId" name="buId">
                            <c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                                <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                            </c:forEach>
                        </select>
                    </div>
                </div>
                <button id="submitBtnDownload" type="submit" class="btn btn-primary ">下載</button>
            </form>
		</div>

    <div >
        <table id="portfolioTable-template" class="table table-bordered table-striped table-hover cleartable " style="display: none">
            <thead>
            <tr bgcolor="#6495ED">
                <th >ID</th>
                <th>日期</th>
                <th>預期報酬率</th>
                <th>變異量</th>
                <th>投資組合</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

        <table id="inventorySet-template" class="table table-bordered table-striped table-hover cleartable" style="display: none">
            <thead>
            <tr>
                <th>商品代碼</th>
                <th>占比</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>

    </div>
</div>

<spring:url value="/resources/operation/portfolioOverview.js" var="portfolioOverviewJs" />

<script src="${portfolioOverviewJs}"></script>

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>
</body>
</html>