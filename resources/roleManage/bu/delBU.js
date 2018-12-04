$(function () {
    //載入畫面傳入現在的BU列表
    getBUList();

    $("#submitBtn").on('click', function () {
        var $checkedBU = $("#buTable input:checked");
        if ($checkedBU.length === 0) {
            bootsrapAlert("請選取欲刪除的單位");
            return;
        } else {
            BootstrapDialog.show({
                title: '訊息',
                message: "刪除單位後，該單位的所有權限及使用者皆會刪除，確定刪除嗎？",
                buttons: [{
                    label: '確定',
                    action: function (dialogRef) {
                        deleteBU($checkedBU);
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
// function buDelValidate() {
//     var $checkboxes = $("input[type='checkbox']");
//     var check = true;
//     for (i = 0; i < $checkboxes.length; i++) {
//         if ($checkboxes[i].checked == true) {
//             check = false;
//         }
//     }
//
//     if (check) {
//         bootsrapAlert("請選取欲刪除的單位");
//         return false;
//     }
//
//     return true;
//
// }

function deleteBU($checkedBU) {
    var ajaxData = [];
    $checkedBU.each(function(idx, el){
        ajaxData.push({"BUID": $(el).attr("name"), "BUName": $(el).attr("buname"), "DBName": $(el).attr("dbname")});
    });

    $.ajax({
        type: "POST",
        contentType: 'application/json',
        data: JSON.stringify(ajaxData),
        url: fubon.contextPath + "roleManage/BU/delBU"
    }).done(function(data, textStatus, jqXHR) {
        BootstrapDialog.show({
            message: "刪除成功"
        });
        getBUList();
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

function getBUList() {
    $.ajax({
        type: "GET",
        contentType: 'application/json',
        url: fubon.contextPath + "roleManage/BU/listBU",
        success: function (data, response, xhr) {
            var temp = JSON.parse(data);
            var buData = JSON.parse(temp.Data);
            var tableData = buData.BUs;
            $("#buTable").find("tr:gt(0)").remove();
            for (var i = 0; i < tableData.length; i++) {
                var str = "<tr><td></td><td></td><td></td><td></td></tr>";
                $('#buTable').append(str);
                var $specifyTd = $('#buTable tr:last').find('td');
                var checkbox = $('<input />', {type: 'checkbox',
                    id: tableData[i].BUID,
                    name: tableData[i].BUID,
                    buname: tableData[i].BUName,
                    dbname: tableData[i].DBName
                });
                if (tableData[i].BUID == "0000") {
                    checkbox.attr("disabled", true);
                }
                $specifyTd.eq(0).append(checkbox);
                $specifyTd.eq(1).text(tableData[i].BUID);
                $specifyTd.eq(2).text(tableData[i].BUName);
                $specifyTd.eq(3).text(tableData[i].DBName);
            }

            $("#submitBtn").removeAttr("style");
        },
        error: function (xhr) {
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        }
    });

}
