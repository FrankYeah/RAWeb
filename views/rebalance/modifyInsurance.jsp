<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <%@include file="/resources/commons/decelerations.jsp"%>
    <link href="<c:url value="/resources/css/manage/common.css" />" rel="stylesheet"/>
    <link href="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.css" />" rel="stylesheet"/>
    <script src="<c:url value="/resources/bootstrap/bootstrap-datepicker.min.js" />"></script>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>再平衡管理</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
    <jsp:include page="title.jsp"></jsp:include>

	<div class="content-1">
			<%-- user's buId --%>
			<input type="hidden" id="buId" name="buId" readonly="readonly" value="${userBUID}"/>
			
			<table class="table table-bordered table-striped table-hover col-sm-12">
				<tr class="info">
					<td class="col-sm-12"><label class="control-label">本次再平衡日期</label></td>
				</tr>
				<tr id="dataList">
					<td>
						${ReviewDate}
					</td>
				</tr>
			</table>				
			<br>

			<div class="col-sm-12">
				<button id="reimport" class="btn btn-primary" disabled>執行再平衡</button>
			</div>
	</div>
</div>
<script type="text/javascript">
    var projectName = "<%=request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
    var isFHUser = ${isFHUser}; //目前用戶是否為 "金控" BU 用戶
	if (isFHUser == true) {
		bootsrapAlert("金控帳號不能執行此功能");
	} else {
		ready();
	}
    
	$(function() {
		
		//送出申請
		var reimport = function(date) {
			var ajaxData = {"date": date,"compulsory":"True"};
			$.ajax({
				type: 'GET',
				url: 'ReImoportBatchBank',
				contentType : 'application/json',
				data: ajaxData,
				dataType: 'json'
			}).done(function (data, textStatus, jqXHR) {
				BootstrapDialog.show({
					message: "重新執行再平衡!"
				});
			}).fail(function (jqXHR, textStatus, errorThrown) {
				var returnData = JSON.parse(jqXHR.responseText);
				var message = (returnData.exception) ? returnData.message : jqXHR.responseText;
				BootstrapDialog.show({
					type: BootstrapDialog.TYPE_WARNING,
					message: message
				});
			});
		};
		$("#reimport").click(function(){
			var today = new Date();
			var date = today.getFullYear()+ "-" + (today.getMonth()+1) + "-" + today.getDate();
			reimport(date);
		});
	})
</script>

</body>
</html>