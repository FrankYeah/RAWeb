<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">

<script>
var roleScope = ${roleScope}.functions;
//getNavBar(roleScope);
$(function(){
	getNavtabsByRoleScope("/Rebalance","${pageName}");
})

</script>

<div class="header">
	<div class="col-sm-4">
		<h1 class="title" align="left">再平衡管理</h1>
	</div>
	<div class="col-sm-8">
		<ul class="nav nav-tabs" id="navi">
			
		</ul>
	</div>
</div>
