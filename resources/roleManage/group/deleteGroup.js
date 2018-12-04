$(function() {

    /*取得該User是哪個 BU*/
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        data: {"userID": UserID},
        url: fubon.contextPath + "roleManage/Role/Admin/Item",
        success: function (jsonData, response, xhr) {
           
            var data = JSON.parse(jsonData).Data;
            var buInfo = JSON.parse(data);
    		var BUID = buInfo.BUID;
    		//alert(BUID);
            //var buID = JSON.parse(buInfo).BUID;
            if (typeof(BUID) == "undefined") {
            	var buList = buInfo.BUs;
                for (var i = 0; i < buList.length; i++) {
                   var bu = buList[i];
                
                   $("#buId").append($("<option/>")
                    .attr("value", bu.BUID)
                    .attr("buname", bu.BUName)
                    .text(bu.BUName + bu.BUID));
                }
                displayRoleTable(buList[0].BUID);
                
            }else{
            	 $("#buId").append($("<option></option>").attr("value", buInfo.BUID).attr("buname", buInfo.BUName).text(buInfo.BUName + buInfo.BUID));
            	 displayRoleTable(buInfo.BUID);
            }
        },
        error: function (xhr) {
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        }
    });
    
    /*如果切換ID 下面 role表格也要改變*/
    $("select").change(function () {
    	    
    	var BUID = $("#buId").find(":selected").val();
    	//alert(BUID)
        displayRoleTable(BUID);       
     });
    
    
    /*查詢 BUID 下的 Roles*/
    $("#submitBtn").on('click', function () {
        var BUID = $("#buId").find(":selected").val();
        displayRoleTable(BUID);
    });
 

    /*刪除Roles*/
    $("#submitBtnDel").on('click', function () {
        if (groupDelValidate()) {
            BootstrapDialog.show({
                title: '訊息',
                message: "刪除權限後，該權限的所有使用者皆會刪除，確定刪除嗎？",
                buttons: [{
                    label: '確定',
                    action: function (dialogRef) {
                        deleteRoles();
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

    function groupDelValidate() {
        var $checkboxes = $("input[type='checkbox']");
        var check = true;
        for (i = 0; i < $checkboxes.length; i++) {
            if ($checkboxes[i].checked == true) {
                check = false;
            }
        }

        if (check) {
            bootsrapAlert("請選取欲刪除的權限");
            return false;
        }

        return true;

    }

    /*刪除 Roles*/
    function deleteRoles() {
        // /*整理要被刪除的資訊*/
        // var roleIDs = $("input[type='checkbox']:checked").map(function () {
        //     return this.value;
        // }).get();
        // var BUIDs = $("input[type='checkbox']:checked").map(function () {
        //     return this.name;
        // }).get();
        // var delRole = {
        //     "BUID": String(BUIDs),
        //     "BUName": String(roleIDs)
        // }; //roleIDs actually

        var roles = $("#roleTable").find("input[type='checkbox']:checked").map(function() {
            return {
                BUID: $(this).attr("buid"),
                BUName: $(this).attr("buname"),
                RoleID: $(this).attr("roleid"),
                RoleName: $(this).attr("rolename"),
                RoleDesc: $(this).attr("roledesc"),
                FunScope: $(this).attr("funscope")
            };
        }).get();

        $.ajax({
            type: "POST",
            contentType: 'application/json',
            data: JSON.stringify(roles),
            url: fubon.contextPath + "roleManage/Group/deleteGroup",
            success: function (data, response, xhr) {
                bootsrapAlert("權限刪除成功");
                var BUID = $("#buId").find(":selected").val();
                displayRoleTable(BUID);
            },
            error: function (xhr) {
                ShowExceptionDialog(jqXHR.responseText);
            }
        });
    }

    /*取得 BUID 下的 Roles 放入待刪除的 Rolestable*/
    function displayRoleTable(buid) {
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            data: {"buId": buid},
            url: fubon.contextPath + "roleManage/Role/roleList",
            success: function (data, response, xhr) {
                var temp = JSON.parse(data);
                var roles = JSON.parse(temp.Data).Roles;
                $("#roleTable").find("tr:gt(0)").remove();
                if(roles.length==0){
                	var str = "<tr><td colspan='6' align='center'>此單位目前沒有權限內容</td></tr>";
                    $('#roleTable').append(str);
                    $("#submitBtnDel").attr("disabled", true);
                }else{
                  $("#submitBtnDel").attr("disabled", false);
                  for (var i = 0; i < roles.length; i++) {
                    var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
                    $('#roleTable').append(str);
                    var role = roles[i];
                    var $specifyTd = $('#roleTable tr:last').find('td');
                    var checkbox = $('<input />', {
                        type: 'checkbox',
                        id: role.BUID + i,
                        name: role.BUID,
                        value: role.RoleID,
                        buid: role.BUID,
                        buname: role.BUName,
                        roleid: role.RoleID,
                        rolename: role.RoleName,
                        roledesc: role.RoleDesc,
                        funscope: role.FunScope
                    });
                    var funname = JSON.parse(role.FunName);

                    var p = "";
                    for (var j = 0; j < funname.length; j++) {
                        p += "<p>" + funname[j] + "</p>";
                    }
                    $specifyTd.eq(0).append(checkbox);
                    $specifyTd.eq(1).text(role.BUName+" "+ role.BUID);
                    $specifyTd.eq(2).text(role.RoleID);
                    $specifyTd.eq(3).text(role.RoleName);
                    $specifyTd.eq(4).text(role.RoleDesc);
                    //$specifyTd.eq(4).text(role.FunName);
                    $specifyTd.eq(5).append(p);
                  }
                }
                $("#submitBtnDel").removeAttr("style");
            },
            error: function (xhr) {
                bootsrapAlert("err: " + xhr.status + ' '
                    + xhr.statusText);
            }
        });
    }

});
