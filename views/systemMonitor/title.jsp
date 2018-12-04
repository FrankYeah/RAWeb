<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>

<script>
var roleScope = ${roleScope}.functions;
//getNavBar(roleScope);
$(function(){
	var htmls = [];
	for(var i=0; i< roleScope.length ; i++){
		if(roleScope[i].type1.Page=="/SystemMonitor"){
			for(j = 0; j < roleScope[i].type2.length; j ++){
				var index = roleScope[i].type2[j].Page.lastIndexOf("/");
				console.log(index);
				var str = roleScope[i].type2[j].Page.substr(index+1);
				var className = '';
				if(str == '${pageName}'){
					className = "active";
				}
				var projectName = fubon.contextPath.replace(/\//g, "");
				htmls.push('<li class="'+className+'"><a href="/'+projectName+roleScope[i].type2[j].Page+'">'+roleScope[i].type2[j].FName+'</a></li>')
			}
			break;
		}
	}
	$('#navi').html(htmls.join(""));

})

</script>

<div class="header">
	<div class="col-sm-3">
		<h1 align="left">系統監控</h1>
	</div>
	<div class="col-sm-9">
		<ul class="nav nav-tabs" id="navi">
		</ul>
	</div>
</div>

