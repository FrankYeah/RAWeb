<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
<%@include file="/resources/commons/decelerations.jsp"%>
<link href="<c:url value="/resources/css/product/common.css" />" rel="stylesheet" />
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

<title>商品管理</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
<jsp:include page="title.jsp"></jsp:include>

<div class="content-1">
<form id="productForm">
<label class="control-label col-sm-2"> 單位ID:</label>
		<div class="col-sm-10 form-group"> 
			
			
			<select class="form-control" id="buId" name="buId">
				<c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                  <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                </c:forEach>
            
		   </select>
		   
	   	</div>
	<br>
	<br>
	<label class="control-label col-sm-2"> 類型:</label>
	<div class="form-group col-sm-3">
		<select id="type" name="type" class="form-control ">
			<option  value="MF">MF</option>
			<option  value="ETF">ETF</option>
		</select>
	</div>
	<label class="control-label col-sm-2"> 註記:</label>
	<div class="col-sm-3 form-group">
		<input type="text" id="label" name="label" class="form-control"/>
	</div>
	<br>
	<br>
	<label class="control-label col-sm-2"> 商品代碼:</label>
		<div class="col-sm-3 form-group"> 
			<input type="text" id="productID" name="productID" class="form-control"/>
	   	</div>
	<label class="control-label col-sm-2"> 商品名稱:</label>
		<div class="col-sm-3 form-group"> 
			<input type="text" id="productName" name="productName" class="form-control" />
	   	</div>	
	<br>
	<br>
	<label class="control-label col-sm-2">商品說明</label>
		<div class="form-group col-sm-9"> 
	    	<textarea class="form-control" id="productDescribe" name ="productDescribe" rows="5"></textarea>
		</div>	
		
	<label class="control-label col-sm-2"> 連結網址:</label>
		<div class="col-sm-10 form-group"> 
			<input type="text" id="url" name="url" class="form-control" />
	   	</div>
	   		
	<label class="control-label col-sm-2"> 是否啟用:</label>
		<label class="form-check-label col-sm-1">
     		 <input type="checkbox" id ="startCheckBox" class="form-group" checked="true" />
    	</label>
    	
	<div class="col-sm-2">
		<button id="submitBtn" type="button" class="btn btn-primary">新增</button>
	</div>
	<form id="uploadForm" enctype='multipart/form-data' >
		<label class="btn btn-default btn-file">
			<input id="file" type="file" style="display: none"/>
			請選擇要上傳的檔案
		</label>
		<button id="submitBtnUpload" type="button" class="btn btn-primary">上傳</button>
	</form>
</form>


</div>
</div>

<spring:url value="/resources/product/addProduct.js" var="addProductJs" />
<script src="${addProductJs}"></script>

<script type="text/javascript">
	
	var projectName = "<%=request.getContextPath()%>";
	var roleScope = ${roleScope}.functions;
	getNavBar(roleScope);
</script>


</body>
</html>