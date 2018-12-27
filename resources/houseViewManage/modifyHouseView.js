let originData;
let submitDataSet = {"houseViewParamList" : []}
let profitNum;
let levelNum;

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

                for(var i=0; i<productHouseViewParamList.length;i++){
                    var str = "<tr> <td class='wn'> </td><td> </td><td><input onchange='changeColor(this)' style='color:grey; border:0px; background-color: rgba(0%, 0%, 100%, 0); text-align:center' value='%'/> </td><td><input onchange='changeColor(this)' style='color:grey; border:0px; background-color: rgba(0%, 0%, 100%, 0); text-align:center' value='%'/> </td></tr>";
                    $('#productTable').append(str);
                    var $specifyTd = $('#productTable tr:last').find('td');
                    $specifyTd.eq(0).text(productHouseViewParamList[i].productCode);
                    $specifyTd.eq(1).text(productHouseViewParamList[i].productName);
                    var $specifyInput = $('#productTable tr:last').find('input');
                    if (productHouseViewParamList[i].oldERoR1Y) {
                        $specifyInput[0].value = parseFloat((productHouseViewParamList[i].oldERoR1Y * 100).toPrecision(12)) +'%';
                    }
                    if (productHouseViewParamList[i].oldConfLevel) {
                        $specifyInput[1].value = parseFloat((productHouseViewParamList[i].oldConfLevel * 100).toPrecision(12)) +'%';
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
            var submitArray;
            if(inputNum[0+i*2].value.length == 1 && inputNum[1+i*2].value.length > 1){
                alert('不可單一邊為空值')
                return
            }
            if(inputNum[0+i*2].value.length > 1 && inputNum[1+i*2].value.length == 1){
                alert('不可單一邊為空值')
                return
            }
            if(inputNum[0+i*2].value.length == 1){
                profitNum = null;
            }else{
                profitNum = parseFloat((Number(inputNum[0+i*2].value.substring(0, inputNum[0+i*2].value.length-1))/100).toPrecision(12));
            }

            if(inputNum[1+i*2].value.length == 1){
                levelNum = null;
            }else{
                levelNum = parseFloat((Number(inputNum[1+i*2].value.substring(0, inputNum[1+i*2].value.length-1))/100).toPrecision(12));
            }
            submitArray = {
                "productCode" : originData.Data.productHouseViewParamList[i].productCode, 
                "productERoR1Y" : profitNum,   
                "productConfLevel" : levelNum
            }
            submitDataSet.houseViewParamList.push(submitArray);
            

            if(Number(inputNum[0+i*2].value.substring(0, inputNum[0+i*2].value.length-1))/100 == originData.Data.productHouseViewParamList[i].oldERoR1Y && Number(inputNum[1+i*2].value.substring(0, inputNum[1+i*2].value.length-1))/100 == originData.Data.productHouseViewParamList[i].oldConfLevel){
            }else{
            }
 
        }
        console.log(submitDataSet)
        sendModifyView(submitDataSet);
    });
});

function sendModifyView(SubData){
    
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/updateHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(SubData),
        success : function(data, response, xhr) {
            //清空資料
            submitDataSet = {"houseViewParamList" : []};
            // 
            console.log(data)
       
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
        searchHouseView()
    });
});

function changeColor(e){
    e.style.color = 'black';
}