<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <%@include file="/resources/commons/decelerations.jsp"%>
    <link href="<c:url value="/resources/css/insuranceManage/common.css" />" rel="stylesheet" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>修改險種</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
    <jsp:include page="title.jsp"></jsp:include>


	<div class="content-1">
		<label class="control-label col-sm-2"> 單位ID:</label>
				<div class="col-sm-3 form-group"> 
					<input type="text" id="buId_text" name="buId" class="form-control" readonly="readonly"/>
			   	</div>

			<br>
			<br>
			<label class="control-label col-sm-2"> 商品代碼:</label>
				<div class="col-sm-3 form-group"> 
					<input type="text" id="productID" name="productID" class="form-control" readonly="readonly"/>
			   	</div>
			<label class="control-label col-sm-2"> 商品名稱:</label>
				<div class="col-sm-3 form-group"> 
					<input type="text" id="productName" name="productName" class="form-control" />
			   	</div>	
			<br>
			<br>

			<label class="control-label col-sm-2">商品風險等級:</label>
			<div class="form-group col-sm-3"> 
				<select id="RiskReturn" name="RiskReturn" class="form-control ">
					<option  value="RR1">RR1</option>
					<option  value="RR2">RR2</option>
					<option  value="RR3">RR3</option>
					<option  value="RR4">RR4</option>
					<option  value="RR5" selected>RR5</option>
				</select>
            </div>	
            
			<label class="control-label col-sm-3">是否為專業產品:</label>
			<div class="form-group col-sm-3"> 
				<select id="isProduct" name="isProduct" class="form-control ">
					<option  value="是">是</option>
					<option  value="否">否</option>
				</select>
			</div>	
			<br>
			<br>


				

			   		
			<label class="control-label col-sm-2"> 是否啟用:</label>
				<label class="form-check-label col-sm-1">
		     		 <input type="checkbox" id ="startCheckBox" class="form-group"/>
		    	</label>
		    	
			<div class="col-sm-2">
				<button id="submitBtn" type="button" class="btn btn-primary">修改</button>
			</div>
	</div>
	
	<div class="hr"><hr /></div>


<!-- // -->
	<div class="content-2">
        <!--之後者裏要改成從資料庫撈有哪些單位-->
            <label class="control-label col-sm-2"> 單位ID:</label>
                <div class="col-sm-3 form-group"> 
                    
                <select class="form-control" id="buId" name="buId">
                    <c:forEach items="${uiBUList}" var="BU" varStatus="iterator">
                      <option value="${BU.BUID}">${BU.BUName}${BU.BUID}</option>
                    </c:forEach>
                
               </select>
               </div>

        </div>
<!-- // -->


	<div class="content-3"><!-- style="display:none;"  -->
		<table id ="productTable" class="table table-bordered table-striped table-hover">
		<thead>
			<tr class="info">
				<td class="wn">代碼</td><td class="wn">名稱</td><td class="wn">KYP組別</td><td >是否為專案產品</td><td  class="wn">是否啟用</td><td class="wn">更新日期</td>
			</tr>
		</thead>
		<tbody>
		</tbody>
		
		</table>
		<div class = "Msg"></div>
	</div>



</div>

<spring:url value="/resources/insuranceManage/modifyInsurance.js" var="insuranceJs" />
<script src="${insuranceJs}"></script>

<script type="text/javascript">
    var projectName = "<%=request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>

</body>
</html>