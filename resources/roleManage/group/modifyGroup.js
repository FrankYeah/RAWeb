$(function() {

    var $buid = $("#buId");
    $("#submitBtn").click(function () {

        var roleID = $("#roleID").val();
        if (roleID==""){
        	bootsrapAlert("請選擇欲修改的權限代碼");
        }
    	
    });
    var modifyRole = function(buid, updatedRole, originRole){
        var ajaxData = {updated: updatedRole, origin: originRole};
        $.ajax({
            type: "POST",
            contentType: 'application/json',
            url: fubon.contextPath + "roleManage/Role/modifyRole",
            data: JSON.stringify(ajaxData)
        }).done(function (data, textStatus, jqXHR) {
            bootsrapAlert("權限修改成功");
            var all_Inputs = $("input[type=text]");
            all_Inputs.val("");
            $("input[type='checkbox']").attr("checked", false);

            /*更新 Role 列表*/
            displayBUTable(buid);
        }).fail(function (jqXHR, textStatus, errorThrown) {
            ShowExceptionDialog(jqXHR.responseText);
        });
    };

    var selectRole = function(role){
        var buid = role.BUID;
        var roleid = role.RoleID;
       
        $.ajax({
            type : "GET",
            contentType : 'application/json',
            url : fubon.contextPath+"roleManage/Role/"+buid+"/"+roleid,
            success : function(data, response, xhr) {
                var modiData = JSON.parse(JSON.parse(data).Data);
                $('input:checkbox').prop("checked", false);

                $('#roleID').val(modiData.RoleID);
                $('#roleName').val(modiData.RoleName);
                $('#roleDesc').val(modiData.RoleDesc);
                
                var scope = modiData.FunScope;
                var scopeArray = scope.split(",");
                for(var i = 0; i<scopeArray.length;i++){
                    $("input[type='checkbox'][value='"+scopeArray[i]+"']").prop("checked", true);
                }
            },
            error : function(xhr) {
                bootsrapAlert("err: " + xhr.status + ' '
                    + xhr.statusText);
            }
        });

        /*新增BUID下的 Role*/
       var $button = $("#submitBtn");
        
       $button.off();

        
       $button.click(function () {
        	
            var funScope = $("input[type='checkbox']:checked").map(function () {
                return this.value;
            }).get();
            var $bu = $("#buId").find(":selected");
            var updatedRole = {
                "BUID": $bu.val(),
                "RoleID": $("#roleID").val(),
                "RoleName": $("#roleName").val(),
                "RoleDesc": $("#roleDesc").val(),
                "FunScope": String(funScope),
                "BUName": $bu.attr("buname")
            };

            if (groupInputValidate()) {
                /*修改 Role*/
            	
                modifyRole($bu.val(), updatedRole, role);
            }
        	
        });
       
    };


    /*該 BUID下的 Role*/
    var displayBUTable = function(BUID){
        $.ajax({
            type : "GET",
            contentType : 'application/json',
            data :{"buId":BUID},
            url : fubon.contextPath+"roleManage/Role/roleList",
            success : function(data, response, xhr) {
                var temp = JSON.parse(data);
                var roles = JSON.parse(temp.Data).Roles;
                $("#roleTable").find("tr:gt(0)").remove();
                if(roles.length==0){
                	var str = "<tr><td colspan='5' align='center'>此單位目前沒有權限內容</td></tr>";
                    $('#roleTable').append(str);
                    
                }else{
                  for(var i=0; i<roles.length;i++){
                    var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
                    var role = roles[i];
                    $('#roleTable').append(str);

                    var clickHandler = function(role) {
                        return function () {
                            selectRole(role);
                        };
                    };

                    var $roleID = $("<a/>").attr("href", "#").html(role.RoleID);
                    $roleID.click( clickHandler(role) );

                    var funname = JSON.parse(role.FunName);
                    var htmlFuns = "";
                    for (var j = 0;j <funname.length;j++){
                        htmlFuns += "<p>"+funname[j]+"</p>";
                    }

                    var $specifyTd = $('#roleTable tr:last').find('td');
                    $specifyTd.eq(0).text(role.BUName+" "+role.BUID);
                    $specifyTd.eq(1).append($roleID);
                    $specifyTd.eq(2).text(role.RoleName);
                    $specifyTd.eq(3).text(role.RoleDesc);
                    //$specifyTd.eq(4).text(role.FunName);
                    $specifyTd.eq(4).append(htmlFuns);
                  }
                }
            },
            error : function(xhr) {
                bootsrapAlert("err: " + xhr.status + ' '
                    + xhr.statusText);
            }
        });
    }


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
            // alert(BUID)
             if (typeof(BUID) == "undefined") {
            	 var buList = buInfo.BUs;
            	 for (var i = 0; i < buList.length; i++) {
            		 var bu = buList[i];
            		 $("#buId").append($("<option/>")
            				 .attr("value", bu.BUID)
            				 .attr("buname", bu.BUName)
            				 .text(bu.BUName + bu.BUID));
            	 }
            	 displayBUTable($("#buId").find(":selected").val());
             }else{
            	 $("#buId").append($("<option></option>").attr("value", buInfo.BUID).attr("buname", buInfo.BUName).text(buInfo.BUName + buInfo.BUID));
            	 displayBUTable($("#buId").find(":selected").val());
             }
        },
        error: function (xhr) {
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        }
    });

    /*如果切換ID 下面 role表格也要改變*/
    $("select").change(function () {
    	    
            var str = "";
            $("select option:selected").each(function () {
                str += $(this).val();
            });
            displayBUTable(str);
            /*清除表單內容*/
            var all_Inputs = $("input[type=text]");
            all_Inputs.val("");
            $('input:checkbox').prop("checked", false);
        })
        .change();

    /*取得所有功能列表*/
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: fubon.contextPath + "roleManage/Role/functionList",
        success: function (data, response, xhr) {
            var temp = JSON.parse(data);
            var functionData = JSON.parse(temp.Data).functions;
            var container = $('#checkboxForm');
            var treeData = groupProcess(functionData);

            for (var i = 0; i < treeData.length; i++) {
                container.append("<li></li>");
                var type1 = treeData[i];
                var typ2ulcheckbox = $('<ul class="checkBX">');
                var typ2ul = $('<ul>');
                var type1li = $('#checkboxForm li:last');
                for (var j = 0; j < type1.type2.length; j++) {
                   var type2 = type1.type2[j];
                   if(type2.type3.length > 0){
                       var typ3ul = $('<ul class="checkBX">');
                       var count = 0;
                       for (var k = 0; k < type2.type3.length; k++) {
                           var type3 = type2.type3[k];
                           count = count + 1;
                           var type3Content = $('<li>').append($('<input />', {
                               type: 'checkbox',
                               id: 'cb' + i + j + k,
                               value: type3.FID
                           }))
                               .append(" (" + count + ") " + type3.FName);
                           typ3ul.append(type3Content);
                       }//layer3 for end
                       var type2Content = $('<li style="list-style-type:square">').append(type2.FName);
                       typ2ul.append(type2Content).append(typ3ul);
                   }else{
                       var number = j + 1;
                       var type2Content = $('<li>').append($('<input />', {
                           type: 'checkbox',
                           id: 'cb' + i + j,
                           value: type2.FID
                       }))
                           .append(" (" + number + ") " + type2.FName);
                       typ2ulcheckbox.append(type2Content);
                   }
                }
                //如果此功能同時有2層和3則都要綁定上選單列,其他則依照原結構去綁定
                if(typ2ulcheckbox.find('li').length > 0 && typ2ul.find('li').length > 0){
                    type1li.append(type1.FName).append(typ2ulcheckbox).append(typ2ul);
                }else if(typ2ulcheckbox.find('li').length > 0){
                    type1li.append(type1.FName).append(typ2ulcheckbox);
                }else{
                    type1li.append(type1.FName).append(typ2ul);
                }
            }
        },
        error: function (xhr) {
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        }
    });

});


/* 將資料整理階層式架構*/
function groupProcess(functionData){
    var groupTree = [];
    for (var i = 0; i < functionData.length; i++) {
        groupTree[i] = functionData[i].type1;
        var group2data = [];
        for (var j = 0; j < functionData[i].type2.length; j++) {
            var type2FID = functionData[i].type2[j].FID.substr(0,6);
            group2data[j] = functionData[i].type2[j];
            var group3data = [];
            for (var k = 0; k < functionData[i].type3.length; k++) {
                 var type3FID = functionData[i].type3[k].FID.substr(0,6);
                 if(type2FID === type3FID){
                     group3data.push(functionData[i].type3[k]);
                }
            }
            group2data[j].type3 = group3data;
        }
        groupTree[i].type2 = group2data;
    }
    console.log(groupTree);
    return groupTree;
}


function groupInputValidate() {

    var roleName = $("#roleName").val();
    var roleID = $("#roleID").val();
    var roleDesc =$("#roleDesc").val();

    var buID = $("#buId").find(":selected").val();
    
    if(!REBUId.test(buID)){
        bootsrapAlert("請選擇欲修改的單位 ID");
        return false;
    }
    if(!RERoleId.test(roleID)){
        bootsrapAlert("請點選欲修改的權限代碼");
        return false;
    }
    if(!RERoleName.test(roleName)){
        bootsrapAlert("欲修改的權限名稱最大長度為100，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
        return false;
    }

    if(roleDesc.trim()==""){
        bootsrapAlert("請輸入權限描述");
        return false;
    }

    var $checkboxes = $("input[type='checkbox']");
    var check = true;
    for (i = 0; i < $checkboxes.length; i++) {
        if ($checkboxes[i].checked == true) {
            check = false;
        }
    }

    var $checkboxes = $("input[type='checkbox']");
    var check = true;

    for (i = 0; i < $checkboxes.length; i++) {
        if ($checkboxes[i].checked == true) {
            check = false;
        }
    }

    if(check){
        bootsrapAlert("請勾選功能範圍");
        return false;
    }

    return true;
}

