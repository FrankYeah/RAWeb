var UserID = "${userID}";//session
var userBUID = "${userBUID}";//session
   
/*****************載入頁面執行*************/
$(function () {
        /*取得該User是哪個 BU*/
       
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            data: {"userID": UserID},
            url: fubon.contextPath + "roleManage/Role/Admin/Item",
            success: function (data, response, xhr) {
            	//alert(data)
                var temp = JSON.parse(data).Data;
                var userIDdata = JSON.parse(temp);
                var BUID = userIDdata.BUID;
           
                var BUIDtemp;
                /*判斷單位是否是 0000*/
                if (typeof(BUID) == "undefined") {
                    var userIDs = userIDdata.BUs;
                    for (var i = 0; i < userIDs.length; i++) {
                        BUIDtemp = userIDs[0].BUID;
                        $("#buId").append($("<option></option>")
                            .attr("value", userIDs[i].BUID)
                            .attr("buname", userIDs[i].BUName)
                            .text(userIDs[i].BUName + userIDs[i].BUID));
                    }
                } else {
                    BUIDtemp = userIDdata.BUID;
                    $("#buId").append($("<option></option>").attr("value", userIDdata.BUID).text(userIDdata.BUName + userIDdata.BUID));
                }
                getBURoles(BUIDtemp);
            },
            error: function (xhr) {
                bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
            }
        });

        /*如果切換ID 下面 role表格也要改變*/
        $("select").change(function () {
            var str = "";
            $("select option:selected").each(function () {
                str += $(this).val();
            });
            getBURoles(str);
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
                console.log(functionData);
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


    /*****************載入頁面執行END*************/
    /*新增BUID下的 Role*/
    $("#submitBtn").click(function () {
        var funScope = $("input[type='checkbox']:checked").map(function () {
            return this.value;
        }).get();
        var $bu = $("#buId").find(":selected");
        var ajaxData = {
            "BUID": $bu.val(),
            "RoleID": $("#roleID").val(),
            "RoleName": $("#roleName").val(),
            "RoleDesc": $("#roleDesc").val(),
            "FunScope": String(funScope),
            "BUName": $bu.attr("buname")
        };
        if (groupInputValidate()) {
            /*新增Role*/
            $.ajax({
                type: "POST",
                contentType: 'application/json',
                url: fubon.contextPath + "roleManage/Role/addRole",
                data: JSON.stringify(ajaxData)
            }).done(function (data, textStatus, jqXHR) {
                bootsrapAlert("權限新增成功");
                var all_Inputs = $("input[type=text]");
                all_Inputs.val("");
                $("input[type='checkbox']").attr("checked", false);

                /*更新 Role 列表*/
                getBURoles($("#buId").find(":selected").val());
            }).fail(function (jqXHR, textStatus, errorThrown) {
                ShowExceptionDialog(jqXHR.responseText);
            });
        }
    });


    /*該 BUID下的 Role*/
    function getBURoles(BUID) {
        console.log("~~~~" + BUID);
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            data: {"buId": BUID},
            url: fubon.contextPath + "roleManage/Role/roleList",
            success: function (data, response, xhr) {
            	//alert(data);
                var temp = JSON.parse(data);
                var tableData = JSON.parse(temp.Data).Roles;
                console.log(tableData);
                $("#roleTable").find("tr:gt(0)").remove();
                if(tableData.length==0){
                	var str = "<tr><td colspan='5' align='center'>此單位目前沒有權限內容</td></tr>";
                    $('#roleTable').append(str);
                    
                }else{
                  for (var i = 0; i < tableData.length; i++) {
                    var str = "<tr><td> </td><td> </td><td> </td><td> </td><td> </td></tr>";
                    $('#roleTable').append(str);
                    var $specifyTd = $('#roleTable tr:last').find('td');
                    var funname = JSON.parse(tableData[i].FunName);

                    var funname_p = "";
                    for (var j = 0; j < funname.length; j++) {
                    	funname_p += "<p>" + funname[j] + "</p>";
                    }

                    $specifyTd.eq(0).text(tableData[i].BUName +" "+ tableData[i].BUID );
                    $specifyTd.eq(1).text(tableData[i].RoleID);
                    $specifyTd.eq(2).text(tableData[i].RoleName);
                    $specifyTd.eq(3).text(tableData[i].RoleDesc);
                    //$specifyTd.eq(4).text(tableData[i].FunScope);
                    $specifyTd.eq(4).append(funname_p);
                  }
                }
            },
            error: function (xhr) {
                bootsrapAlert("err: " + xhr.status + ' '
                    + xhr.statusText);
            }
        });
    }


    function groupInputValidate() {
        RERoleName = /^[A-Za-z0-9\u4e00-\u9fa5\.\_\-\(\)\{\}\[\]\/\\]{1,100}$/;
        RERoleId = /^[A-Za-z0-9]{1,10}$/;
        RERoleIdAll = /^(?!(All|all|ALL|ALl|AlL|alL)$)/;
        REBUId = /^[A-Za-z0-9]{1,10}$/;

        var roleName = $("#roleName").val();
        var roleID = $("#roleID").val();
        var roleDesc = $("#roleDesc").val();
        var buID = $("#buId").find(":selected").val();

        if (!REBUId.test(buID)) {
            bootsrapAlert("請選擇欲加入的單位 ID");
            return false;
        }
        if (!RERoleId.test(roleID)) {
            bootsrapAlert("欲加入的權限代碼最大長度為10，可含英文和數字");
            return false;
        }

        if (!RERoleIdAll.test(roleID)) {
            bootsrapAlert("此權限代碼被保留");
            return false;
        }

        if (!RERoleName.test(roleName)) {
            bootsrapAlert("欲加入的權限名稱最大長度為100，可含中文,英文,數字,底線(_),連結線(-),單點(.),括弧((),[],{}),斜線(/, \\)");
            return false;
        }
        if (roleDesc.trim() == "") {
            bootsrapAlert("請輸入欲加入的權限描述");
            return false;
        }

        var $checkboxes = $("input[type='checkbox']");
        var check = true;
        for (i = 0; i < $checkboxes.length; i++) {
            if ($checkboxes[i].checked == true) {
                check = false;
            }
        }

        if (check) {
            bootsrapAlert("請勾選功能範圍");
            return false;
        }

        return true;
    }