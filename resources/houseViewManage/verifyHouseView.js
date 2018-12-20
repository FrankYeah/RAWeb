let originData;
let rejectOrApprove = {
    "approveFlowIdList" : [],
    "rejectFlowIdList" : [] 
}
searchHouseView('0001')
function searchHouseView(buId){
    var searchReq = {keyword:'', buId:buId};
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/searchHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(searchReq),
        success : function(data, response, xhr) {
            
            originData = data;
            
            if(data.Status === "Error"){
                $("#productTable").find("tr:gt(0)").remove();
                $(".Msg").empty().append(data);
                if (buId != "") {
                    bootsrapAlert(data.Detail);
                }
            }else{
                var productHouseViewParamList = data.Data.productHouseViewParamList;
                $(".Msg").empty();
                $("#productTable").find("tr:gt(0)").remove();
                $("#buId").find(":selected").val();

                for(var i=0; i<productHouseViewParamList.length;i++){
                    var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td></tr>";
                    $('#productTable').append(str);
                    var $specifyTd = $('#productTable tr:last').find('td');
                    $specifyTd.eq(0).text(productHouseViewParamList[i].productCode);
                    $specifyTd.eq(1).text(productHouseViewParamList[i].productName);
                    if (productHouseViewParamList[i].oldERoR1Y) {
                        $specifyTd.eq(2).text(productHouseViewParamList[i].oldERoR1Y * 100 + '%');
                    }
                    if (productHouseViewParamList[i].oldConfLevel) {
                        $specifyTd.eq(3).text(productHouseViewParamList[i].oldConfLevel * 100 + '%');
                    }
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
        for(i=0 ; i<originData.Data.productHouseViewParamList.length; i++){
            if(originData.Data.productHouseViewParamList[i].flowId != null){
                rejectOrApprove.approveFlowIdList.push(originData.Data.productHouseViewParamList[i].flowId)
            }
        }
        rejectView(rejectOrApprove);
    });
});

function rejectView(answerData){
    // let fakeData = {
    //     "approveFlowIdList" : ["fe9b7f8d-aad7-4330-9523-838b3fa1c9eb"], // 可以通過審核的觀點參數簽核單 id
    //     "rejectFlowIdList" : [] // 要駁回審核的觀點參數簽核單 id
    // }
    
    console.log(answerData)
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/verifyHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(answerData),
        success : function(data, response, xhr) {
            console.log(data)
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            data = {
                "Data": {},
                "Status": "Ok",
                "Code": null,
                "API": "v1.01 [update:2018-07-09]",
                "Detail": null
            }
            
            if(data.Status === "Error"){
                bootsrapAlert(data.Detail);               
            }else{
                bootsrapAlert('完成任務'); 
            }
        },
        error : function(xhr) {
            //清空資料
            rejectOrApprove = {
                "approveFlowIdList" : [],
                "rejectFlowIdList" : [] 
            }
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });
}