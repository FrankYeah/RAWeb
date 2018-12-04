<%@ page language="java" contentType="text/html; charset=UTF-8"
		 pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<%@include file="/resources/commons/decelerations.jsp"%>
	<link href="<c:url value="/resources/css/system/common.css" />" rel="stylesheet" />
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">

	<title>appprofile - showAppprofile</title>
</head>
<body>
<jsp:include page="../nav.jsp"></jsp:include>
<div class="container page-header">

	<jsp:include page="title.jsp"></jsp:include>
	<br>
	<br>
	<br>
	<br>
	<div class="col-sm-3" style="align:left">
		<button id="deleteBtn" type="button" class="btn btn-primary">刪除</button>
	</div>
	<label for="appName" class="control-label col-sm-3"> 應用程式設定檔名稱 :</label>
	<div class="col-sm-3 form-group">
		<input type="text" id="appName" name="appName" class="form-control"/>
	</div>
	<div class="col-sm-3" style="align:left">
		<button id="submitBtn" type="button" class="btn btn-primary">搜尋</button>
	</div>
	<div class="content-1">
		<div class="content-2">
			<table id ="userTable" class="table table-bordered table-striped table-hover">
				<thead>
				<tr class="info">
					<th class="text-center">刪除</th><th class="text-center">設定檔名稱</th><th class="text-center">JDBC網址</th><th class="text-center">DB帳號</th>
				</tr>
				</thead>
				<tbody>
				</tbody>
			</table>
		</div>
	</div>
<script type="text/javascript">
$(function() {
    searchProfile("");
	/*搜尋商品*/
	$("#submitBtn").click(function() {
		var appName = $('#appName').val();
		if(appName.length > 0 && validateInput(appName)){
			searchProfile(appName);
		}else{
            searchProfile("");
		}
	});

    $("#deleteBtn").on('click', function () {
        var checkedProfiles = $("#userTable input:checked");
        if (checkedProfiles.length === 0) {
            bootsrapAlert("請選取欲刪除的單位");
            return;
        } else {
            BootstrapDialog.show({
                title: '訊息',
                message: "確定刪除嗎？",
                buttons: [{
                    label: '確定',
                    action: function (dialogRef) {
                        deleteProfile(checkedProfiles);
                        dialogRef.close();
                    }
                }, {
                    label: '取消',
                    action: function (dialogRef) {
                        dialogRef.close();
                    }
                }]
            });
        }
    });
});


/*用ID取資料*/
function searchProfile(appName){
	$.ajax({
		type : "POST",
		contentType : 'application/json',
		data : JSON.stringify({"appName": appName}),
		url : fubon.contextPath+"SystemManage/searchForProfile",
		success : function(data, response, xhr) {
			$("#userTable").find("tr:gt(0)").remove();
			if (data.length==0){
				bootsrapAlert("此ID無相關資料!");
				var str = "<tr><td colspan='6'>此ID無相關資料!</td></tr>";
				$('#userTable').append(str);
			}else{
				for(var i = 0; i < data.length; i++){
					var str = "<tr><td> </td><td> </td><td> </td><td> </td>";
					$('#userTable').append(str);
					var $specifyTd = $('#userTable tr:last').find('td');

					var checkbox = $('<input />', {type: 'checkbox',
						appName: data[i].appName,
                        apiKey: data[i].apiKey,
                        jdbcUrl: data[i].jdbcUrl,
						dbAccount: data[i].dbAccount
					});

					$specifyTd.eq(0).append(checkbox);
					$specifyTd.eq(1).text(data[i].appName);
					$specifyTd.eq(2).text(data[i].jdbcUrl);
					$specifyTd.eq(3).text(data[i].dbAccount);
				}
			}

		},
		error : function(xhr) {
			bootsrapAlert("err: " + xhr.status + ' '
				+ xhr.statusText);
		}
	});
}

function deleteProfile(checkedProfiles) {
    var ajaxData = [];
    checkedProfiles.each(function(idx, el){
        ajaxData.push({"appName": $(el).attr("appName"),
					   "jdbcUrl": $(el).attr("jdbcUrl"),
					   "dbAccount": $(el).attr("dbAccount"),
					   "apiKey": $(el).attr("apiKey"),
        });
    });

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(ajaxData),
        url: fubon.contextPath + "SystemManage/delForProfile"
    }).done(function(data, textStatus, jqXHR) {
        bootsrapAlert("刪除成功");
		searchProfile("");
		$('#appName').val('');
    }).fail(function (jqXHR, textStatus, errorThrown) {
        var returnData, message;
        try {
            returnData = JSON.parse(jqXHR.responseText).message;
            message = (returnData.exception) ? returnData.message : jqXHR.responseText;
        } catch(ex) {
            message = jqXHR.responseText;
        }


        BootstrapDialog.show({
            type: BootstrapDialog.TYPE_WARNING,
            message: message
        });
    });
}


/* 檢核輸入資料合理性 */
function validateInput(str){
	//檢核格式
	if(!REName.test(str)){
		bootsrapAlert("使用者ID最大長度為24, 僅限英文,數字,點(.),底線(_),連結線(-)");
		return false;
	}

	return true;
}

</script>
<script type="text/javascript">
	var projectName = "<%= request.getContextPath()%>";
	var roleScope = ${roleScope}.functions;
	getNavBar(roleScope);
</script>
</body>
</html>