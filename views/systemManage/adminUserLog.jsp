<%@ page language="java" contentType="text/html; charset=UTF-8"
         pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core" %>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring" %>
<!DOCTYPE html>
<html>
<head>
    <title>理財機器人</title>
    <meta charset="utf-8"/>
    <%@include file="/resources/commons/decelerations.jsp" %>
    <script src="<c:url value="/resources/jquery/jquery.validate.min.js" />"></script>
    <link href="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.css" />" rel="stylesheet"/>
    <link href="<c:url value="/resources/css/manage/common.css" />" rel="stylesheet"/>
    <script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script>
    <script src="<c:url value="/resources/jquery/messages_zh_TW.js" />"></script>
    <script src="<c:url value="/resources/systemManage/adminUserLog.js" />"></script>
 
    
</head>
<body>

<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
    <jsp:include page="titleTwoLayer.jsp"></jsp:include>

    <div class="content-1">
        <form id="form1" action="${pageContext.request.contextPath}/SystemManage/AdminUserLog" method="post">
            <input type="hidden" name="Page" value="${list.page}"/>
            <input type="hidden" name="PageSize" value="${list.pageSize}"/>
            <input type="hidden" name="SubmitType" value="true"/>
            <label class="control-label col-sm-3">單位:</label>
            <div class="col-sm-9 form-group">
                <select name="BUID" class="form-control">
                    <c:forEach items="${bulist}" var="item" varStatus="iterator">
                        <option value="${item.BUID}"${param.BUID eq item.BUID ? 'selected' : ''}>${item.BUID}${item.BUName}</option>
                    </c:forEach>
                </select>

            </div>
            <label class="control-label col-sm-3">查詢時間範圍:</label>
            <div class="col-sm-9 form-group">
                <input type="text" name="StartDate" value="${log.startDate}"/>
                ~
                <input type="text" name="EndDate" value="${log.endDate}"/>
                <input type="submit" name="submitBtn" class="btn btn-primary" value="查詢"/>
            </div>
        </form>
    </div>

    <div class="content-2">
        <table class="table table-bordered table-striped table-hover">

            <tr class="info">
                <th style="width: 180px">日期</th>
                <th>單位</th>
                <th>使用者代碼</th>
                <th>使用者名稱</th>
                <th >操作</th>
            </tr>

            <c:forEach items="${list.logs}" var="item" varStatus="iterator">
                <tr>
                    <td>${item.ODateTime}</td>
                    <td>${item.BUID}${item.BUName}</td>
                    <td>${item.userID}</td>
                    <td>${item.userName}</td>
                    <td align="left" class="AutoNewline">${item.logMessage}</td>
                </tr>
            </c:forEach>
            <c:if test="${empty list || fn:length(list.logs) == 0 }">
                <tr>
                    <td colspan="5">查無資料</td>
                </tr>
            </c:if>
        </table>
    </div>

    <jsp:include page="pagination.jsp"></jsp:include>
</div>
<script type="text/javascript">
    var projectName = "<%= request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>
</body>
</html>