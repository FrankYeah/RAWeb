<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<script>
var roleScope = ${roleScope}.functions;
//getNavBar(roleScope);
$(function(){
	var htmls = [];
	for(var i=0; i< roleScope.length ; i++){
		if(roleScope[i].type1.Page=="/SystemManage"){
			for(j = 0; j < roleScope[i].type3.length; j ++){
				var index = roleScope[i].type3[j].Page.lastIndexOf("/");
				var str = roleScope[i].type3[j].Page.substr(index+1);
				var className = '';
				if(str == '${pageName}'){
					className = "active";
				}
				var projectName = fubon.contextPath.replace(/\//g, "");
                projectName = projectName.length > 0 ? '/' + projectName : projectName;
				console.log("projectName: " + projectName);
				htmls.push('<li class="'+className+'"><a href="'+projectName+roleScope[i].type3[j].Page+'">'+roleScope[i].type3[j].FName+'</a></li>')
			}
			break;
		}
	}
	$('#navi').html(htmls.join(""));

})

</script>

<div class="header">
	<div class="col-sm-3">
		<h1 class="title" align="left">系統管理</h1>
	</div>
	<div class="col-sm-9">
		<ul class="nav nav-tabs" id="navi">
			
		</ul>
	</div>
</div>
