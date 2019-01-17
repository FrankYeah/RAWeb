<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <%@include file="/resources/commons/decelerations.jsp"%>
    <link href="<c:url value="/resources/css/insuranceManage/common.css" />" rel="stylesheet" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>險種管理 > 新增險種</title>
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
            <label class="control-label col-sm-2"> 險種代碼:</label>
                <div class="col-sm-3 form-group"> 
                    <input type="text" id="productID" name="productID" class="form-control"/>
                   </div>
            <label class="control-label col-sm-2"> 險種名稱:</label>
                <div class="col-sm-3 form-group"> 
                    <input type="text" id="productName" name="productName" class="form-control" />
                   </div>	
            <br>
            <br>
        
            <label class="control-label col-sm-2">KYP組別:</label>
            <div class="form-group col-sm-3"> 
                <select id="RiskReturn" name="RiskReturn" class="form-control ">
                    <option  value="RR1">RR1</option>
                    <option  value="RR2">RR2</option>
                    <option  value="RR3">RR3</option>
                    <option  value="RR4">RR4</option>
                    <option  value="RR5" selected>RR5</option>
                </select>
            </div>	

            <label class="control-label col-sm-3">是否為專案產品:</label>
            <div class="form-group col-sm-3"> 
                <select id="isPrdruct" name="isPrdruct" class="form-control ">
                    <option value="是">是</option>
                    <option value="否">否</option>
                </select>
            </div>	
            <br>
            <br>
        
            <div class="form-group col-sm-0"> </div>                       
            <label class="control-label col-sm-2"> 是否啟用:</label>
                <label class="form-check-label col-sm-1">
                      <input type="checkbox" id ="startCheckBox" class="form-group" checked="true" />
                </label>
                
            <div class="col-sm-2">
                <button id="submitBtn" type="button" class="btn btn-primary">新增</button>
            </div>
        
            <div style="display: none">
                <!-- 檔案上傳功能沒人知道細節，而且沒人使用。把它停用。 -->
                <form id="uploadForm" enctype='multipart/form-data' >
                    <label class="btn btn-default btn-file">
                        <input id="file" type="file" style="display: none"/>
                        請選擇要上傳的檔案
                    </label>
                    <button id="submitBtnUpload" type="button" class="btn btn-primary">上傳</button>
                </form>
            </div>
        </form>
        
        
    </div>




</div>

<spring:url value="/resources/insuranceManage/addInsurance.js" var="insuranceJs" />
<script src="${insuranceJs}"></script>

<script type="text/javascript">
    var projectName = "<%=request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>

</body>
</html>