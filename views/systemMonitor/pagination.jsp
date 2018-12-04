<%@ page language="java" contentType="text/html; charset=UTF-8"
	pageEncoding="UTF-8"%>
<%@ taglib prefix="c" uri="http://java.sun.com/jsp/jstl/core"%>
<%@taglib uri="http://www.springframework.org/tags" prefix="spring"%>
<%@ taglib prefix="fn" uri="http://java.sun.com/jsp/jstl/functions" %>

<c:set var="tmpTotalPage" value="${list.totalCount / list.pageSize }"></c:set>
<c:set var="totalPage" value="${tmpTotalPage + (1 - (tmpTotalPage % 1)) % 1}"></c:set>
<c:set var="startPage" value="1"></c:set>
<c:set var="endPage" value="9"></c:set>
<c:if test="${list.page > 5 }">
	<c:set var="startPage" value="${list.page - 5 }"></c:set>
	<c:set var="endPage" value="${list.page + 3 }"></c:set>
</c:if>
<c:if test="${endPage > totalPage }">
	<c:set var="endPage" value="${totalPage }"></c:set>
</c:if>

<input type="hidden" name="totalPage" value="${totalPage }" />

<nav aria-label="...">
	<ul class="pagination">
		<li class="page-item <c:if test="${list.page == 1 }">disabled</c:if>">
			<a class="page-link" onclick="chgPage(${list.page - 1})" tabindex="-1">Previous</a>
		</li>
		<c:forEach var = "i" begin = "${startPage }" end = "${endPage }">
			<c:if test="${i == list.page }">
			<li class="page-item active">
				<a class="page-link" onclick="chgPage(${i})">${i }</a>
			</li>
			</c:if>
			<c:if test="${i != list.page }">
			<li class="page-item" >
				<a class="page-link" onclick="chgPage(${i})">${i }</a>
			</li>
			</c:if>
		</c:forEach>
		<c:if test="${fn:length(list.logs) == 0}">
			<li class="page-item active">
				<a class="page-link">1</a>
			</li>
		</c:if>
		<li class="page-item <c:if test="${list.page == totalPage }">disabled</c:if>">
			<a class="page-link" onclick="chgPage(${list.page + 1})">Next</a>
		</li>
	</ul>
</nav>

