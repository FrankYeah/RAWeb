let originData;
let submitDataSet = {"houseViewParamList" : []}
// 預設buId？
searchHouseView('0001')
function searchHouseView(buId){
    var searchReq = {keyword:'', buId:buId};
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
                if (buId != "") {
                    bootsrapAlert(data.Detail);
                }
            }else{
                var productHouseViewParamList = data.Data.productHouseViewParamList;
                $(".Msg").empty();
                $("#productTable").find("tr:gt(0)").remove();
                $("#buId").find(":selected").val();

                for(var i=0; i<productHouseViewParamList.length;i++){
                    var str = "<tr> <td class='wn'> </td><td> </td><td><input style='border:0px; background-color: rgba(0%, 0%, 100%, 0); text-align:center' value='%'/> </td><td><input style='border:0px; background-color: rgba(0%, 0%, 100%, 0); text-align:center' value='%'/> </td></tr>";
                    $('#productTable').append(str);
                    var $specifyTd = $('#productTable tr:last').find('td');
                    $specifyTd.eq(0).text(productHouseViewParamList[i].productCode);
                    $specifyTd.eq(1).text(productHouseViewParamList[i].productName);
                    var $specifyInput = $('#productTable tr:last').find('input');
                    if (productHouseViewParamList[i].oldERoR1Y) {
                        $specifyInput[0].value = productHouseViewParamList[i].oldERoR1Y * 100 +'%';
                    }
                    if (productHouseViewParamList[i].oldConfLevel) {
                        $specifyInput[1].value = productHouseViewParamList[i].oldERoR1Y * 100 +'%';
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
    $("#submitBtn").click(function() {
        for(var i=0; i<originData.Data.productHouseViewParamList.length;i++){
            var inputNum= $('#productTable tr').find('input');
            var submitArray = {
                "productCode" : originData.Data.productHouseViewParamList[i].productCode, 
                "productERoR1Y" : Number(inputNum[0+i*2].value.substring(0, inputNum[0+i*2].value.length-1))/100,   
                "productConfLevel" : Number(inputNum[1+i*2].value.substring(0, inputNum[0+i*2].value.length-1))/100
            }
            submitDataSet.houseViewParamList.push(submitArray);
        }
        console.log('submitdataset')
        console.log(submitDataSet)
        sendModifyView(submitDataSet);
    });
});

function sendModifyView(SubData){
    // fakeData = {
    //     "houseViewParamList" : [{
    //             "productCode" : "0052",  // 金融商品代碼
    //             "productERoR1Y" : 0.1,   // 觀點參數簽核單裡填寫的預期年報酬率，介於0-1之間的數字
    //             "productConfLevel" : 0.2 // 觀點參數簽核單裡填寫的信心水準，介於0-1之間的數字
    //         }]
    // }
    
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/updateHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(SubData),
        success : function(data, response, xhr) {
            //清空資料
            submitDataSet = {"houseViewParamList" : []};
            // 權限？
            console.log('send data')
            console.log(data)
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
                bootsrapAlert("資料成功送出" + data.Status);                
            }
        },
        error : function(xhr) {
            //清空資料
            submitDataSet = {"houseViewParamList" : []};
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });
}


$(function() {
    /* 取消送出資料 */
    $("#cancelBtn").click(function() {
        searchHouseView('0001')
    });
});