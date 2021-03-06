<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>

<head>
    <%@include file="/resources/commons/decelerations.jsp"%>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <script src="https://d3js.org/d3.v3.min.js"></script>
    <link href="<c:url value="/resources/css/datepicker.min.css" />" rel="stylesheet" />
    <script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script>
    <link href="<c:url value="/resources/css/operation/userChannel.css" />" rel="stylesheet" />
    <title>各管道人數統計</title>
</head>

<body>
    <jsp:include page="../nav.jsp"></jsp:include>
    <div class="container page-header">
        <div class="row">
            <jsp:include page="title.jsp"></jsp:include>
            <div class="form-group row "></div>
        </div>
        <div class="row">
            <label class="control-label col-sm-2"> 單位ID:</label>
            <div class="col-sm-10 form-group">
                <select class="form-control" id="buId" name="buId">
                    <c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                        <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                    </c:forEach>
                </select>
            </div>
            <div class="form-group input-daterange" style="padding-top: 10px">
                <label class="control-label col-sm-2"> 查詢日期範圍:</label>
                <div class="col-sm-2">
                    <input type="text" id="datepickerFrom" name="datepickerFrom" value="${startDate}" class="form-control datepicker"
                        placeholder="Date From" />
                </div>
                <div class="col-sm-1">
                    <span>~</span>
                </div>
                <div class="col-sm-2">
                    <input type="text" id="datepickerTo" name="datepickerTo" class="form-control datepicker" value="${endDate}"
                        placeholder="Date To" />
                </div>
                <div class="col-sm-4">
                    <button id="submitBtn" type="button" class="btn btn-primary">查詢</button>
                    <button id="downloadExcelBtn" type="button" class="btn btn-primary">下載Excel</button>
                    <button id="downloadCsvBtn" type="button" class="btn btn-primary">下載CSV</button>
                </div>
            </div>
        </div>
        <div id="result" class="col-sm-10 row">
            <label class="control-label col-sm-2"> 查詢結果:</label>
            <div name="rView" class=out1 class="col-sm-8">
                <div id="chartsResults" />
            </div>
        </div>
    </div>
    <spring:url value="/resources/operation/userOverviewByChannel.js" var="userOverviewByChannel"/>
    <script src="${userOverviewByChannel}"></script>
    <script type="text/javascript">

        var projectName = "<%= request.getContextPath()%>";
        var roleScope = ${ roleScope }.functions;
        getNavBar(roleScope);

        var isLogout = "${isLogout}";
        if (isLogout == "1") {
            $("#logoutBtm").attr("disabled", true);
            $(window).unload(function () { });
        }

        var isFHUser = ${isFHUser}; //目前用戶是否為 "金控" BU 用戶
        var isSecurityUser = ${isSecurityUser}; //目前用戶是否為 "証卷" BU 用戶
        if (isFHUser == false && isSecurityUser == false) {
            bootsrapAlert("金控或証卷帳號才能執行此功能");
            $("#submitBtn").attr("disabled", true);
            $("#downloadBtn").attr("disabled", true);
        }
        else {
            getStatData();
        }
    </script>
</body>

</html>