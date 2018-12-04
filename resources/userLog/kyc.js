$(function () {

    // deal with date range
    $(".datepicker").datepicker({
        format: 'yyyy-mm-dd'
    });

    var $buId = $("#buId");
    var $userID = $("#userID");
    var $endDate = $("#endDate");
    var $beforeMonth = $("#beforeMonth");
    var $kycTableTemplate = $("#kyctable-template");


    var createKycTable = function(kycLog) {
        var items = [
            kycLog.Q_age,
            Number(kycLog.Q_savings).format(2, 3),
            kycLog.Q_members,
            kycLog.Q_non_working,
            Number(kycLog.Q_annual_income).format(2, 3),
            Number(kycLog.Q_monthly_quota).format(2, 3),
            //changeTrueFalseToChiness(kycLog.Q_experience),
            kycLog.Q_experience ? "是" : "否",
            kycLog.Q_inv_feq,
            kycLog.Q_undertake_risk * 100 + '%',
            kycLog.Q_milestone
        ];

        var $kycTable = $kycTableTemplate.clone();
        var $thead = $kycTable.find("thead");
        $thead.find("tr").find("th:eq(1)").html(kycLog.Datetime);

        var $tbody = $kycTable.find("tbody");
        $.each(items, function(idx, item) {
            var $tr = $tbody.find("tr:eq(" + idx + ")");
            var $td = $("<td/>").html(item);
            $tr.append( $td );
        });

        return $kycTable.show();
    };

    var cleanKycTables = function() {
        var $resultTable = $("#resultTable");
        $("#searchTime").text("");
        $("#frequency").text("");
        $resultTable.find(".kyctable").remove();
    };

    var displayKycTables = function(data) {
        var kycLogs = data.KycOut.Logs;
        var $resultTable = $("#resultTable");
        $("#searchTime").text(data.DateFrom + "~" + data.DateTo);
        $("#frequency").text(kycLogs.length + " 次");

        $.each(kycLogs, function(idx, kycLog) {
            $resultTable.append( createKycTable(kycLog) )
        });
        $resultTable.show();
    };

    var query = function() {
        var ajaxData = {
        	"buid": $buId.val(),
            "userID": $userID.val(),
            "endDate": $endDate.val(),
            "beforeKey": $beforeMonth.val()
        };
        $.ajax({
            type: "GET",
            contentType: 'application/json',
            url: fubon.contextPath + "userLog/kycContent",
            data: ajaxData,
            dataType: "json"
        }).done(function (data, response, xhr) {
        	if(!IsJsonString(data.Data)){
        		cleanKycTables();
        		bootsrapAlert(data.Data);
        	}else{
        		var userData = JSON.parse(data.Data);
        		console.log(userData);
   
        		cleanKycTables();
        		displayKycTables(userData);
        	}
        }).fail(function (xhr) {
            cleanKycTables();
            bootsrapAlert("err: " + xhr.status + ' '
                + xhr.statusText);
        });
    };

    $("#submitBtn").click(function () {
       // if (dateRangeValidate($endDate.val(), $beforeMonth.val())
       //     && userIDValidate($userID.val()))
       // {
       //     query()
        //}
        
        if (userIDValidate($userID.val()) &&  dateRangeValidate($endDate.val(), $beforeMonth.val()))
        	query();
    });



});
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/*檢查輸入日期起末&是否有輸入數值*/
function dateRangeValidate(endDate, beforeMonth) {
    // var dateFrom = $("#datepickerFrom").val();
    // var dateTo = $("#datepickerTo").val();
    if (endDate == null || endDate == "" || beforeMonth == null || beforeMonth == "") {
        alert("請輸入日期");
        return false;
    } else if(Date.parse(endDate).valueOf()>=Date.parse(beforeMonth).valueOf()){
        alert("輸入日期有誤");
    }else {
        return true;
    }
}

/*檢查是否有輸入 userID*/
function userIDValidate(userID) {
    // var userID = $("#userID").val();

    if (userID == null || userID == "") {
        alert("請輸入 UserID");
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

function changeTrueFalseToChiness(input) {
    var output;
    switch (input) {
        case true:
            output = "是";
            break;
        case false:
            output = "否";
            break;
        default:
            output = "未知";
    }

    return output;
}
