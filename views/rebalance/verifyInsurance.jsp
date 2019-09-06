<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/insuranceManage/common.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>再平衡管理</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
<jsp:include page="title.jsp"></jsp:include>
	<div class="content-1">
		<table class="table table-bordered table-striped table-hover col-sm-12">
				<tr class="info">
					<td class="col-sm-6"><label class="control-label">本次再平衡日期</label></td>
					<td class="col-sm-6"><label class="control-label">覆核</label></td>
				</tr>
				<tr id="trData">
				</tr>
		</table>
		<input type="hidden" id="ReviewType" name="ReviewType" readonly="readonly" value="${ReviewType}"/>
		<input type="hidden" id="reportDate" name="reportDate" readonly="readonly" value="${ReviewDate}"/>
		<div class = "Msg"></div>
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
	
	//批準
	function submitPass() {
    	var data = {
				CustomDate : $("#reportDate").val(),
				ReviewType : "pass"
		};
		
    	$('#viewType').remove();
		bootsrapAlert("案件批準再平衡處理");
		var str = "<td id='viewType'>" + report.Data.reviewDate + "</td><td>處理中</td>"
		$('#trData').append(str);
		
		$.ajax({
			type : "POST",
			data: data,
			url : fubon.contextPath+"Rebalance/updateCombiInvSet2ReviewType",
			success : function(data, response, xhr) {							
				if(data.reportType == "error"){
					bootsrapAlert("系統異常,無法批準再平衡申請");
				}
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
			}
		});
    }
  
    //駁回
    function submitOverrule() {
    	var data = {
				CustomDate : $("#reportDate").val(),
				ReviewType : "overrule"
		};
		
		$.ajax({
			type : "POST",
			data: data,
			url : fubon.contextPath+"Rebalance/updateCombiInvSet2ReviewType",
			success : function(data, response, xhr) {
				if(data.reportType == "ok"){
					$('#dataList').remove();
					bootsrapAlert("案件駁回再平衡處理");
					setTimeout(function(){window.location.reload()}, 800);					
				}
				
				if(data.reportType == "error"){
					bootsrapAlert("系統異常,無法駁回再平衡申請");
				}
			},
			error : function(xhr) {
				bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
			}
		});
    }
    
	function ready() {
    	var data = {
				CustomDate : $("#reportDate").val(),
				ReviewType : "select"
		};
		
		$.ajax({
			type : "POST",
			data: data,
			url : fubon.contextPath+"Rebalance/selectCombiInvSet2",
			success : function(report, response, xhr) {
				if(report.Data.review == "apply"){
					var str = "<td id='viewType'>" + report.Data.reviewDate + "</td>"
					+ "<td><button id='submitPass' type='button' onclick='submitPass()' class='btn btn-primary'>通過</button>"
					+ "<button id='submitOverrule' type='button' onclick='submitOverrule()' class='btn btn-danger'>駁回</button></td>";
					$('#trData').append(str);
				}
				
				if(report.Data.review == "action"){
					var str = "<td id='viewType'>" + report.Data.reviewDate + "</td><td>處理中</td>"
					$('#trData').append(str);
				}
				
				if(report.Data.review == "overrule"){
					var str = "<td id='viewType'>" + report.Data.reviewDate + "</td><td>案件駁回</td>"
					$('#trData').append(str);
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