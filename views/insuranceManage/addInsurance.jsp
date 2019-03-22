<%@ taglib prefix="spring" uri="http://www.springframework.org/tags"%>
<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <%@include file="/resources/commons/decelerations.jsp"%>
    <link href="<c:url value="/resources/css/insuranceManage/common.css" />" rel="stylesheet" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <title>新增險種</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">
    <jsp:include page="title.jsp"></jsp:include>



    <div class="content-1">
        <form id="productForm">
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
                    <option  value="1">1</option>
                    <option  value="2">2</option>
                    <option  value="3">3</option>
                    <option  value="4">4</option>
                    <option  value="5" selected>5</option>
                    <option  value="6">6</option>
                </select>
            </div>	

            <label class="control-label col-sm-3">是否為專案產品:</label>
            <div class="form-group col-sm-3"> 
                <select id="isPrdruct" name="isPrdruct" class="form-control ">
                    <option value=true>是</option>
                    <option value=false>否</option>
                </select>
            </div>	
            <br>
            <br>
                              
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

    var isFHUser = ${isFHUser}; //目前用戶是否為 "金控" BU 用戶
    if (isFHUser == true) {
        bootsrapAlert("金控帳號不能執行此功能");
    }
</script>

</body>
</html>