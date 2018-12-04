$(function() {
    // deal with date range
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd'
    });
    var $buId = $("#buId");
    var $userID = $("#userID");
    var $startDate = $("#startDate");
    var $endDate = $("#endDate");
    var $protfolioTableTemplate = $("#portfolioTable-template");
    var $inventorySetTemplate = $("#inventorySet-template");


    var createInvRow = function(invData, totalInv) {
        var items = [
            invData.Code,
            invData.Name,
            parseFloat(invData.Amount / totalInv * 100).toFixed(2) + " %",
            invData.Price,
            invData.Num,
            invData.Amount
        ];
        var $tr = $("<tr/>");
        $.each(items, function(idx, item) {
            var $td = $("<td/>").html(item);
            $tr.append( $td );
        });
        return $tr;

    };

    var displayInventorySetDialog = function(kycLog) {
        var $table = $inventorySetTemplate.clone();
        var $tbody = $table.find("tbody");
        var totalInv = kycLog.InvSet.map(function (item) { return item.Amount})
                                    .reduce(function(total, amount){ return total+amount });
        $.each(kycLog.InvSet, function(idx, invData) {
            $tbody.append( createInvRow(invData, totalInv) );
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

    var createInvSetSpan = function(kycLog) {
        var $span = $("<span/>").attr("href", "http://google.com.tw")
            .attr("style", "color: blue; cursor: pointer; text-decoration: underline;")
            .html(kycLog.InvSet.length + " 檔");
        $span.click(function(){
            displayInventorySetDialog(kycLog);
        });
        return $span;
    };

    var kycLogToArray = function(kycLog){
        var $invSetSpan = createInvSetSpan(kycLog);
        var items = [
            kycLog.Datetime,
            kycLog.TargetYears,
            Number(kycLog.TargetAmount).format(2, 3),
            Number(kycLog.SinglePurchase).format(2, 3),
            Number(kycLog.MonthlyQuota).format(2, 3),
            kycLog.RiskLevel,
            $invSetSpan,
            kycLog.InvSet.length>0 ? "Yes" : "No",
            ""
        ];
        return items;
    };

    var createKycLogRow = function(kycLog) {
        var items = kycLogToArray(kycLog);
        var $tr = $("<tr/>");
        $.each(items, function(idx, item) {
            var $td = (item instanceof jQuery) ?
                        $("<td/>").append(item) :
                        $("<td/>").html(item);
            $tr.append( $td );
        });
        return $tr;
    };

    var cleanPortfolioTable = function() {
        var $resultTable = $("#resultTable");
        $("#portfolioNum").text("");
        $("#frequency").text("");
        $resultTable.find(".table").remove();
    };

    var displayPortfolioTable = function(kycLogs) {
        var frequency = function() {
            if (kycLogs.length==0) {
                return "--";
            }

            var c = 0;
            kycLogs.forEach(function(kycLog, idx){
                if (kycLog.InvSet.length>0) c = c + 1;
            });
            return parseFloat(c / kycLogs.length * 100).toFixed(2) + " %";
        };
        var $table = $protfolioTableTemplate.clone();
        var $tbody = $table.find("tbody");
        $.each(kycLogs, function(idx, kycLog) {
            $tbody.append( createKycLogRow(kycLog) );
        });
        $table.show();
        $("#resultTable").append( $table );
        $("#portfolioNum").text('共 ' + kycLogs.length + ' 次');
        $("#frequency").text(frequency());
    };

    var query = function() {
        var ajaxData = {
        	"buid": $buId.val(),
            "userID": $userID.val(),
            "startDate": $startDate.val(),
            "endDate": $endDate.val()
        };
        $.ajax({
            type : "GET",
            contentType : 'application/json',
            url : fubon.contextPath+"userLog/portfolio",
            data : ajaxData,
            dataType: "json"
        }).done(function (data, response, xhr) {
        	//if(!IsJsonString(data.Data)){
        	//alert(data.Status)
        	if(data.Status!="Ok"){
        		
        		cleanPortfolioTable();
        		bootsrapAlert(data.Data);
        	}else{
        		var portfolioHistory = data.Data;
        		console.log(portfolioHistory);
        		cleanPortfolioTable();
        		displayPortfolioTable(portfolioHistory.Logs);
        	}
        }).fail(function (xhr) {
            cleanPortfolioTable();
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        });
    };

    $("#submitBtn").click(function() {
        if (userIDValidate($userID.val()) &&  dateRangeValidate($startDate.val(), $endDate.val()))
        	query();
        
    });
});
/*檢查是否有輸入 userID*/
function userIDValidate() {
	var userID = $("#userID").val();

	if (userID == null || userID == "") {
		
		bootsrapAlert("請輸入UserID");
		return false;
	} else {
        if(!REBUId.test(userID)){
            bootsrapAlert("userId最大長度為20，可含英文或數字");
            return false;
        }else{
            return true;
        }
	}
}
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}
function dateRangeValidate(startDate, endDate) {
    if (startDate == null || startDate == "" || endDate == null || endDate == "") {
        bootsrapAlert("請輸入日期");
        return false;
    } else if(Date.parse(startDate).valueOf()>Date.parse(endDate).valueOf()){
        bootsrapAlert("結束日期必須大於等於開始日期");
    }else {
        return true;
    }
}

