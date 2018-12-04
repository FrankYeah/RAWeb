$(function() {

    query();
    $("#buId").change(function () {
        /*每次建立新table需先清除舊的,避免累加重複資料*/
        $(".cleartable").find("tr:gt(0)").remove();
        query();
    });

    /*彈出視窗的具體內容*/
    var createInvRow = function(portfolio) {
        var items = [
            portfolio.Code,
            portfolio.WeightString
        ];
        var $tr = $("<tr/>");
        $.each(items, function(idx, item) {
            var $td = $("<td/>").html(item);
            $tr.append( $td );
        });
        return $tr;

    };

    /*彈出整格對話框並顯示資料*/
    var displayInventorySetDialog = function(data) {
        /* 要複製物件是因為物件會被關閉,移除style是要能顯示畫面*/
        var $table = $("#inventorySet-template").clone().removeAttr("style");;
        var $tbody = $table.find("tbody");
        $.each(data.Weights, function(idx, portfolio) {
            $tbody.append(createInvRow(portfolio));
        });

        var closeBtn = {
            label: 'Close',
            action: function(dialog) {
                dialog.close();
            }
        };
        BootstrapDialog.show({
            title: "投資組合",
            message: $table,
            buttons: [closeBtn]
        });
    };

    /*將彈出事件與資料結合*/
    var createInvSetSpan = function(data) {
        var $span = $("<span/>").attr("href", "#")
            .attr("style", "color: blue; cursor: pointer; text-decoration: underline;")
            .html(data.Weights.length + " 檔");
        $span.click(function(){
            displayInventorySetDialog(data);
        });
        return $span;
    };

    /*每筆資料的內容*/
    var dataToArray = function(data){
        var $invSetSpan = createInvSetSpan(data);
        var items = [
            data.CombiID,
            data.Date,
            data.Return + "%",
            data.Variance,
            $invSetSpan,
        ];
        return items;
    };

    /*準備每一筆的資料*/
    var createRow = function(data) {
        var items = dataToArray(data);
        var $tr = $("<tr/>");
        $.each(items, function(idx, item) {
            var $td = (item instanceof jQuery) ?
                        $("<td/>").append(item) :
                        $("<td/>").html(item);
            $tr.append( $td );
        });
        return $tr;
    };

    /*準備顯示整個table*/
    function displayPortfolioTable(datas) {
        var $table = $("#portfolioTable-template");
        var $tbody = $table.find("tbody");
        $.each(datas, function(idx, data) {
            $tbody.append(createRow(data));
        });
        $table.show();
    };

    function query() {
        $.ajax({
            type : "POST",
            contentType : 'application/json',
            data: JSON.stringify({"buId" : $('#buId').val()}),
            url : fubon.contextPath+"operateManagement/getPortfolio"
        }).done(function (data, response, xhr) {
        	if(!data.status){
        		bootsrapAlert(data.exceptionMessage);
        	}else{
        		displayPortfolioTable(data.dataList);
        	}
        }).fail(function (xhr) {
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        });
    };

});

