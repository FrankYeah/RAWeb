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
					<td class="col-sm-6"><label class="control-label">本次再平衡日期</label></td>
					<td class="col-sm-6"><label class="control-label">狀態</label></td>
				</tr>
				<tr id="dataList">
					<td>
						<input type="text" id="datepickerFrom" name="datepickerFrom" value="${ReviewDate}" readonly="readonly"/>
					</td>
				</tr>
			</table>				
			<br>
			<label class="control-label col-sm-2"> 是否啟用:</label>
				<label class="form-check-label col-sm-1">
		     		 <input type="checkbox" id ="startCheckBox" class="form-group"/>
		    	</label>
		    	
			<div class="col-sm-2">
				<button id="submitBtn" type="button" class="btn btn-primary">修改</button>
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
		$("#submitBtn").click(function(){
			if($("#startCheckBox").prop("checked")){
				var data = {
						CustomDate : $("#datepickerFrom").val(),
						ReviewType : "apply"
				};
				
				$.ajax({
					type : "POST",
					data: data,
					url : fubon.contextPath+"Rebalance/updateCombiInvSet2ReviewType",
					success : function(data, response, xhr) {
						if(data.reportType == "ok"){
							$('#viewType').remove();
							$('#dataList').append("<td id='viewType'>審核中</td>");
							$("#submitBtn").attr("disabled",true);
							bootsrapAlert("案件送審中");
						}
						
						if(data.reportType == "error"){
							bootsrapAlert("系統異常,無法送出再平衡申請");
						}
					},
					error : function(xhr) {
						bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
					}
				});
			} else {
				bootsrapAlert("未勾選是否啟用");
			}
		});
	})
	
	function ready() {
		$("#datepickerFrom").datepicker({
			format : 'yyyy-mm-dd',
			autoclose : true
		});
		
		var data = {
				CustomDate : $("#datepickerFrom").val(),
				ReviewType : "select"
		};
		
		$.ajax({
			type : "POST",
			data: data,
			url : fubon.contextPath+"Rebalance/selectCombiInvSet2",
			success : function(report, response, xhr) {
				if(report.Data.reviewDate != null && report.Data.reviewDate != ""){
					$("#datepickerFrom").val(report.Data.reviewDate);
				} 
				if(report.Data.review == "apply"){
					$('#dataList').append("<td id='viewType'>審核中</td>");
					$("#submitBtn").attr("disabled",true);
				} else if(report.Data.review == "overrule"){
					$('#dataList').append("<td id='viewType'>案件駁回</td>");
				} else if(report.Data.review == "action"){
					$('#dataList').append("<td id='viewType'>處理中</td>");
					$("#submitBtn").attr("disabled",true);
				} else {
					$('#dataList').append("<td id='viewType'>未處理</td>");
				}
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
			}
		});
	}
</script>

</body>
</html>