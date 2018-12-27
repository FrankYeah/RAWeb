$(function() {
    /* 搜尋商品的觀點參數 */
    $("#searchBtn").click(function() {
        searchHouseView($("#buId").find(":selected").val());
        console.log($("#buId").find(":selected").val())
    });
});

/* 如果切換ID 下面查詢結果表格也要改變 */
$("select").change(function () {
    var buId = "";
    $( "select option:selected" ).each(function() {
      buId = $("#buId").find(":selected").val();
    });
    searchHouseView(buId);
  }).change();

/**
 * 查詢商品的觀點參數清單
 */
function searchHouseView(buId){
    var searchReq = {keyword:$("#productIdOrName").val(), buId:buId};
    $.ajax({
        type : "POST",
        url : fubon.contextPath+"houseViewManage/searchHouseView",
        contentType : 'application/json;charset=UTF-8',
        data : JSON.stringify(searchReq),
        success : function(data, response, xhr) {
            console.log(data)
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
                    var str = "<tr><td class='wn'> </td><td> </td><td> </td><td> </td><td> </td><td > </td></tr>";
                    $('#productTable').append(str);
                    var $specifyTd = $('#productTable tr:last').find('td');
                    $specifyTd.eq(0).text(productHouseViewParamList[i].productCode);
                    $specifyTd.eq(1).text(productHouseViewParamList[i].productName);
                    if (productHouseViewParamList[i].oldERoR1Y) {
                        $specifyTd.eq(2).text(parseFloat((productHouseViewParamList[i].oldERoR1Y * 100).toPrecision(12)) +'%');
                    }
                    if (productHouseViewParamList[i].oldConfLevel) {
                        $specifyTd.eq(3).text(parseFloat((productHouseViewParamList[i].oldConfLevel * 100).toPrecision(12)) +'%');
                    }
                    if (productHouseViewParamList[i].houseViewParamStartTime) {
                        $specifyTd.eq(4).text(productHouseViewParamList[i].houseViewParamStartTime);
                    }
                    if (productHouseViewParamList[i].houseViewParamEndTime) {
                        $specifyTd.eq(5).text(productHouseViewParamList[i].houseViewParamEndTime);
                    }
                }
            }
        },
        error : function(xhr) {
            bootsrapAlert("err: " + xhr.status + ' ' + xhr.statusText);
        }
    });
}

$("#downloadBtn").click(function() {
    var buId = $("#buId").find(":selected").val();
    var productIdOrName = $("#productIdOrName").val();

    console.log(fubon.contextPath+"houseViewManage/downloadHouseView?buId=" + buId + "&productIdOrName=" + encodeURIComponent(productIdOrName))
    location.href = fubon.contextPath+"houseViewManage/downloadHouseView?buId=" + buId + "&productIdOrName=" + encodeURIComponent(productIdOrName);
});

