<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/houseViewManage/common.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<title>觀點匯入管理</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
<jsp:include page="title.jsp"></jsp:include>
    <div class="content-1">
    <!--之後者裏要改成從資料庫撈有哪些單位-->
        <label class="control-label col-sm-2 text-left"> 單位ID:</label>
        <div class="col-sm-10 form-group">
            <select class="form-control" id="buId" name="buId">
                <c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                  <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                </c:forEach>
           </select>
       </div>
        <label class="control-label col-sm-3 text-left" > 商品代碼/名稱:</label>
        <div class="col-sm-6">
            <input type="text" id="productIdOrName" name="productIdOrName" class="form-control" placeholder="All" />
        </div>
        <div class="col-sm-2">
            <button id="searchBtn" type="button" class="btn btn-primary">查詢</button>
            <button id="downloadBtn" type="button" class="btn btn-primary">下載</button>
        </div>
        <div class="col-sm-10 form-group"> </div>
    </div>

    <div class="content-1"><!-- style="display:none;"  -->
        <table id ="productTable"  class="table table-bordered table-striped table-hover">
            <tr class="info">
                <td class="wn">代碼</td><td class="wn">名稱</td><td class="wn">預期年報酬率</td><td class="wn">信心水準</td><td >生效日期</td><td >失效日期</td>
            </tr>
        </table>

        <div class = "Msg"></div>
    </div>
</div>

<spring:url value="/resources/houseViewManage/searchHouseView.js" var="houseViewJs" />
<script src="${houseViewJs}"></script>

<script type="text/javascript">
    var projectName = "<%=request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>

</body>
</html>