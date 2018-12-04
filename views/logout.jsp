<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
    <script src="http://ajax.aspnetcdn.com/ajax/jQuery/jquery-1.7.2.js  "></script>
  <script>
window.history.forward(1);
</script>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
<meta http-equiv="Expires" content="0">
<meta http-equiv="Cache-Control" content="no-cache">
<meta http-equiv="Pragma" content="no-cache">

<%@include file="/resources/commons/decelerations.jsp"%>
<title>理財機器人-後台管理系統</title>

<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
<meta name="format-detection" content="telephone=no" />

<link href="<c:url value="/resources/css/home/common.css" />" rel="stylesheet" />
<link href="<c:url value="/resources/css/home/home.css" />" rel="stylesheet" />
<script src="<c:url value="/resources/jquery/jquery-1.11.1.min.js" />"></script>
<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet" />

</head>
<body>
<jsp:include page="nav.jsp"></jsp:include>
<div style="clear:both">

</div>
<div class="header_nav">&nbsp;</div>
<div class="header_wrapper1">
	<div class="div_wrapper1">
		<div class="div_wrapper2">
			<div class="fubon_logo_wrapper">
				<a href="https://www.fubon.com/financialholdings/home/index.html" target="_black"><img src="<c:url value="/resources/picture/fubon-logo.png"/>" 
					alt="*" class="fubon_logo" /></a>&nbsp;
			</div>
		
		</div>
	</div>
</div>
	
	<div class="div_container2 div_bg1">
		<div class="div_wrapper1">
			<div class="div_wrapper2" style="overflow: auto;">
				<div class="title_wrapper1">
					<div class="title1">${Msg}${Msg3}</div>
					<div class="title1">${Msg2}富邦理財機器人-後台管理介面</div>
				</div>
			</div>
		</div>
	</div>
	
	
	

<div class="footer_container2">
	<div class="div_wrapper1">
		<div class="div_wrapper2">
			<div class="footer_txt2">
				富邦金融控股股份有限公司
				<br />
				建議瀏覽器版本：IE10、Chrome 56、Safari 10、FireFox 51 以上版本
			</div>
		</div>
	</div>
</div>

<script type="text/javascript">
var projectName = "<%= request.getContextPath()%>";
var s = ${roleScope};
var roleScope = s.functions;
getNavBar(roleScope);

var isLogout = "${isLogout}";
if (isLogout=="1"){
	$("#logoutBtm").attr("disabled", true);
	
    //IE 關掉視窗,Chrome 不一定可以關掉
	setTimeout(myWinClose(), 3000);
	  
  
}
function myWinClose(){
	 myWin = window.open('','_self','');
     myWin.close();
}
</script>
</body>
</html>