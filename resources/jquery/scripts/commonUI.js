
/*檢查輸入日期起末&是否有輸入數值*/
function dateRangeValidate() {
	var dateFrom = $("#datepickerFrom").val();
	var dateTo = $("#datepickerTo").val();
	//alert(Date.parse(dateFrom).valueOf()+","+Date.parse(dateTo).valueOf());
	
	if (dateFrom == null || dateFrom == "" || dateTo == null || dateTo == "") {
		bootsrapAlert("請輸入日期");
		return false;
	} else if(Date.parse(dateFrom).valueOf()>=Date.parse(dateTo).valueOf()){
		//alert("輸入日期有誤");
		bootsrapAlert("結束日期必須大於開始日期");
	}else {
		return true;
	}
}

/*檢查輸入日期起末&是否有輸入數值*/
function dateRangeEqualsValidate() {
	var dateFrom = $("#datepickerFrom").val();
	var dateTo = $("#datepickerTo").val();
	//alert(Date.parse(dateFrom).valueOf()+","+Date.parse(dateTo).valueOf());
	
	if (dateFrom == null || dateFrom == "" || dateTo == null || dateTo == "") {
		bootsrapAlert("請輸入日期");
		return false;
	} else if(Date.parse(dateFrom).valueOf()>Date.parse(dateTo).valueOf()){
		//alert("輸入日期有誤");
		bootsrapAlert("結束日期必須大於等於開始日期");
	}else {
		return true;
	}
}



/*給 operation_portfolioNum.jsp 頁面做資料型態轉換 畫圖*/
function arraysTransformToObject4(trans1,trans2,trans3,keys){
	output=[];
	 for (i = 0; i < trans1.length; i++) {
	        obj = {};
 
           obj[keys[0]] = trans1[i];
           obj[keys[1]] = trans2[i];
           obj[keys[2]] = trans3[i];
   
       	output.push(obj);
	    }
	console.log(output);
	return output;
}
/*給 operation_rebalanceNum.jsp 頁面做資料型態轉換 畫圖*/
function arraysTransformToObject3(trans1,trans2,keys){
	output=[];
	 for (i = 0; i < trans1.length; i++) {
	        obj = {};
 
           obj[keys[0]] = trans1[i];
           obj[keys[1]] = trans2[i];
   
       	output.push(obj);
	    }
	console.log(output);
	return output;
}

/*取得 navbar 上面的功能*/
function getNavBar(roleScope){
	var roleScope = groupProcess(roleScope);
	for (var i = 0; i < roleScope.length;i++){
		var type1Data = roleScope[i];
		var str ="<li></li>"
	    $("#bs-example-navbar-collapse-1 ul").append(str);

		var $specifyTd = $('#bs-example-navbar-collapse-1 ul li:last');
		var type1 = $('<a>').attr('href','#')
				    		.attr('class','dropdown-toggle')
				    		.attr('data-toggle','dropdown')
				    		.attr('role','button')
				    		.attr('aria-expanded','false')
	  						.append(type1Data.FName)
	  						.append($('<span>').attr('class', 'caret'));


        var type2 = $('<ul>').attr('class','dropdown-menu').attr('role','menu');

        for(j = 0; j < type1Data.type2.length; j++){
            var type2Data = type1Data.type2[j];
            if(type2Data.type3.length > 0){
                var type2Content = $('<li>').attr('class','dropdown-submenu')
											.append(
											$('<a>').attr('href','#')
											.attr('tabindex','-1')
											.append(type2Data.FName));

                var type3 = $('<ul>').attr('class','dropdown-menu');
                for (k = 0; k < type2Data.type3.length; k++){
                	var type3Data = type2Data.type3[k];
                    var type3Content = $('<li>').append(
										$('<a>').attr('tabindex','-1')
												.attr('href',projectName+type3Data.Page)
												.append(type3Data.FName));
                    type3.append(type3Content);
                    type2Content.append(type3);
                }
                type2.append(type2Content);
            }else{
                var type2Content =  $('<li>').append(
                   				              $('<a>').attr('href',projectName+type2Data.Page)
                                             .append(type2Data.FName));
                type2.append(type2Content);
			}
        }


		$specifyTd.append(type1).append(type2);
	  // $("#bs-example-navbar-collapse-1 ul").append($('<li>').append(type1).append(type2));
	}
	
	$("#logoutBtm").click(function() {
    
		// var isConfirmed
		  showConfirmBootstrap("danger","提示","您確定要登出嗎?");
		//doBrowser();
		//logoutIE();
		 
	});
	
	
	
}

/* 將資料整理階層式架構*/
function groupProcess(functionData){
    var groupTree = [];
    for (var i = 0; i < functionData.length; i++) {
        groupTree[i] = functionData[i].type1;
        var group2data = [];
        for (var j = 0; j < functionData[i].type2.length; j++) {
            var type2FID = functionData[i].type2[j].FID.substr(0,6);
            group2data[j] = functionData[i].type2[j];
            var group3data = [];
            for (var k = 0; k < functionData[i].type3.length; k++) {
                var type3FID = functionData[i].type3[k].FID.substr(0,6);
                if(type2FID === type3FID){
                    group3data.push(functionData[i].type3[k]);
                }
            }
            group2data[j].type3 = group3data;
        }
        groupTree[i].type2 = group2data;
    }
    return groupTree;
}

function doBrowser(){
      BootstrapDialog.confirm({
        size: "size-small",
        type: "type-danger", 
        title: "提示",
        message: "您確定要登出嗎?",
        cssClass: 'delete-row-dialog',
        closable: true,
        callback: function(result) {
            if(result) {
            	
            	if (!navigator.userAgent.match("Chrome") ){//!Chrome 
            		
            		if (navigator.userAgent.match("Safari") ){//Safari
            			setTimeout(logoutOther(), 3000);
            		}else{
            		    logoutIE(); //IE
            		}
            	}else{//Chrome
            	    setTimeout(logoutOther(), 3000);
            	}
            }
        }
       });

}
function showConfirmBootstrap(type,title,mesagge){
	
      BootstrapDialog.confirm({
        size: "size-small",
        type: "type-"+type, 
        title: title,
        message: mesagge,
        cssClass: 'delete-row-dialog',
        closable: true,
        callback: function(result) {
            if(result) {
            
            	setTimeout(logout(), 5000);
            	
            }
        }
       });

}

function logout(){

	location.replace(projectName+'/Logout');
}


/*取得該User是哪個 BU*/
function getBUIDsByUserID(UserID){
	console.log(userID)
	$.ajax({
		type : "GET",
		contentType : 'application/json',
		data :{"userID":UserID},
		url : "/fubon_robo/roleManage/Role/Admin/Item",
		success : function(data, response, xhr) {			
			var temp = JSON.parse(data).Data;
			var userIDdata = JSON.parse(temp); 
			
			/*判斷單位是否是 0000*/
			if(typeof(BUID)=="undefined"){
				var userIDs = userIDdata.BUs;
				for(var i=0; i< userIDs.length;i++){
					$("#buId").append($("<option></option>").attr("value",userIDs[i].BUID).text(userIDs[i].BUName+userIDs[i].BUID));
				}
				
			}else{
				$("#buId").append($("<option></option>").attr("value",BUID).text(BUName+BUID));
			}
		},
		error : function(xhr) {
			alert("err: " + xhr.status + ' '
					+ xhr.statusText);
		}	
	});
}

function bootsrapAlert(Msg){
	 BootstrapDialog.show({
		 type :BootstrapDialog.TYPE_PRIMARY,
		 closable: false,
		 title: '訊息',
         message: Msg,
         buttons: [{
             label: 'Close',
             action: function(dialogRef){
                 dialogRef.close();
             }
         }]
     });
}

function ShowExceptionDialog(responseText) {
    var returnData, message;
    try {
        returnData = JSON.parse(responseText);
        message = (returnData.exception) ? returnData.message : responseText;
    } catch(ex) {
        message = responseText;
    }
    BootstrapDialog.show({ type: BootstrapDialog.TYPE_WARNING, message: message});
}

/*做分頁的權限顯示 for FType = 2*/
function getNavtabsByRoleScope(pageNameTyp1,pageNameTyp2){
	var htmls = [];
	for(var i=0; i< roleScope.length ; i++){
		if(roleScope[i].type1.Page==pageNameTyp1){	
			for(j = 0; j < roleScope[i].type2.length; j ++){
				var index = roleScope[i].type2[j].Page.lastIndexOf("/");
				console.log(roleScope[i].type2[j].Page);
				console.log(index);
				var str = roleScope[i].type2[j].Page.substr(index+1);
				var className = '';
				if(str == pageNameTyp2){
					className = "active";
				}
				var projectName = fubon.contextPath.replace(/\//g, "");
				htmls.push('<li class="'+className+'"><a href="/'+projectName+roleScope[i].type2[j].Page+'">'+roleScope[i].type2[j].FName+'</a></li>')
			}
			break;
		}
	}
	$('#navi').html(htmls.join(""));
	
}

/*做分頁的權限顯示 for FType = 3*/
function getNavtabsByRoleScopeForType3(pageNameTyp1,pageNameTyp2,pageNameTyp3){
	var htmls = [];
	for(var i=0; i< roleScope.length ; i++){
		if(roleScope[i].type1.Page==pageNameTyp1){	
			for(j = 0; j < roleScope[i].type2.length; j ++){
				if(roleScope[i].type2[j].Page==pageNameTyp2){	
					for(k = 0; k < roleScope[i].type3.length; k++){
						if(roleScope[i].type3[k].Layer==j+1){
							var index = roleScope[i].type3[k].Page.lastIndexOf("/");
							var str = roleScope[i].type3[k].Page.substr(index+1);
							var className = '';
							if(str == pageNameTyp3){
								className = "active";
							}
							var projectName = fubon.contextPath.replace(/\//g, "");
							htmls.push('<li class="'+className+'"><a href="/'+projectName+roleScope[i].type3[k].Page+'">'+roleScope[i].type3[k].FName+'</a></li>')
							
						}
					}
					break;
				}
	
			}
			break;
		}
	}
	$('#navi').html(htmls.join(""));
	
}

/**
 * Format numbers.
 *
 * https://stackoverflow.com/a/14428340/3155650
 *
 */
Number.prototype.format = function(n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
};

/**
 * Wrap String
 * https://stackoverflow.com/a/14502311/3155650
 */
function stringDivider(str, width, spaceReplacer) {
    if (str.length>width) {
        var p=width;
        for (; p>0 && str[p]!==' '; p--) {
        }
        if (p>0) {
            var left = str.substring(0, p);
            var right = str.substring(p+1);
            return left + spaceReplacer + stringDivider(right, width, spaceReplacer);
        }
    }
    return str;
}