let originData;
let rejectOrApprove = {
    "approveFlowIdList" : [],
    "rejectFlowIdList" : [] 
}
searchHouseView()
function searchHouseView(){
    var searchReq = {};
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/searchHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(searchReq),
        success : function(data, response, xhr) {
            console.log(data)
            originData = data;
            
            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();
                $(".Msg").empty().append(data);
            }else{
                var productHouseViewParamList = data.Data.productHouseViewParamList;
                $(".Msg").empty();
                $("#productTable").find("tr:gt(0)").remove();
                $('.button-all').css('display','none');

                var isWaitToVerify = false;
                for(var i=0; i<productHouseViewParamList.length;i++){
                    if (productHouseViewParamList[i].newERoR1Y != null && productHouseViewParamList[i].newConfLevel != null) {
                        var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td></tr>";
                        $('#productTable').append(str);
                        var $specifyTd = $('#productTable tr:last').find('td');
                        $specifyTd.eq(0).text(productHouseViewParamList[i].productCode);
                        $specifyTd.eq(1).text(productHouseViewParamList[i].productName);
                        $specifyTd.eq(2).text(parseFloat((productHouseViewParamList[i].newERoR1Y * 100).toPrecision(12)) + '%');
                        $specifyTd.eq(3).text(parseFloat((productHouseViewParamList[i].newConfLevel * 100).toPrecision(12)) + '%');
                        isWaitToVerify = true;
                    }
                }

                if (isWaitToVerify) {
                    $('.button-all').css('display','block');
                }
                
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });
}

$(function() {
    /* 送出資料 */
    $("#rejectBtn").click(function() {
        console.log(originData)
        for(i=0 ; i<originData.Data.productHouseViewParamList.length; i++){
            if(originData.Data.productHouseViewParamList[i].flowId != null){
                rejectOrApprove.rejectFlowIdList.push(originData.Data.productHouseViewParamList[i].flowId)
            }
        }
        rejectView(rejectOrApprove);
    });
});

$(function() {
    /* 送出資料 */
    $("#approveBtn").click(function() {
        console.log(originData)
        for(i=0 ; i<originData.Data.productHouseViewParamList.length; i++){
            if(originData.Data.productHouseViewParamList[i].flowId != null){
                rejectOrApprove.approveFlowIdList.push(originData.Data.productHouseViewParamList[i].flowId)
            }
        }
        approveView(rejectOrApprove);
    });
});

function rejectView(answerData){
    console.log(answerData)
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/verifyHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(answerData),
        beforeSend : function() {
            $("#rejectBtn").prop("disabled", true);
            $("#approveBtn").prop("disabled", true);
        },
        success : function(data, response, xhr) {
            console.log(data)
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            
            if(data.Status === "Error"){
                bootsrapAlert(data.Detail);
            }else{
                bootsrapAlert('駁回成功'); 
            }
            searchHouseView();
        },
        error : function(xhr) {
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
            searchHouseView();
        },
        complete : function () {
            $("#rejectBtn").removeAttr("disabled");
            $("#approveBtn").removeAttr("disabled");
        }
    });
}

function approveView(answerData){
    console.log(answerData)
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/verifyHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(answerData),
        beforeSend : function() {
            $("#rejectBtn").prop("disabled", true);
            $("#approveBtn").prop("disabled", true);
        },
        success : function(data, response, xhr) {
            console.log(data)
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            
            if(data.Status === "Error"){
                bootsrapAlert(data.Detail);
            }else{
                bootsrapAlert('覆核成功'); 
            }
            searchHouseView();
        },
        error : function(xhr) {
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
            searchHouseView();
        },
        complete : function () {
            $("#rejectBtn").removeAttr("disabled");
            $("#approveBtn").removeAttr("disabled");
        }
    });
}