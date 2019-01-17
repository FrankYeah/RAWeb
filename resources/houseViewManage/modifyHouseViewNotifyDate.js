var storeData;
getListNote();
function getListNote(){

    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/listNotifyConfig",
        contentType : 'application/json;charset=UTF-8',
        data : '',
        success : function(data, response, xhr) {
            storeData = data;

            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();

            }else{
                var productHouseViewParamList = data.Data.productHouseViewNotifyConfigList;
                $("#productTable").find("tr:gt(0)").remove();

                for(var i=0; i<productHouseViewParamList.length;i++){
                    var str = "<tr><td class='wn'> </td><td> </td><td><button onClick=delDate(this) class='btn btn-primary'>刪除</button> </td> </tr>";
                    $('#productTable').append(str);
                    var $specifyTd = $('#productTable tr:last').find('td');
                    $specifyTd.eq(0).text(productHouseViewParamList[i].startDate);
                    $specifyTd.eq(1).text(productHouseViewParamList[i].endDate);
                    $('#productTable tr').find('button')[i].name = i;
                }

            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });

    // 回傳間隔值
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/getNotifyPeriod",
        contentType : 'application/json;charset=UTF-8',
        data : '',
        success : function(data, response, xhr) {
            console.log(data)

            if(data.Status === "Error"){
                
            }else{
                $('div div').find('input')[2].value = data.Data.period;
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });



}

// 新增
$("#addBtn").click(function() {
    // 判斷有沒有加 0
    var getInput = $('div div').find('input');

    var startMonth = getInput[0].value;
    var startDay = getInput[1].value;
    var endMonth = getInput[3].value;
    var endDay = getInput[4].value;

    if(getInput[0].value.length==1){
        startMonth = '0' + getInput[0].value;

    }
    if(getInput[1].value.length==1){
        startDay = '0' + getInput[1].value;
    }
    if(getInput[3].value.length==1){
        endMonth = '0' + getInput[3].value;
    }
    if(getInput[4].value.length==1){
        endDay = '0' + getInput[4].value;
    }

    var addData = {
        "startDate" : startMonth + "/" + startDay, // 通知開始日 (格式為 "MM/dd")
        "endDate" : endMonth + "/" + endDay,   // 通知結束日 (格式為 "MM/dd")
        "period" : getInput[2].value           // 通知週期，每隔儿日發送一次通知
    };
    console.log(addData)

    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/addNotifyConfig",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(addData),
        success : function(data, response, xhr) {

            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();
                getListNote()

            }else{
                $("#productTable").find("tr:gt(0)").remove();
                getListNote();
                
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });

})


// 刪除
function delDate(e){
    console.log(e)
    var delData = {
        "notifyConfigId" : storeData.Data.productHouseViewNotifyConfigList[e.name].id // 該筆通知設定的 uuid
    }

    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/delNotifyConfig",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(delData),
        success : function(data, response, xhr) {

            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();
                getListNote()

            }else{
                $("#productTable").find("tr:gt(0)").remove();
                getListNote();
                
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });

}

//更新
$("#newBtn").click(function() {
    var getInput = {
        "period" :  $('div div').find('input')[2].value // 通知週期，每隔儿日發送一次通知
    }

    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/setNotifyPeriod",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(getInput),
        success : function(data, response, xhr) {
            console.log(data)
            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();
                getListNote()

            }else{
                $("#productTable").find("tr:gt(0)").remove();
                getListNote();
                
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });
})