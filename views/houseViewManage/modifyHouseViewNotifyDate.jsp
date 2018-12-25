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
        <label class="control-label col-sm-1"> 每年</label>
            <div class="col-sm-1 form-group" style="padding:0px"> 
                <input class="form-control" type="number" min="1" max="12"/>
            </div>
        <label class="control-label col-sm-1"> 月</label>
            <div class="col-sm-1 form-group" style="padding:0px"> 
                <input class="form-control" type="number" min="1" max="31"/>
            </div>
        <label class="control-label col-sm-1"> 日</label>

            <div class="col-sm-1 form-group"> 
                <button id='addBtn' type="button" class="btn btn-primary" >新增</button>
            </div>
        <label class="control-label col-sm-2"> 通知間隔</label>
            <div class="col-sm-1 form-group" style="padding:0px"> 
                <input class="form-control" type="number" min="1" max="30"/>
            </div>
        <label class="control-label col-sm-1"> 日</label>

            <div class="col-sm-1 form-group"> 
                <button id='newBtn' type="button" class="btn btn-primary" >更新</button>
            </div>

            <div class="col-sm-12"> </div>

        <label class="control-label col-sm-1">至</label>
            <div class="col-sm-1 form-group" style="padding:0px"> 
                <input class="form-control" type="number" min="1" max="12"/>
            </div>
        <label class="control-label col-sm-1"> 月</label>
            <div class="col-sm-1 form-group" style="padding:0px"> 
                <input class="form-control" type="number" min="1" max="31"/>
            </div>
        <label class="control-label col-sm-1"> 日</label>            

    </div>

    <div class="content-2">
        <table id ="productTable" class="table table-bordered table-striped table-hover">
            <thead>
                <tr class="info">
                    <td class="wn">通知起始日</td><td class="wn">通知結束日</td><td class="wn">刪除</td>
                </tr>
            </thead>
            <tbody>

            </tbody>
         </table>

    </div>
</div>

<spring:url value="/resources/houseViewManage/modifyHouseViewNotifyDate.js" var="houseViewJs" />
<script src="${houseViewJs}"></script>

<script type="text/javascript">
    var projectName = "<%=request.getContextPath()%>";
    var roleScope = ${roleScope}.functions;
    getNavBar(roleScope);
</script>

</body>
</html>



