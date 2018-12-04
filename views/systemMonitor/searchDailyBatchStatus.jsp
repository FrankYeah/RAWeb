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
<link href="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/system/common.css" />" rel="stylesheet" />
<script src="<c:url value="/resources/jquery/jquery.validate.min.js" />"></script>
<script src="<c:url value="/resources/jquery/messages_zh_TW.js" />"></script>
<script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script>
<script src="<c:url value="/resources/systemMonitor/batchWork.js" />"></script>
<script>
	$(function() {
		ready();
	})
</script>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
	<div class="container page-header">
		<jsp:include page="title.jsp"></jsp:include>
	
		<div class="content-1">
			<form id="form1" action="${pageContext.request.contextPath}/SystemMonitor/SearchDailyBatchStatus" method="post">
				<input type="hidden" name="Page" value="${list.page }" />
				<input type="hidden" name="PageSize" value="${list.pageSize}" />
				<input type="hidden" name="SubmitType" value="true" />
				<br>
				<div class="form-group row "></div>
				<label class="control-label col-sm-2"> 單位ID:</label>
				<div class="col-sm-10 form-group"> 
					<select class="form-control"  id ="BUID" name="BUID">
						<c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
						   <c:choose>
								<c:when test="${BU.BUID == dailyBatch.BUID }">
								 <option value="${BU.BUID}" selected >${BU.BUName}${BU.BUID}</option>
                                </c:when>
                                <c:otherwise>
								<option value="${BU.BUID}" >${BU.BUName}${BU.BUID}</option>
								</c:otherwise>
							</c:choose>

                  	      
                	</c:forEach>
            
		   		    </select>
	  		 	</div>
				<br>
				<br>
				<!--  <div>
					<label>查詢批次作業狀況: </label>
					<label>
						<input type="radio" name="Type" value="product" checked="checked" /> 商品內容
					</label>
					<label>
						<input type="radio" name="Type" value="history" /> 歷史價格
					</label>
				</div>-->
				<div class="form-group">
					<label>查詢時間範圍:</label>
					<input type="text" name="StartDate" value="${dailyBatch.startDate }" />
					~
					<input type="text" name="EndDate" value="${dailyBatch.endDate }" />
					<input type="button" name="bnSubmit" class="btn btn-primary" value="查詢" onclick="setInitialPageData()"/>
				</div>
				
			</form>
		</div>
		
		<div class="content-2">
			<table class="table table-bordered table-striped table-hover">
				 <c:if test="${list != null }">
				<tr class="info">
					<th>日期</th>
					<th>來源</th>
					<th>處理狀況</th>
				</tr>
				
				
				<c:forEach items="${list.logs }" var="item" varStatus="iterator">
				<tr>
					<td>${item.ODateTime }</td>
					<td>
						<c:choose>
							<c:when test="${item.category == 'web' }">前端網站</c:when>
							<c:when test="${item.category == 'api' }">演算法伺服器</c:when>
							<c:otherwise>${item.category }</c:otherwise>
						</c:choose>
					</td>
					<td align="left">${item.message }</td>
				</tr>
				</c:forEach>
				<c:if test="${empty list || fn:length(list.logs) == 0 }">
					<tr>
						<td colspan="3">查無資料</td>
					</tr>
				</c:if>
				 </c:if>
				<c:if test="${list == null }">
		            <tr>
						<td colspan="3">此單位尚未開放資料庫API-Key權限！</td>
					</tr>
					<script>bootsrapAlert("此單位尚未開放資料庫API-Key權限！");</script>
		       </c:if>
			</table>
		</div>
		<c:if test="${list != null }">
		<jsp:include page="pagination.jsp"></jsp:include>
		 </c:if>
	</div>
<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var roleScope = ${roleScope}.functions;
getNavBar(roleScope);
</script>	
</body>
</html>